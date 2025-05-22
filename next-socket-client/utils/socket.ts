// lib/socket.ts
import { io, Socket } from 'socket.io-client';

//Events Emitted by Client -> Server
type ClienttoServerEvents = {
  'private-chat': (roomId: string, username: string) => void;
  'create-room': () => void;
  'message' :  (roomId: string, chatmessage: string, time: string) => void;
}


type Msgtype = {
  senderId: string;
  message: string;
  time: string;
};

//Events Emitted by Server -> Client
type ServertoClientEvents = {
  'room-created': (roomId: string) => void; 
  'receive-message': (data : Msgtype) => void;
  'socket-length': (data : number) => void;
}

const socket: Socket<ServertoClientEvents, ClienttoServerEvents> = io(process.env.NEXT_PUBLIC_BACKEND_SOCKET_URL || 'http://0.0.0.0:6006', {
  autoConnect: false,
});

export default socket;

//to maintain single socket connection across landing page where actual socket.connect() is happening


/*
Server generic order: <ClientToServerEvents, ServerToClientEvents>

Socket generic order: <ServerToClientEvents, ClientToServerEvents>

They are opposite because the point of view is different (server vs client).
*/