import z from "zod";
import { stringField } from "./zodUtilities";
import { REGEXT_CHAT_MESSAGE } from "./regex";

export const sendMessageRequestZodSchema = z.object({
    text: stringField("Message text",1,500,REGEXT_CHAT_MESSAGE,"Invalid message."),
})