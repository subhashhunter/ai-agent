import express from "express"
import { authnticate } from "../middleware/auth.js"
import { CreateTicket, getTicket, getTickets } from "../controllers/ticket.js"

const router=express.Router()

router.get("/",authnticate,getTickets)
router.get("/:id",authnticate,getTicket)
router.post("/",authnticate,CreateTicket)

export default router