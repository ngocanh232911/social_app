import Post from "../models/Post.js";
import User from "../models/User.js";
export const likePost = async(req,res) =>{
    try{
        const post = await Post.findById(req.params.id);
        const userId = req.user.id;
        if(!post) return res.status(404).json({msg: "Cannot find the post. Please try again"});
        const alreadyLiked = post.likes.includes(userId);
        if(alreadyLiked){
            post.likes = post.likes.filter((id) => id.toString() !== userId);

        } else {
            post.likes.push(userId);
        }
        await post.save();
        res.json({liked: !alreadyLiked, totalLikes: post.likes.length});

    } catch(err){
        console.error("Cannot like/unlike: ", err);
        res.status(500).json({msg: "Cannot like or unlike this post."})
    }
};
export const addComment = async(req, res) =>{
    try{
        const post = await Post.findById(req.params.id);
        const userId = req.user.id;  
        const {text} = req.body;
        if(!post) return res.status(404).json({msg: "Cannot find the post. Please try again"});
        if(!text || text.trim() == "")
            return res.status(400).json({msg: "Please try again"}
        );
        const newComment = {
            user: userId,
            text,
            createdAt: new Date(),
        };
        post.comments.unshift(newComment);
        await post.save();
        res.status(201).json(newComment);
    }
    catch(err){
        console.error("Cannot post comment ", err);
        res.status(500).json({msg: "Error. Please try again."})

    }
}

export const deletePost = async(req,res) =>{
    try{
        const post = await Post.findById(req.params.id);
        if(!post) return res.status(404).json({msg: "Cannot find the post. Please try again"});
        if (post.user.toString() !== req.user.id) {
         return res.status(403).json({ msg: "You cannot delete this post." });
    
    }
    await post.deleteOne();
    res.json({msg: "Delete successful!"});

    } catch(err){
        console.error("Error ", err);
        res.status(500).json({ msg: "Error. Please try again." });


    }
}
export const deleteComment = async(req,res) =>{
    try{
        const post = await Post.findById(req.params.id);
        if(!post) return res.status(404).json({msg: "Cannot find the post. Please try again"});
        const comment = post.comments.id(req.params.commentId);
        if (!comment) return res.status(404).json({ msg: "Cannot find the comment." });
        const isMatch = comment.user.toString() === req.user.id;
        const isOwner = post.user.toString() === req.user.id;
        if (!isOwner && !isMatch) {
      return res.status(403).json({ msg: "You cannot delete this comment." });
    }
    post.comments = post.comments.filter(
      (c) => c._id.toString() !== req.params.commentId
    );
    await post.save();
    res.json({msg: "Delete successful!"})

    }
    catch(err){
        console.error("Error ", err);
        res.status(500).json({ msg: "Error. Please try again." });


    }
}

export const getPosts = async(req,res) =>{
    try{
        const { page = 1, limit = 10, q = "" } = req.query;
        const skip = (page - 1) * limit;
        const query = q
      ? {
          text: { $regex: q, $options: "i" } // i = ignore case
        }
      : {};

        const posts = await Post.find(query)
        .sort({createdAt: -1})
        .skip(skip)
        .limit(limit)
        .populate("user")
        .populate("comments.user", "name")
        .lean();
         res.json({ page: parseInt(page), limit: parseInt(limit), q, posts });
    }
    catch(err){
        console.error("Cannot get the post: ", err);
        res.status(500).json({msg: "Cannot get the post. "})
    }
}