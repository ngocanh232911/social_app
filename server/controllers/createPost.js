import multer from "multer";
import path from "path";
import Post  from "../models/Post.js";

export const createPost = async (req, res) => {
  try {
    const { content } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : "";

    if (!content && !imageUrl) {
      return res.status(400).json({ error: "Please try again." });
    }

    const newPost = new Post({
      text: content,    // phải map sang `text`
      image: imageUrl,  // phải map sang `image`
      user: req.user.id,
    });

    const savedPost = await newPost.save();
    await savedPost.populate("user", "name avatar");


    res.status(201).json(savedPost);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Cannot create the post. ", details: err.message });
  }
};
