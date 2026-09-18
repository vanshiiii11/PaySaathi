import { Server as SocketIOServer, Socket } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { Server } from 'http';
import { redis } from '../lib/redis';
import { verifyAccessToken } from '../services/jwt.service';
import { prisma } from '../lib/prisma';
import { MessageType } from '@prisma/client';

export const initSocket = (httpServer: Server) => {
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  const pubClient = redis.duplicate();
  const subClient = redis.duplicate();

  io.adapter(createAdapter(pubClient, subClient));

  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication error'));
    }
    try {
      const payload = verifyAccessToken(token);
      (socket as any).user = payload;
      next();
    } catch (err) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket: Socket) => {
    const user = (socket as any).user;
    console.log(`User connected: ${user.id}`);
    
    socket.join(`user:${user.id}`);

    socket.on('join_thread', async ({ threadId }) => {
      const thread = await prisma.chatThread.findUnique({
        where: { id: threadId },
        include: { exchange: true }
      });
      if (thread && (thread.exchange.requesterId === user.id || thread.exchange.partnerId === user.id)) {
        socket.join(`thread:${threadId}`);
      }
    });

    socket.on('send_message', async ({ threadId, content, type = MessageType.TEXT }) => {
      try {
        const thread = await prisma.chatThread.findUnique({
          where: { id: threadId },
          include: { exchange: true }
        });
        
        if (!thread) return;
        
        if (thread.exchange.requesterId !== user.id && thread.exchange.partnerId !== user.id) {
          return;
        }

        const message = await prisma.message.create({
          data: {
            threadId,
            senderId: user.id,
            content,
            type
          }
        });

        io.to(`thread:${threadId}`).emit('new_message', message);
        
        const partnerId = thread.exchange.requesterId === user.id ? thread.exchange.partnerId : thread.exchange.requesterId;
        io.to(`user:${partnerId}`).emit('new_message_notification', message);
      } catch (err) {
        console.error('Error sending message:', err);
      }
    });

    socket.on('typing_start', ({ threadId }) => {
      socket.to(`thread:${threadId}`).emit('typing_start', { threadId, userId: user.id });
    });

    socket.on('typing_stop', ({ threadId }) => {
      socket.to(`thread:${threadId}`).emit('typing_stop', { threadId, userId: user.id });
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${user.id}`);
    });
  });

  return io;
};
