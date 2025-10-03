import express from "express";
import {
  listAllUsers,
  createOrUpdateUser,
} from "../controllers/userController.js";

export default function userRoutes(driver) {
  const router = express.Router();

  router.get("/", async (req, res) => {
    const response = await listAllUsers(driver);
    if (response.success) {
      res.status(200).json(response.users);
    } else {
      res.status(500).json({ error: response.error });
    }
  });

  router.post("/", async (req, res) => {
    const response = await createOrUpdateUser(driver, req.body);
    if (response.success) {
      res.status(200).json({ message: response.message });
    } else {
      res.status(500).json({ error: response.error });
    }
  });

  return router;
}
