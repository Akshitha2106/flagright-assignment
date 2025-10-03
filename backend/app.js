import express from "express";
import cors from "cors";
import relationRouter from "./routers/relationRouter.js";
import userRouter from "./routers/userRouter.js";
import transactionRouter from "./routers/transactionRouter.js";

export default function createApp(driver) {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());

  // Routes
  app.use("/transactions", transactionRouter(driver));
  app.use("/users", userRouter(driver));
  app.use("/relationships", relationRouter(driver));

  return app;
}
