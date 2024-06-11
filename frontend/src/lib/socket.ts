class Socket {
  socket: null | WebSocket;

  constructor() {
    this.socket = null;
  }

  connect(url: string) {
    if (!this.socket) {
      this.socket = new WebSocket(url);
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  send(message: any) {
    if (this.socket) {
      this.socket.send(JSON.stringify(message));
    }
  }

  on(eventName: string, callback: any) {
    if (this.socket) {
      this.socket.addEventListener(eventName, callback);
    }
  }

  receive(callback: (message: MessageEvent) => void) {
    if (this.socket) {
      this.socket.onmessage = callback;
    }
  }
}

export { Socket };
