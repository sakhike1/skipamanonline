import { io, Socket } from 'socket.io-client';

class SocketService {
  private socket: Socket | null = null;
  private token: string | null = null;

  connect(token: string): void {
    if (this.socket?.connected) {
      return;
    }

    this.token = token;
    const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

    try {
      this.socket = io(socketUrl, {
        auth: {
          token: token
        },
        transports: ['websocket', 'polling'],
        timeout: 5000, // 5 second timeout
        forceNew: true
      });

      this.setupEventListeners();
      
      // Handle connection errors gracefully
      this.socket.on('connect_error', (error) => {
        console.warn('Socket.IO connection failed:', error.message);
        // Don't throw error, just log it
      });
      
    } catch (error) {
      console.warn('Failed to initialize Socket.IO connection:', error);
      // Don't throw error, just log it
    }
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  private setupEventListeners(): void {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('Connected to server via Socket.IO');
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Disconnected from server:', reason);
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    this.socket.on('connected', (data) => {
      console.log('Socket connection confirmed:', data);
    });
  }

  // Order-related events
  subscribeToOrder(orderId: string): void {
    if (this.socket) {
      this.socket.emit('subscribeToOrder', orderId);
    }
  }

  unsubscribeFromOrder(orderId: string): void {
    if (this.socket) {
      this.socket.emit('unsubscribeFromOrder', orderId);
    }
  }

  onOrderUpdate(callback: (data: {
    orderId: string;
    orderNumber: string;
    status: string;
    message: string;
    estimatedDelivery?: string;
    trackingNumber?: string;
    timestamp: string;
  }) => void): void {
    if (this.socket) {
      this.socket.on('orderUpdate', callback);
    }
  }

  offOrderUpdate(callback?: Function): void {
    if (this.socket) {
      if (callback) {
        this.socket.off('orderUpdate', callback);
      } else {
        this.socket.removeAllListeners('orderUpdate');
      }
    }
  }

  // Notification events
  onNewNotification(callback: (data: {
    id: string;
    type: string;
    title: string;
    message: string;
    createdAt: string;
  }) => void): void {
    if (this.socket) {
      this.socket.on('newNotification', callback);
    }
  }

  offNewNotification(callback?: Function): void {
    if (this.socket) {
      if (callback) {
        this.socket.off('newNotification', callback);
      } else {
        this.socket.removeAllListeners('newNotification');
      }
    }
  }


  // Admin-only: Send admin notification
  sendAdminNotification(data: {
    title: string;
    message: string;
  }): void {
    if (this.socket) {
      this.socket.emit('adminNotification', data);
    }
  }

  // Design request events
  onNewDesignRequest(callback: (data: any) => void): void {
    if (this.socket) {
      this.socket.on('newDesignRequest', callback);
    }
  }

  offNewDesignRequest(callback?: Function): void {
    if (this.socket) {
      if (callback) {
        this.socket.off('newDesignRequest', callback);
      } else {
        this.socket.removeAllListeners('newDesignRequest');
      }
    }
  }

  // Global events
  onGlobalNotification(callback: (data: {
    type: string;
    title: string;
    message: string;
    timestamp: string;
  }) => void): void {
    if (this.socket) {
      this.socket.on('globalNotification', callback);
    }
  }

  offGlobalNotification(callback?: Function): void {
    if (this.socket) {
      if (callback) {
        this.socket.off('globalNotification', callback);
      } else {
        this.socket.removeAllListeners('globalNotification');
      }
    }
  }

  // Admin broadcast events (for urgent admin messages)
  onAdminBroadcast(callback: (data: {
    type: string;
    title: string;
    message: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    timestamp: string;
    actionRequired?: boolean;
    actionUrl?: string;
  }) => void): void {
    if (this.socket) {
      this.socket.on('adminBroadcast', callback);
    }
  }

  offAdminBroadcast(callback?: Function): void {
    if (this.socket) {
      if (callback) {
        this.socket.off('adminBroadcast', callback);
      } else {
        this.socket.removeAllListeners('adminBroadcast');
      }
    }
  }

  // System announcements
  onSystemAnnouncement(callback: (data: {
    id: string;
    title: string;
    message: string;
    type: 'info' | 'warning' | 'success' | 'error';
    timestamp: string;
    persistent?: boolean;
  }) => void): void {
    if (this.socket) {
      this.socket.on('systemAnnouncement', callback);
    }
  }

  offSystemAnnouncement(callback?: Function): void {
    if (this.socket) {
      if (callback) {
        this.socket.off('systemAnnouncement', callback);
      } else {
        this.socket.removeAllListeners('systemAnnouncement');
      }
    }
  }

  // Typing indicators (for future chat features)
  onUserTyping(callback: (data: {
    userId: string;
    isTyping: boolean;
  }) => void): void {
    if (this.socket) {
      this.socket.on('userTyping', callback);
    }
  }

  offUserTyping(callback?: Function): void {
    if (this.socket) {
      if (callback) {
        this.socket.off('userTyping', callback);
      } else {
        this.socket.removeAllListeners('userTyping');
      }
    }
  }

  sendTyping(room: string, isTyping: boolean): void {
    if (this.socket) {
      this.socket.emit('typing', { room, isTyping });
    }
  }

  // Utility methods
  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  getSocket(): Socket | null {
    return this.socket;
  }

  // Reconnect with new token
  reconnect(token: string): void {
    this.disconnect();
    this.connect(token);
  }
}

// Create singleton instance
const socketService = new SocketService();

export default socketService;

