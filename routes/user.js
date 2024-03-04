import express from "express";
import { getUser } from "../controllers/users-controllers.js";

const userRouter = express.Router();

userRouter.get("/teste", getUser);

export default userRouter;
