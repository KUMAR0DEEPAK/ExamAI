import express from 'express'
import {googleAuth, logOut} from '../controllers/auth.controller.js'
const authRoute=express.Router();

authRoute.post("/google",googleAuth);
authRoute.get("/logout",logOut)

export default authRoute;