import Ticket from "../../models/ticket.js";
import User from "../../models/user.js";
import analyzeTicket from "../../utils/ai.js";
import { sendMail } from "../../utils/mailer.js";
import { inngest } from "../client.js";
import { NonRetriableError } from "inngest";

export const onTicketCreated = inngest.createFunction(
  { id: "on-ticket-created", retries: 2 },
  { event: "ticket/created" },
  async ({ event, step }) => {
    try {
      const { ticketId } = event.data;

      // Step 1: Fetch Ticket
      const ticket = await step.run("fetch-ticket", async () => {
        const ticketObject = await Ticket.findById(ticketId);
        if (!ticketObject) {
          throw new NonRetriableError("Ticket not found");
        }
        return ticketObject;
      });

      // Step 2: Update Ticket Status to TODO
      await step.run("update-ticket-status", async () => {
        await Ticket.findByIdAndUpdate(ticket._id, {
          status: "TODO",
        });
      });

      // Step 3: Analyze Ticket using AI
      const aiResponse = await analyzeTicket(ticket);

      // Step 4: Process AI Response
      const relatedSkills = await step.run("ai-processing", async () => {
        let skills = [];
        if (aiResponse) {
          const priority = ["low", "medium", "high"].includes(
            aiResponse.priority
          )
            ? aiResponse.priority
            : "medium";

          await Ticket.findByIdAndUpdate(ticket._id, {
            priority,
            helpfulNotes: aiResponse.helpfulNotes,
            status: "IN PROGRESS",
            relatedSkills: aiResponse.relatedSkills,
          });

          skills = aiResponse.relatedSkills || [];
        }
        return skills;
      });

      // Step 5: Assign Moderator
      const moderator = await step.run("assign-moderator", async () => {
        let user = await User.findOne({
          role: "moderator",
          skills: {
            $elemMatch: {
              $regex: relatedSkills.join("|"),
              $options: "i",
            },
          },
        });

        // Fallback to admin
        if (!user) {
          user = await User.findOne({ role: "admin" });
        }

        await Ticket.findByIdAndUpdate(ticket._id, {
          assignedTo: user?._id || null,
        });

        return user;
      });

      // Step 6: Send Mail to Moderator
      await step.run("send-ticket-mail", async () => {
        if (moderator && moderator.email) {
          const finalTicket = await Ticket.findById(ticket._id);
          await sendMail(
            moderator.email,
            "Ticket Assigned",
            `A new ticket has been assigned: ${finalTicket.title}`
          );
        }
      });

      return { success: true };
    } catch (error) {
      console.error("Error while running steps:", error.message);
      return { success: false };
    }
  }
);
