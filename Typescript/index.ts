import express from 'express';
import http from 'http'
import { Server, Socket } from 'socket.io';
import { createRoomID } from './createRoomID';

const app = express();
const Port = 6006
const httpserver = http.createServer(app)
const io = new Server(httpserver, {
    cors: {
        origin: '*'
    }
})
app.get('/', (req, res) => {
    res.json({message: 'Server is alive'})
})
type Msgtype = {
    senderId: string;
    message: string;
    time: string;
};

type Roomdata = {
    users: Set<string>;
    messages: Msgtype[]
    lastActive: number;
}

const map = new Map<string, Roomdata>()
const hour = 3600000

io.on('connection', (socket: Socket) => {
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


    socket.on('private-chat', async (roomId: string, username: string) => {

        let RoomExists: boolean;
        if (map.has(roomId)) {
            RoomExists = true
            socket.join(roomId)
        } else {
            RoomExists = false
        }
        socket.emit('isConnected', RoomExists)


        const roomSockets = await io.in(roomId).fetchSockets();
        
        setTimeout(() => {
            io.to(roomId).emit('socket-length', roomSockets.length);
        }, 1000);

    })

    socket.on('message', (roomId: string, chatmessage: string, time: string, username: string) => {

        const room = map.get(roomId)

        if(!room) return;

        room.users.add(username)
        room.messages.push({senderId: socket.id,message: chatmessage, time: time})
        room.lastActive = Date.now();

       const lastMsg = room.messages[room.messages.length -1]

        io.to(roomId).emit('receive-message', ({
            senderId: lastMsg.senderId,
            message: lastMsg.message,
            time: lastMsg.time
        }))

    })

    socket.on('disconnect', () => {
        console.log(`Client ${socket.id} Disconnected!`)
    })

})

// cLean-up func to set off all the Rooms if theres no one in the room or after 1 Hr anyways
setInterval(() => {
    const now = Date.now()
    for (let [key, value] of map.entries()) {
        if (value.users.size == 0 || now - value.lastActive > hour) {
            map.delete(key)
        }
    }
}, hour)

httpserver.listen(Port, '0.0.0.0', () => {
    console.log(`SocketIO Server Listening on Port: ${Port}`)
})