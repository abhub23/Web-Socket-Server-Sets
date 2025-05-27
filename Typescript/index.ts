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

io.on('connection', (socket: Socket) => {
    console.log(`Client connected with socket ID: ${socket.id}`)


    socket.on('create-room', () => {
        const roomId = createRoomID()
        socket.emit('room-created', roomId)
    })


    socket.on('private-chat', async (roomId: string, username: string) => {
        socket.join(roomId)

        const roomSockets = await io.in(roomId).fetchSockets();
        const length = roomSockets.length;
        
        setTimeout(() => {
            io.to(roomId).emit('socket-length', length);
        }, 1000);


    })

    socket.on('message', (roomId: string, chatmessage: string, time: string) => {
        console.log(roomId, chatmessage, time)

        io.to(roomId).emit('receive-message', ({
            senderId: socket.id,
            message: chatmessage,
            time: time
        }))

    })



    socket.on('disconnect', () => {
        console.log(`Client ${socket.id} Disconnected!`)
    })

})

httpserver.listen(Port, '0.0.0.0', () => {
    console.log(`SocketIO Server Listening on Port: ${Port}`)
})