// lib/socket.ts
import { io, Socket } from 'socket.io-client';

//Events Emitted by Client -> Server
type ClientToServerEvents = {
  'private-chat': (roomId: string, username: string) => void;
  'create-room': () => void;
  'typing': (roomId: string, username: string) => void
  message: (
    roomId: string,
    chatmessage: string,
    time: string,
    username: string,
  ) => void;
};

type Msgtype = {
  senderId: string;
  message: string;
  time: string;
};

//Events Emitted by Server -> Client
type ServerToClientEvents = {
  'room-created': (roomId: string) => void;
  'receive-message': (data: Msgtype) => void;
  'user-count': (data: number) => void;
  isConnected: (value: boolean) => void;
  isTyping: (typing: boolean, username: string) => void;
};

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  // process.env.NEXT_PUBLIC_BACKEND_SOCKET_URL || 
   'http://localhost:6006',
);

export default socket;

//to maintain single socket connection across landing page where actual socket.connect() is happening

/*
Server generic order: <ClientToServerEvents, ServerToClientEvents>

Socket generic order: <ServerToClientEvents, ClientToServerEvents>

They are opposite because the point of view is different (server vs client).
*/
