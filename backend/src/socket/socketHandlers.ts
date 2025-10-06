import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

interface AuthenticatedSocket extends Socket {
  userId?: string;
  user?: any;
}

export const setupSocketHandlers = (io: Server): void => {
  // Authentication middleware for Socket.IO
  io.use(async (socket: AuthenticatedSocket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];
      
      if (!token) {
        return next(new Error('Authentication error: No token provided'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
      const user = await User.findById(decoded.userId);
      
      if (!user || !user.isActive) {
        return next(new Error('Authentication error: Invalid user'));
      }

      socket.userId = user._id;
      socket.user = user;
      next();
    } catch (error) {
      next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', (socket: AuthenticatedSocket) => {
    console.log(`User ${socket.userId} connected via Socket.IO`);

    // Join user to their personal room for targeted notifications
    socket.join(socket.userId!);

    // Join admin users to admin room
    if (socket.user?.role === 'admin') {
      socket.join('admin');
      console.log(`Admin ${socket.userId} joined admin room`);
    }

    // Handle order status updates
    socket.on('subscribeToOrder', (orderId: string) => {
      socket.join(`order:${orderId}`);
      console.log(`User ${socket.userId} subscribed to order ${orderId}`);
    });

    // Handle unsubscribing from order
    socket.on('unsubscribeFromOrder', (orderId: string) => {
      socket.leave(`order:${orderId}`);
      console.log(`User ${socket.userId} unsubscribed from order ${orderId}`);
    });

    // Handle admin notifications
    socket.on('adminNotification', (data: any) => {
      if (socket.user?.role === 'admin') {
        // Broadcast to all connected users
        io.emit('adminBroadcast', {
          id: `admin-${Date.now()}`,
          type: 'admin_message',
          title: data.title,
          message: data.message,
          priority: data.priority || 'medium',
          timestamp: new Date(),
          actionRequired: data.actionRequired || false,
          actionUrl: data.actionUrl
        });
      }
    });

    // Handle system announcements
    socket.on('systemAnnouncement', (data: any) => {
      if (socket.user?.role === 'admin') {
        // Broadcast to all connected users
        io.emit('systemAnnouncement', {
          id: `system-${Date.now()}`,
          title: data.title,
          message: data.message,
          type: data.type || 'info',
          timestamp: new Date(),
          persistent: data.persistent || false
        });
      }
    });

    // Handle typing indicators (for future chat features)
    socket.on('typing', (data: any) => {
      socket.broadcast.to(data.room).emit('userTyping', {
        userId: socket.userId,
        isTyping: data.isTyping
      });
    });

    // Handle disconnect
    socket.on('disconnect', (reason) => {
      console.log(`User ${socket.userId} disconnected: ${reason}`);
    });

    // Send connection confirmation
    socket.emit('connected', {
      message: 'Successfully connected to Skipaman Store',
      userId: socket.userId,
      timestamp: new Date()
    });
  });

  // Global error handler
  io.on('error', (error) => {
    console.error('Socket.IO error:', error);
  });
};

// Helper function to emit order updates
export const emitOrderUpdate = (io: Server, userId: string, orderData: any) => {
  io.to(userId).emit('orderUpdate', {
    ...orderData,
    timestamp: new Date()
  });
};

// Helper function to emit notifications
export const emitNotification = (io: Server, userId: string, notification: any) => {
  io.to(userId).emit('newNotification', {
    ...notification,
    timestamp: new Date()
  });
};

// Helper function to broadcast to all admins
export const broadcastToAdmins = (io: Server, data: any) => {
  io.to('admin').emit('adminNotification', {
    ...data,
    timestamp: new Date()
  });
};

// Helper function to broadcast to all users
export const broadcastToAll = (io: Server, data: any) => {
  io.emit('globalNotification', {
    ...data,
    timestamp: new Date()
  });
};


