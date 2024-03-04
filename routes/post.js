import express from "express";
import { createdPost, getPost } from "../controllers/post-controllers.js";

const router = express.Router();

router.post("/", createdPost);
router.get("/", getPost);

export default router;
