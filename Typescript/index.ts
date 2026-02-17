import express from "express";
import http from 'http';
import { Server } from 'socket.io';
import { createRoomID } from './src/utils/createRoomID';
import { PORT, HOUR_IN_MS, TYPING_TIMEOUT_MS } from './src/utils/constants';
import { type RoomData } from './src/types';

// Create HTTP server with Express
const app = express();
const httpServer = http.createServer(app);

// Health check endpoint
app.get('/', (_, res) => {
    res.status(200).json({ message: "Server is Healthy" });
});

// Create Socket.IO server
const io = new Server(httpServer, {
    cors: {
        origin: '*'
    }
})

const map = new Map<string, RoomData>()

io.on('connection', (socket) => {
    console.log(`[DEBUG] Client connected with socket ID: ${socket.id}, transport: ${socket.conn.transport.name}`)
    
    socket.conn.on('upgrade', (transport) => {
        console.log(`[DEBUG] Socket ${socket.id} upgraded to: ${transport.name}`);
    });
    
    socket.conn.on('upgradeError', (err) => {
        console.log(`[DEBUG] Socket ${socket.id} upgrade error:`, err);
    });


    socket.on('create-room', () => {
        const roomId = createRoomID()

        map.set(roomId, {
            users: new Set<string>(),
            messages: [],
            lastActive: Date.now()
        })

        socket.emit('room-created', roomId)
    })


    socket.on('typing' , (roomId, username) => {
        if (socket.data.typingTimeout) {
            clearTimeout(socket.data.typingTimeout)
        }

        io.to(roomId).emit('isTyping', true, username)

        socket.data.typingTimeout = setTimeout(() => {
            io.to(roomId).emit('isTyping', false, username)
        }, TYPING_TIMEOUT_MS)
    })


    socket.on('private-chat', async (roomId: string, username: string) => {

        let roomExists = map.has(roomId);

        if(roomExists){
            socket.join(roomId)
        }
        
        socket.emit('isConnected', roomExists)

        const roomSockets = await io.in(roomId).fetchSockets();
        
        setTimeout(() => {
            io.to(roomId).emit('user-count', roomSockets.length);
        }, 1000);

    })

    socket.on('message', (roomId: string, chatmessage: string, time: string, username: string) => {

        const room = map.get(roomId)

        if(!room) return;

        room.users.add(username)
        room.messages.push({senderId: socket.id, message: chatmessage, time})
        room.lastActive = Date.now();

       const lastMsg = room.messages[room.messages.length -1]

        io.to(roomId).emit('receive-message', {
            senderId: lastMsg.senderId,
            message: lastMsg.message,
            time: lastMsg.time
        })

    })

    socket.on('disconnect', () => {
        console.log(`Client ${socket.id} Disconnected!`)
    })

})

// cLean-up func to set off all the Rooms if theres no one in the room or after 1 Hr anyways
setInterval(() => {
    const now = Date.now()
    for (let [key, value] of map.entries()) {
        if (value.users.size === 0 || now - value.lastActive > HOUR_IN_MS) {
            map.delete(key)
        }
    }
}, HOUR_IN_MS)

console.log('[DEBUG] Socket.IO attached:', io.engine ? 'YES' : 'NO');
console.log('[DEBUG] Starting server on PORT:', PORT);

httpServer.on('error', (err) => {
    console.error('[DEBUG] HTTP Server Error:', err);
});

httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`[DEBUG] SocketIO Server Listening on Port: ${PORT}`);
    console.log('[DEBUG] Server address:', httpServer.address());
});

io.engine.on('connection_error', (err: { req: any; code: any; message: any; context: any; }) => {
    console.log('[DEBUG] Connection Error:', err);
});

httpServer.on('upgrade', (request, socket, head) => {
    console.log('[DEBUG] HTTP Upgrade request for:', request.url);
    console.log('[DEBUG] Upgrade headers:', request.headers.upgrade);
});

io.engine.on('initial_headers', (headers, req) => {
    console.log('[DEBUG] Socket.IO initial headers, transport attempt');
});

io.engine.on('headers', (headers, req) => {
    console.log('[DEBUG] Socket.IO headers sent');
});
