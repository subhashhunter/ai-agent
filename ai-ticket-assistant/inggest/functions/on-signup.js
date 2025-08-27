import User from "../../models/user.js"
import { sendMail } from "../../utils/mailer.js"
import { inngest } from "../client.js"
import { NonRetriableError } from "inngest";
export const onUserSignup=inngest.createFunction(
    { id: "onSignup",retries:2 },
    { event: "user/signup" },
  async ({ event,step }) => {
    try {
        const {email}=event.data
       const user=await step.run("get-user-email",async()=>{
        const userObject=await User.findOne({email})
        if(!userObject)
        {
            throw new NonRetriableError("user not exist in db")
        }
        return userObject
        })

        await step.run("send-welcome-email",async()=>{
            const subject=`welcome to the app`
            const message=`hi,
            /n/n
            thanks for signing up.`
            await sendMail(user.email,subject,message)
        })
        console.log("sent successfully")
        return {success:true}
    } catch (error) {
       console.error("error while send mail",error.message) 
    }
  }
)