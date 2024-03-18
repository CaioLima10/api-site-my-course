import express from "express";
import {
  login,
  register,
  refresh,
  logout,
} from "../controllers/auth-controllers.js";

const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.get("/refresh", refresh);
authRouter.post("/logout", logout);

export default authRouter;
