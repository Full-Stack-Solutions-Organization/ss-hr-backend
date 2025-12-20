import http from "http";
import app from "../../app";
import { Types } from "mongoose";
import { Server } from "socket.io";
import { appConfig } from "../../config/env";

const socketServer = http.createServer(app);

const allowedOrigins = [appConfig.frontendUrl, appConfig.frontendUrl2].filter(
  (url): url is string => Boolean(url)
);

const io = new Server(socketServer, {
    cors: {
        origin: allowedOrigins,
        credentials: true,
    },
});

// Map to store userId -> socketId
const userSocketMap = new Map<string, string>();

export async function getReceiverSocketId(userId: Types.ObjectId | string): Promise<string | null> {
    return userSocketMap.get(userId.toString()) || null;
}

async function getOnlineUsers(): Promise<string[]> {
    return Array.from(userSocketMap.keys());
}

io.on("connection", (socket) => {
    const queryUserId = socket.handshake.query.userId;
    const userId = typeof queryUserId === "string" ? queryUserId : null;

    if (userId) {
        userSocketMap.set(userId, socket.id);
    }

    // Emit online users immediately (sync)
    io.emit("getOnlineUsers", Array.from(userSocketMap.keys()));

    socket.on("typing", ({ fromUserId, toUserId }: { fromUserId: string; toUserId: string }) => {
        const toSocketId = userSocketMap.get(toUserId);
        if (toSocketId) {
            io.to(toSocketId).emit("typing", { fromUserId, toUserId });
        }
    });

    socket.on("stopTyping", ({ fromUserId, toUserId }: { fromUserId: string; toUserId: string }) => {
        const toSocketId = userSocketMap.get(toUserId);
        if (toSocketId) {
            io.to(toSocketId).emit("stopTyping", { fromUserId, toUserId });
        }
    });

    socket.on("disconnect", () => {
        if (userId) {
            userSocketMap.delete(userId);
        }
        io.emit("getOnlineUsers", Array.from(userSocketMap.keys()));
    });
});

export { io, socketServer };
