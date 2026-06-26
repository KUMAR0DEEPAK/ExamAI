import express from "express";
import isAuth from "../middleware/isAuth.js";
import {
  createCreditOrder,
  verifyPayment,
} from "../controllers/credits.controller.js";

const creditRouter = express.Router();

creditRouter.post("/order", isAuth, createCreditOrder);
creditRouter.post("/verify", isAuth, verifyPayment);

export default creditRouter;