import { Types } from "mongoose";
import { Message } from "../../domain/entities/message";

export interface CommonRequest {
    fromUserId: Types.ObjectId,
    toUserId: Types.ObjectId,
}

// **** used in getAllMessage.use-case **** \\
// Used as the response type of the get all message usecase
export type GetAllMessageResponse = Array<Message>;


// **** used in sendMessage.use-case **** \\
// Used as the request type of the send message usecase

export type SendMessageRequest = Pick<Message, "senderId" | "receiverId" | "text" | "image" >;