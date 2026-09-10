const { spawn } = require("node:child_process");
const path = require("node:path");

const cliPath = require.resolve("@mockoon/cli/bin/run.js");
const dataPath = path.join(__dirname, "transfer-app-mock.json");
const port = process.env.PORT ?? "5566";
const mock = spawn(
  process.execPath,
  [cliPath, "start", "--data", dataPath, "--port", port, "--hostname", "0.0.0.0"],
  { stdio: "inherit" },
);

const stop = (signal) => mock.kill(signal);

process.on("SIGINT", () => stop("SIGINT"));
process.on("SIGTERM", () => stop("SIGTERM"));
mock.on("exit", (code) => process.exit(code ?? 0));
