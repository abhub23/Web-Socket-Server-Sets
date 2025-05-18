import express from 'express';
import http from 'http'
import { Server, Socket } from 'socket.io';

const app = express();
const Port = 6006
const httpserver = http.createServer(app)
const io = new Server(httpserver, {
    cors: {
        origin: 'http://localhost:3000'
    }
})

io.on('connection', (socket: Socket) => {
    console.log(`Client connected with socket ID: ${socket.id}`)

    socket.on('private-chat', (roomId: string, username: string) => {
        socket.join(roomId)

    })

    socket.on('message', (roomId: string, chatmessage: string) => {
        io.to(roomId).emit('receive-message', ({
            senderId: socket.id,
            message: chatmessage
        }))
    })
})

httpserver.listen(Port, () => {
    console.log(`SocketIO Server Listening on Port: ${Port}`)
})