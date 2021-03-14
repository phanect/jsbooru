"use strict";

const { spawn } = require("child_process");
const { resolve } = require("path");
const redbird = require("redbird");

const lerna = spawn("npx", [ "lerna", "run", "dev", "--stream" ], {
  cwd: resolve(__dirname, "../"),
  stdio: "inherit",
});

process.on("SIGBREAK", () => lerna.kill("SIGBREAK"));
process.on("SIGHUP", () => lerna.kill("SIGHUP"));
process.on("SIGINT", () => lerna.kill("SIGINT"));
process.on("SIGTERM", () => lerna.kill("SIGTERM"));

lerna.on("exit", (code, signal) => {
  let exitCode = code;
  // exit code could be null when OS kills the process (out of memory, etc) or due to node handling it
  // but if the signal is SIGINT the user exited the process so we want exit code 0
  if (exitCode === null) {
    exitCode = signal === "SIGINT" ? 0 : 1;
  }
  process.exit(exitCode);
});

const proxy = redbird({ port: 3000 });
proxy.register("localhost/api", "127.0.0.1:3001/api");
proxy.register("localhost/img", "127.0.0.1:3001/img");
proxy.register("localhost/thumb", "127.0.0.1:3001/thumb");
proxy.register("localhost", "127.0.0.1:3002");
