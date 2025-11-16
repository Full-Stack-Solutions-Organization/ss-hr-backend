import z from "zod";
import { stringField } from "./zodUtilities";
import { REGEX_S3_FILEKEY, REGEXT_CHAT_MESSAGE } from "./regex";

export const sendMessageRequestZodSchema = z.object({
    text: stringField("Message text",1,500,REGEXT_CHAT_MESSAGE,"Invalid message."),
    image: stringField("s3FileKey", 6, 500, REGEX_S3_FILEKEY),
})