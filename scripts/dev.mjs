import { spawn } from "node:child_process";
import net from "node:net";

const yarnCommand = process.platform === "win32" ? "yarn.cmd" : "yarn";
const apiPort = 5566;

function run(command, args) {
  return spawn(command, args, {
    stdio: "inherit",
    env: process.env,
  });
}

function isPortOpen(port) {
  return new Promise((resolve) => {
    const socket = net.createConnection({ host: "127.0.0.1", port });

    socket.once("connect", () => {
      socket.destroy();
      resolve(true);
    });

    socket.once("error", () => resolve(false));
  });
}

async function waitForPort(port, timeoutMs = 30000) {
  const startedAt = Date.now();

  while (Date.now() - startedAt < timeoutMs) {
    if (await isPortOpen(port)) return true;
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  return false;
}

const api = run("npm", ["--prefix", "apps/api", "run", "dev"]);
const apiReady = await waitForPort(apiPort);

if (!apiReady) {
  api.kill("SIGTERM");
  console.error(`La API no estuvo disponible en el puerto ${apiPort}.`);
  process.exit(1);
}

const web = run(yarnCommand, ["workspace", "@lafise/web", "dev"]);

function shutdown() {
  api.kill("SIGTERM");
  web.kill("SIGTERM");
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

web.on("exit", (code) => {
  api.kill("SIGTERM");
  process.exit(code ?? 0);
});
