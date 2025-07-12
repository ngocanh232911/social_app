import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";
import { createPost } from "../controllers/createPost.js"
import { likePost, addComment, deletePost, deleteComment, getPosts} from "../controllers/postController.js";
const router = express.Router();

router.put("/:id/like", authMiddleware, likePost); //done
router.post("/:id/comment", authMiddleware, addComment);//done
router.delete("/:id", authMiddleware, deletePost); //done
router.delete("/:id/comments/:commentId", authMiddleware, deleteComment);//done
router.get("/", authMiddleware, getPosts); //done
router.post("/", authMiddleware, upload.single("image"), createPost);//done

export default router;
