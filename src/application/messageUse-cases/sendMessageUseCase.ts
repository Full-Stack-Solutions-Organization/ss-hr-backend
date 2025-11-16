import { Message } from "../../domain/entities/message";
import { ApiResponse } from "../../infrastructure/dtos/common.dts";
import { SendMessageRequest } from "../../infrastructure/dtos/message.dtos";
import { getReceiverSocketId, io } from "../../infrastructure/lib/socket.io";
import { SignedUrlService } from "../../infrastructure/service/generateSignedUrl";
import { MessageRepositoryImpl } from "../../infrastructure/database/message/messageRepositorylmpl";


export class SendMessageUseCase {
    constructor(
        private messageRepositoryImpl: MessageRepositoryImpl,
        private signedUrlService: SignedUrlService,
    ) { }

    async execute(payload: SendMessageRequest): Promise<ApiResponse<Message>> {
        try {
            const { receiverId } = payload;
            
            const newMessage = await this.messageRepositoryImpl.createMessage({...payload});
            
            if (newMessage.image) {
                newMessage.image = await this.signedUrlService.generateSignedUrl(newMessage.image);
            }
            
            const receiverSocketId = await getReceiverSocketId(receiverId);
            if (receiverSocketId) {
                io.to(receiverSocketId).emit("newMessage", newMessage);
            }
            
            return { data: newMessage }
        } catch (error) {
            throw new Error("Failed send to message");
        }

    }
}