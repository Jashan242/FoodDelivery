const jwt=require("jsonwebtoken");
require("dotenv").config();

exports.generationToken=(userData)=>{
    return jwt.sign(
        {
            _id:userData._id,
            username:userData.username,
            email:userData.email,
            role:userData.role
        }, 
        process.env.JWT_SECRET, {
            expiresIn:"7d"
        }   
    )
}

exports.verifyToken=(token)=>{
    try{
        return jwt.verify(token, process.env.JWT_SECRET);
        
    }
    catch(error){
        return null;
    }
}