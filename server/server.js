import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import userRoutes from "./routes/user.js";
import authRoutes from "./routes/auth.js";
import createRoutes from "./routes/post.js";
dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded());


// Route
app.use("/api/auth", authRoutes);
app.use("/api/post",createRoutes);
app.use("/api/users", userRoutes);
app.use('/uploads', express.static('uploads'));

// Kết nối MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log(" Kết nối MongoDB thành công");
    app.listen(process.env.PORT, () =>
      console.log(` Server chạy tại cổng ${process.env.PORT}`)
    );
  })
  .catch((err) => console.error(" MongoDB lỗi:", err));
