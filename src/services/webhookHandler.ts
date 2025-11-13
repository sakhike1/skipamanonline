// Webhook handler for real-time updates from Strapi
import { io } from 'socket.io-client';

class WebhookHandler {
  private socket: any;
  private listeners: Map<string, Function[]> = new Map();

  constructor() {
    this.initializeSocket();
  }

  private initializeSocket() {
    // Connect to your WebSocket server
    this.socket = io(process.env.REACT_APP_WEBSOCKET_URL || 'http://localhost:5000');
    
    this.socket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
    });

    // Listen for order updates
    this.socket.on('orderUpdate', (data: any) => {
      this.emit('orderUpdate', data);
    });

    // Listen for payment updates
    this.socket.on('paymentUpdate', (data: any) => {
      this.emit('paymentUpdate', data);
    });

    // Listen for support request updates
    this.socket.on('supportUpdate', (data: any) => {
      this.emit('supportUpdate', data);
    });
  }

  // Subscribe to events
  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  // Unsubscribe from events
  off(event: string, callback: Function) {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      const index = eventListeners.indexOf(callback);
      if (index > -1) {
        eventListeners.splice(index, 1);
      }
    }
  }

  // Emit events to listeners
  private emit(event: string, data: any) {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.forEach(callback => callback(data));
    }
  }

  // Join user-specific room for personalized updates
  joinUserRoom(userId: string) {
    this.socket.emit('joinUserRoom', userId);
  }

  // Leave user-specific room
  leaveUserRoom(userId: string) {
    this.socket.emit('leaveUserRoom', userId);
  }

  // Disconnect
  disconnect() {
    this.socket.disconnect();
  }
}

// Create singleton instance
const webhookHandler = new WebhookHandler();

export default webhookHandler;
