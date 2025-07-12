import jwt from "jsonwebtoken"
import dotenv from "dotenv";
dotenv.config();
const authMiddleware = (req,res, next) =>{
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith("Bearer ")){
        return res.status(401).json({msg: "Invalid token. Denied access"});
    }

    const token = authHeader.split (" ")[1];
        try{
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
            next();

        } catch(err){
            console.error("Invalid token: ", err);
            res.status(401).json({msg: "Invalid token."});

        }

}
export default authMiddleware;