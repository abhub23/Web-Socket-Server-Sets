// lib/socket.ts
import { io } from 'socket.io-client';

const socket = io(process.env.NEXT_PUBLIC_BACKEND_SOCKET_URL!, {
  autoConnect: false,
});

export default socket;

//to maintail single socket across landing page where actual socket.connect() is happening
