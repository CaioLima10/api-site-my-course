import express from "express";
import {
  createdLikes,
  getLikes,
  deleteLikes,
} from "../controllers/likes-controllers.js";

const router = express.Router();

router.post("/", createdLikes);
router.get("/", getLikes);
router.delete("/", deleteLikes);

export default router;
