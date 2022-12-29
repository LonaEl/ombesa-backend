import express from "express";
const router = express.Router();

import { login, register, forgotPassword, resetPassword } from "../controllers/auth.js";

router.route("/api/register").post(register);

router.route("/api/login").post(login);

router.route("/api/forgotpassword").post(forgotPassword);

router.route("/api/passwordreset/:resetToken").put(resetPassword);

export default router;
