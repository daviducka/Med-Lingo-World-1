import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import path from "path";
import { fileURLToPath } from "url";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(cors());

// Webhook endpoints need raw body for signature verification (must be before JSON parsing)
app.post("/api/payments/webhook", express.raw({ type: "application/json" }), (req, res, next) => {
  // Convert raw body to string for Stripe verification
  if (Buffer.isBuffer(req.body)) {
    (req as any).rawBody = req.body.toString('utf8');
  }
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

// Serve frontend static files
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const frontendPath = path.join(__dirname, "../../ellingo/dist/public");

app.use(express.static(frontendPath));

app.get("/{*splat}", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

export default app;
