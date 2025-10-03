import express from "express";
import {
  getTransactionRelationships,
  getUserRelationships,
} from "../controllers/relationController.js";

export default function relationshipRoutes(driver) {
  const router = express.Router();

  router.get("/user/:id", async (req, res) => {
    const { id } = req.params;
    const response = await getUserRelationships(driver, id);

    if (response.success) {
      res.status(200).json(response.relationships);
    } else {
      res.status(500).json({ error: response.error });
    }
  });

  router.get("/transaction/:id", async (req, res) => {
    const { id } = req.params;
    const response = await getTransactionRelationships(driver, id);

    if (response.success) {
      res.status(200).json(response.relationships);
    } else {
      res.status(500).json({ error: response.error });
    }
  });

  return router;
}
