const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./openapi.json");

const app = express();
const port = process.env.PORT || 5567;

const corsMiddleware = (request, response, next) => {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,PATCH,DELETE,HEAD,OPTIONS",
  );
  response.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type,Origin,Accept,Authorization,X-Requested-With,X-Throw",
  );
  response.setHeader("Access-Control-Max-Age", "86400");

  if (request.method === "OPTIONS") {
    return response.sendStatus(204);
  }

  return next();
};

app.disable("x-powered-by");
app.use(corsMiddleware);
app.use(express.json());

app.post("/auth/login", (request, response) => {
  const { username, password } = request.body || {};

  if (username === "josueperez26" && password === "lafiseDemouser") {
    return response.status(200).json({
      token: "mock-token-lafise-digital-2026",
      expiresIn: 7200,
      user: { id: 1 },
    });
  }

  return response.status(401).json({
    type: "https://tools.ietf.org/html/rfc7235#section-3.1",
    title: "Credenciales incorrectas",
    status: 401,
  });
});

app.get("/users/:userId", (_request, response) =>
  response.json({
    full_name: "Josué Antonio Pérez López",
    profile_photo:
      "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png",
    products: [
      { type: "Account", id: "1134948394" },
      { type: "Account", id: "1134948375" },
    ],
  }),
);

app.get("/accounts/:accountId", (request, response) => {
  if (request.params.accountId === "112233009") {
    return response.status(404).json({
      type: "https://tools.ietf.org/html/rfc7231#section-6.6.1",
      title: "Resource not found",
      status: 404,
    });
  }

  return response.json({
    alias: "Cuenta de ahorro",
    account_number: 1134948394,
    balance: 7500,
    currency: "NIO",
  });
});

app.get("/accounts/:accountId/transactions", (request, response) => {
  if (request.params.accountId === "112233009") {
    return response.status(404).json({
      type: "https://tools.ietf.org/html/rfc7231#section-6.6.1",
      title: "Resource not found",
      status: 404,
    });
  }

  return response.json({
    page: 1,
    size: 10,
    next: 0,
    total_count: 1,
    items: [
      {
        transaction_number: "123456",
        description: "Paga quincenal",
        bank_description: "Banco",
        transaction_type: "Credit",
        amount: { currency: "NIO", value: 1000 },
        origin: "123456789",
        destination: "987654321",
        transaction_date: "2026-08-15T12:00:00-06:00",
      },
    ],
  });
});

app.post("/transactions", (request, response) => {
  if (request.get("x-throw")) {
    return response.status(500).json({
      type: "https://tools.ietf.org/html/rfc7231#section-6.6.1",
      title: "An error has ocurred. Try again",
      status: 500,
    });
  }

  const { amount = {}, origin = "1122334455", destination = "1122335566" } =
    request.body || {};

  if (amount.currency === "USD") {
    return response.status(400).json({
      type: "https://tools.ietf.org/html/rfc7231#section-6.6.1",
      title: "Currency not valid",
      status: 400,
    });
  }

  return response.status(201).json({
    transaction_number: String(Math.floor(Math.random() * 100000)),
    description: "Transferencia",
    bank_description: "Banco",
    transaction_type: "Debit",
    amount: {
      currency: amount.currency || "NIO",
      value: amount.value ?? 1000,
    },
    origin,
    destination,
    transaction_date: new Date().toISOString(),
  });
});

app.use("/", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

if (require.main === module) {
  app.listen(port, () => {
    console.log(`API and Swagger UI running on http://localhost:${port}`);
  });
}

module.exports = app;
