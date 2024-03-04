import express from "express";

import {
  createdComment,
  getComment,
} from "../controllers/comment-controllers.js";

const router = express.Router();

router.post("/", createdComment);
router.get("/", getComment);

export default router;
