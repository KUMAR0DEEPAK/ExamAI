import express from 'express';
import dotenv from 'dotenv';
import connectDB from './utils/connectDB.js'
import authRouter from './routes/auth.route.js'
import userRouter from './routes/user.route.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import notesRouter from './routes/generate.route.js';
import pdfRouter from './routes/pdf.route.js'
import creditRouter from './routes/payment.route.js';
import subscribeRoutes from "./routes/subscription.route.js";
dotenv.config();


const app = express();

app.use(
  cors({

    origin:"https://examai-g2el.onrender.com" || process.env.CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  })
);

app.use(express.json());
app.use(cookieParser());

const port = process.env.PORT || 8000;
app.get("/", (req, res) => {
  res.send({ message: `backend is running on port ${port}` });
})
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/notes", notesRouter);
app.use("/api/notes", pdfRouter);
app.use("/api/credit", creditRouter);
app.use("/api", subscribeRoutes);

app.listen(port, () => {
  connectDB();
  console.log(`backend is listening on port : ${port}`);
})