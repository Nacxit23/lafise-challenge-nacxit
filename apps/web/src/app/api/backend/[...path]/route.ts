import type { NextRequest } from "next/server";

interface ProxyRouteContext {
  params: Promise<{ path: string[] }>;
}

const BODYLESS_METHODS = new Set(["GET", "HEAD"]);
const REQUEST_HEADERS_TO_REMOVE = ["connection", "content-length", "host", "origin", "referer"];

const getBackendUrl = (request: NextRequest, path: string[]) => {
  const configuredUrl =
    process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:5566";
  const backendUrl = new URL(configuredUrl);

  if (backendUrl.origin === request.nextUrl.origin) {
    throw new Error("API_URL debe apuntar al backend, no al frontend de Vercel.");
  }

  const basePath = backendUrl.pathname.replace(/\/$/, "");
  const requestPath = path.map(encodeURIComponent).join("/");

  backendUrl.pathname = `${basePath}/${requestPath}`;
  backendUrl.search = request.nextUrl.search;

  return backendUrl;
};

const proxyRequest = async (request: NextRequest, context: ProxyRouteContext) => {
  try {
    const { path } = await context.params;
    const backendUrl = getBackendUrl(request, path);
    const headers = new Headers(request.headers);

    REQUEST_HEADERS_TO_REMOVE.forEach((header) => headers.delete(header));

    const response = await fetch(backendUrl, {
      method: request.method,
      headers,
      body: BODYLESS_METHODS.has(request.method) ? undefined : await request.arrayBuffer(),
      cache: "no-store",
      signal: AbortSignal.timeout(15_000),
    });
    const responseHeaders = new Headers();
    const contentType = response.headers.get("content-type");

    if (contentType) {
      responseHeaders.set("content-type", contentType);
    }

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "No fue posible contactar el backend.";

    return Response.json({ message }, { status: 502 });
  }
};

export const dynamic = "force-dynamic";
export { proxyRequest as DELETE, proxyRequest as GET, proxyRequest as PATCH, proxyRequest as POST };
