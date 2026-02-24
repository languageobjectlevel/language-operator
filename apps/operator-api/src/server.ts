import { createApp } from "./app.js";

const port = Number(process.env.PORT ?? 3000);
const host = process.env.HOST ?? "0.0.0.0";

const app = createApp();

app
  .listen({ port, host })
  .then(() => {
    console.log(`language-operator listening on ${host}:${port}`);
  })
  .catch((error: unknown) => {
    console.error("Failed to start language-operator", error);
    process.exit(1);
  });
