import { Server } from 'socket.io';
import { httpServer } from './src/server';
import { createRoomID } from './src/utils/createRoomID';
import { PORT, HOUR_IN_MS, TYPING_TIMEOUT_MS } from './src/utils/constants';
import { type RoomData } from './src/types';

const io = new Server(httpServer, {
    cors: {
        origin: '*'
    }
})

const map = new Map<string, RoomData>()

io.on('connection', (socket) => {
    console.log(`Client connected with socket ID: ${socket.id}`)


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

httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`SocketIO Server Listening on Port: ${PORT}`);
});