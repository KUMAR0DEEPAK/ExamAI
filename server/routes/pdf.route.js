import express from "express";
import isAuth from "../middleware/isAuth.js";
import {downloadPdf} from '../controllers/pdf.controller.js';

const pdfRouter = express.Router();

pdfRouter.post("/generate-pdf", isAuth, downloadPdf);

export default pdfRouter;
