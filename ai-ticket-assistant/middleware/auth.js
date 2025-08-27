import jwt from "jsonwebtoken"

export const authnticate=(req,res,next)=>{
    const token=req.headers.authorization?.split(" ")[1]
    if(!token)
    {
        return res.status(401).json({message:"token not found,Access denied"})
    }
    try {
    const decoded=jwt.verify(token,process.env.JWT_SECRET)
   
    req.user=decoded
    next()
    } catch (error) {
        return res.status(401).json({error:"Invalid token"})
    }
}
