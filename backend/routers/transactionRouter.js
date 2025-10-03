import express from "express";
import {
  listAllTransactions,
  createOrUpdateTransaction,
  updateTransactionAmount,
} from "../controllers/transactionController.js";

export default function transactionRoutes(driver) {
  const router = express.Router();

  router.get("/", async (req, res) => {
    const response = await listAllTransactions(driver);
    if (response.success) {
      res.status(200).json(response.transactions);
    } else {
      res.status(500).json({ error: response.error });
    }
  });

  router.post("/", async (req, res) => {
    const response = await createOrUpdateTransaction(driver, req.body);
    if (response.success) {
      res.status(200).json({ message: response.message });
    } else {
      res.status(500).json({ error: response.error });
    }
  });
  router.post("/update", async (req, res) => {
    const response = await updateTransactionAmount(driver, req.body);
    if (response.success) {
      res.status(200).json({ message: response.message });
    } else {
      res.status(500).json({ error: response.error });
    }
  });

  return router;
}
