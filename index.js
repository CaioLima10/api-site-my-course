import express from "express";
import userRouter from "./routes/user.js";
import authRouter from "./routes/auth.js";
import postRouter from "./routes/post.js";
import commentRouter from "./routes/comment.js";
import likesRouter from "./routes/likes.js";
import cors from "cors";
import cookieParser from "cookie-parser";

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
  methods: ["GET", "POST", "DELETE", "PUT"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "Access-Control-Allow-Credentials",
  ],
};

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors(corsOptions));
app.use(cookieParser());

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/post", postRouter);
app.use("/api/comment", commentRouter);
app.use("/api/likes", likesRouter);

app.listen(8001, () => {
  console.log("Servidor conectado na porta 8001");
});
