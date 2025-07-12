import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();


export const registerUser = async(req, res) =>{
    try{
        const {name, email, password} = req.body;
        if(!name || !email || !password){
            return res.status(400).json({msg: "Please complete information"})
        };
        const existing = await User.findOne({email});
        if(existing){
            return res.status(400).json({msg: "Email exist!"});

        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        //create
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
        });
        await newUser.save();
        const token = jwt.sign({id: newUser._id}, process.env.JWT_SECRET,{expiresIn: "1d",} );
        res.status(201).json({
            token, 
            user:{
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,

            },
        });
    }
    catch(err){
        console.log("Error: ", err);
        res.status(500).json({msg:"Error failed"})
    }
    
}

export const loginUser = async(req,res) =>{
    try{
        const {email, password} = req.body;
        if(!email || !password){
            return res.status(400).json({msg: "Please complete information"});

        }
        const user = await User.findOne({email});
        if(!user){
            return res.status(401).json({msg: "Invalid email or password"});

        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(401).json({msg: "Invalid email or password"});
        }
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: "1d",});
        res.json({
            token,
            user:{
                id:user._id,
                name: user.name,
                email: user.email,
            }
        });

    } catch(err){
        console.error("Errot: ", err);
        res.status(500).son({msg: "Server failed. "})
    }
}

