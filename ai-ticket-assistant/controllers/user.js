import bcrypt from "bcrypt"
import User from "../models/user.js";
import { inngest } from "../inggest/client.js";
import jwt from "jsonwebtoken"
export const signup=async(req,res)=>{
    const{email,password,skills=[]}= req.body;
   try {
    const hashed=await bcrypt.hash(password,10)
     const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }
    const user=await User.create({
        email,password:hashed,skills
    })

    await inngest.send({
        name:"user/signup",
        data:{
            email
        }
    
    })
    console.log("gmail")
    const token= jwt.sign({_id:user._id,role:user.role},process.env.JWT_SECRET)
    res.json({token})
   } catch (error) {
    console.log(error)
    res.status(500).json({message:"error doing signup",details:error.message})
   }
    
}
export const login=async(req,res)=>{
    const{email,password}=req.body
    try {
    const user=await User.findOne({email})
    if(!user)
       {
        return res.json({error:"user not found with this email"})
       }
    const isMatch=await bcrypt.compare(password,user.password)
    if(!isMatch)
    {
        return res.status(401).json({message:"password is incorrect"})
    }
     await inngest.send({
        name:"user/signup",
        data:{
            email
        }
    })
    const token= jwt.sign({_id:user._id,role:user.role},process.env.JWT_SECRET)
    res.json({token})
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"error while login",details:error.message})
    }
}
export const logout=async(req,res)=>{
    try {
        const token=req.header.authorization.split(" ")[1]
        if(!token)
        return res.status(401).json({error:"unauthorised and invalid token"})

        jwt.verify(token,process.env.JWT_SECRET,(err,decoded)=>{
            if(err)
            {
                return res.status(401).json("unauthorised")
            }
        })
        res.json({message:"Logout successfully"})
    } catch (error) {
        res.status(500).json({message:"Logout falied",details:error.message})
    }
}

export const updateUser=async(req,res)=>{
    const{email,role,skills=[]}=req.body
    try {
        if(req.user.role!=="admin")
        {
            return res.status(403).json({error:forbidden})
        }
        const user=await User.findOne({email})
        if(!user)
        {
            return res.json({message:"no user found"})
        }
        await User.updateOne(
            {email},
            {skills:skills.length ? skills: user.skills}
        )
        return res.status(200).json({message:"user updated successfully"})
    } catch (error) {
        res.status(500).json({message:"update falied",details:error.message})
    }
}


export const getUsers=async(req,res)=>{
    try {
        if(req.user.role!=="admin")
        {
            return res.status(403).json({error:forbidden})
        }
       const users= await User.find().select("-password")
       return res.json(users)
    } catch (error) {
        res.status(500).json({message:"could not get users",details:error.message})
    }
}