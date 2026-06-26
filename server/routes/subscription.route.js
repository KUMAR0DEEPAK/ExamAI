import express from "express";
import { subscribeUser } from "../controllers/subscribe.controller.js";

const router = express.Router();

router.post("/subscribe", subscribeUser);

export default router;