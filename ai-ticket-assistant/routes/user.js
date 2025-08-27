import express, { Router } from "express"
import { getUsers, login, logout, signup, updateUser } from "../controllers/user.js"
import { authnticate } from "../middleware/auth.js"
const router=express.Router()
router.post("/signup",signup)
router.post("/login",login)
router.post("/update-user",authnticate,updateUser)
router.post("/logout",logout)
router.get("/users",authnticate,getUsers)

export default router