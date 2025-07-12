import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { getUserInfo, updateMyProfile } from "../controllers/userController.js";
import { followUser, unfollowUser,getFollowers, getFollowing } from "../controllers/userController.js";
const router = express.Router();

router.get("/:id", authMiddleware, getUserInfo); // done
router.put("/me", authMiddleware, updateMyProfile);// done

router.put("/:id/follow", authMiddleware, followUser);
router.put("/:id/unfollow", authMiddleware, unfollowUser);

router.get("/:id/followers", authMiddleware, getFollowers);
router.get("/:id/following", authMiddleware, getFollowing);
export default router;
