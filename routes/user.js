import express from "express";
import { getUser, updateUser } from "../controllers/users-controllers.js";

const userRouter = express.Router();

userRouter.get("/get-user", getUser);
userRouter.put("/update-user", updateUser);

export default userRouter;
