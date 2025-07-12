import User from "../models/User.js";
import mongoose from "mongoose";
export const getUserInfo = async(req, res) =>{
    const { id } = req.params;

  // Kiểm tra ID hợp lệ
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (err) {
    console.error("Cannot get the information:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }

}
export const updateMyProfile = async(req,res) =>{
    try{
    const updateFields = (({ name, bio, avatar, location, website }) => ({ name, bio, avatar, location, website }))(req.body);
    const updated = await User.findByIdAndUpdate(
        req.user.id,
        { $set: updateFields },
        { new: true, runValidators: true } 
        ).select("-password");         
    res.json(updated);
    } 
    catch(err){
        console.error("Cannot update your profile: ", err);
        res.status(500).json({msg: "Cannot update your rofile. Please try again."})
    }
}
export const followUser = async(req, res) =>{
    try{
        const userToFollow = await User.findById(req.params.id);

         const currentUser = await User.findById(req.user.id);
         if(!userToFollow) return res.status(404).json({msg: "User does not exist"});
         if (!currentUser.following.includes(userToFollow._id)) {
             currentUser.following.push(userToFollow._id);
             userToFollow.followers.push(currentUser._id);
             await currentUser.save();
             await userToFollow.save();

         }
         res.json( {msg: `You are following ${userToFollow.name}`});
    } catch(err)
    {
            res.status(500).json({ msg: "Cannot follow this user. Please try again. " });
    }
}
export const unfollowUser = async(req, res) =>{
    try{
        const userToUnfollow = await User.findById(req.params.id);
        const currentUser = await User.findById(req.user.id);
        if(!userToUnfollow) return res.status(404).json({msg: "User does not exist"});
        currentUser.following = currentUser.following.filter((id)=> !id.equals(userToUnfollow._id));
        userToUnfollow.followers = userToUnfollow.followers.filter(
      (id) => !id.equals(currentUser._id));
      await currentUser.save();
      await userToUnfollow.save();
      res.json({ msg: `Đã hủy follow ${userToUnfollow.name}` });
    }
    catch(err){
        console.error("Cannot unfollow: ", err)
        res.status(500).json({msg: "Cannot unfollow. Please try again"})
    }

}
/// Lấy danh sách followers
export const getFollowers = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate("followers", "name avatar");
    res.json(user.followers);
  } catch (err) {
    res.status(500).json({ msg: "Cannot get the followers list." });
  }
};

// Lấy danh sách following
export const getFollowing = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate("following", "name avatar");
    res.json(user.following);
  } catch (err) {
    res.status(500).json({ msg: "Cannot get the followwing list." });
  }
};
