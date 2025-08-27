import { inngest } from "../inggest/client.js"
import Ticket from "../models/ticket.js"

export const CreateTicket=async(req,res)=>{
    try {
        const {title,description}=req.body
        if(!title || !description)
        {
            return res.status(403).json({message:"title and description are required"})
        }
    const newTicket=await Ticket.create({
            title,
            description,
            createdBy:req.user._id.toString()

        })
    await inngest.send({
            name:"ticket/created",
            data:{
                ticketId:(newTicket)._id.toString(),
                title,
                description,
                createdBy:req.user._id.toString()
                
            }
        })
        return res.status(200).json({
            message:"Ticket created and processing started",
            Ticket:newTicket
        })
    } catch (error) {
        console.log(error)
        console.error("error occured while creating Ticket")
        return res.status(500).json({error:"internal server error"},error.message)
    }
}

export const getTickets=async(req,res)=>{
    try {
    const user=req.user
    let tickets=[]
    if(user.role!=="user"){
    tickets=await Ticket.find({})
    .populate("assignedTo",["email","_id"])
    .sort({createdAt:-1})
    }
    else{
    tickets=await Ticket.find({
            createdBy:user._id
        }).select("title description createdAt")
        .sort({createdAt:-1})
    }
    return res.status(200).json({tickets})
    } catch (error) {
        console.error("error while getting tickets")
        return res.status(500).json({
        error: "Error occurred in getting tickets",
        details: error.message
        });
    }
}

export const getTicket=async(req,res)=>{
    const user=req.user
    try {
        let ticket;
        if(user.role!=="user"){
        ticket=await Ticket.findById(req.params.id)
        .populate("assignedTo",["email","_id"])
        
        }
        else{
        ticket=await Ticket.findOne({
                createdBy:user._id,
                _id:req.params.id
            }).select("title description status createdAt")
        }
        if(!ticket){
            return res.status(404).json({message:"kuch typo error ho skta hai ya kuch bhi ho skta hai debug karo that's why ticket not found"})
        }
        return res.status(200).json({ticket})
    } catch (error) {
        console.log(error)
        console.log("xxxx")
        console.error("error while getting ticket by Id")
        return res.status(500).json({error:"internal server error while getting ticket by Id"},error.message)
    }
}