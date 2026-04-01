import app from "./app";
import { logger } from "./lib/logger";
import { runAutoSeedIfEmpty } from "@workspace/db";

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

// Seed the production database automatically if it's empty
runAutoSeedIfEmpty().then(() => {
  app.listen(port, (err) => {
    if (err) {
      logger.error({ err }, "Error listening on port");
      process.exit(1);
    }

    logger.info({ port }, "Server listening");
  });
}).catch((err) => {
  logger.error({ err }, "Auto-seed failed — starting server anyway");
  app.listen(port, (err2) => {
    if (err2) {
      logger.error({ err: err2 }, "Error listening on port");
      process.exit(1);
    }
    logger.info({ port }, "Server listening");
  });
});
