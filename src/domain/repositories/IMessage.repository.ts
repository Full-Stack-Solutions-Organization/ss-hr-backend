import { Message } from "../entities/message";
import { CommonRequest, GetAllMessageResponse, SendMessageRequest } from "../../infrastructure/dtos/message.dtos";

export interface IMessageRepository {

    getAllMessages(payload: CommonRequest): Promise<GetAllMessageResponse>;
    
    createMessage(payload: SendMessageRequest): Promise<Message>;
    
    // deleteMessage(data: CommonRequest): Promise<ApiResponse>;
}