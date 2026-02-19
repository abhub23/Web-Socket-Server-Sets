import { io, Socket } from 'socket.io-client';

type ClientToServerEvents = {
  'private-chat': (roomId: string, username: string) => void;
  'create-room': () => void;
  'typing': (roomId: string, username: string) => void;
  message: (
    roomId: string,
    chatmessage: string,
    time: string,
    username: string
  ) => void;
};

type Msgtype = {
  senderId: string;
  message: string;
  time: string;
};

type ServerToClientEvents = {
  'room-created': (roomId: string) => void;
  'receive-message': (data: Msgtype) => void;
  'user-count': (data: number) => void;
  isConnected: (value: boolean) => void;
  isTyping: (typing: boolean, username: string) => void;
};

let socket: Socket<ServerToClientEvents, ClientToServerEvents> | null = null;

export const getSocket = (): Socket<ServerToClientEvents, ClientToServerEvents> => {
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_BACKEND_SOCKET_URL || 'http://localhost:6006', {
      transports: ['polling', 'websocket'],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });
  }
  return socket;
};

export default getSocket;
