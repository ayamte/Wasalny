import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

class GeolocationService {
  constructor() {
    this.client = null;
    this.subscriptions = new Map();
  }

  connect(onConnected, onError) {
    // Create STOMP client with SockJS
    this.client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8084/ws'),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,

      onConnect: () => {
        console.log('Connected to WebSocket');
        if (onConnected) onConnected();
      },

      onStompError: (frame) => {
        console.error('STOMP error:', frame);
        if (onError) onError(frame);
      },

      onWebSocketError: (event) => {
        console.error('WebSocket error:', event);
        if (onError) onError(event);
      }
    });

    this.client.activate();
  }

  subscribeToBusLocation(busId, callback) {
    if (!this.client || !this.client.connected) {
      console.error('WebSocket not connected');
      return null;
    }

    const subscription = this.client.subscribe(
      `/topic/bus/${busId}/location`,
      (message) => {
        try {
          const location = JSON.parse(message.body);
          callback(location);
        } catch (error) {
          console.error('Error parsing location message:', error);
        }
      }
    );

    this.subscriptions.set(busId, subscription);
    return subscription;
  }

  unsubscribeFromBus(busId) {
    const subscription = this.subscriptions.get(busId);
    if (subscription) {
      subscription.unsubscribe();
      this.subscriptions.delete(busId);
    }
  }

  disconnect() {
    if (this.client) {
      this.subscriptions.forEach((subscription) => subscription.unsubscribe());
      this.subscriptions.clear();
      this.client.deactivate();
    }
  }

  isConnected() {
    return this.client && this.client.connected;
  }
}

export default new GeolocationService();
