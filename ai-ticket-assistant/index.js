import mongoose from "mongoose";
import express from "express"
import {serve} from "inngest/express"
import userRouter from "./routes/user.js";
import TicketRoutes from "./routes/ticket.js";
import cors from "cors"
import { inngest } from "./inggest/client.js";
import { onUserSignup } from "./inggest/functions/on-signup.js";
import { onTicketCreated } from "./inggest/functions/on-ticket-create.js";

const PORT=process.env.PORT || 3000

const app=express()
app.use(cors())
app.use(express.json())

import dotenv from "dotenv";
dotenv.config();

app.use("/api/auth",userRouter)
app.use("/api/tickets",TicketRoutes)
app.use(
    "/api/inngest",
    serve({
        client:inngest,
        functions:[onTicketCreated,onUserSignup]
    })
)
mongoose
    .connect(process.env.MONGO_URI)
    .then(()=>{
        console.log("connected successfully to db")
        app.listen(PORT,()=>console.log("server at http://localhost:3000"))
    })
    .catch((err)=>console.error("Mongo db error",err.message))