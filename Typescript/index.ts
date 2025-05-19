import express from 'express';
import http from 'http'
import { Server, Socket } from 'socket.io';

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

    socket.on('private-chat', (roomId: string, username: string) => {
        socket.join(roomId)

    })

    socket.on('message', (roomId: string, chatmessage: string, time: string) => {
        console.log(roomId, chatmessage,time)
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

httpserver.listen(Port,'0.0.0.0', () => {
    console.log(`SocketIO Server Listening on Port: ${Port}`)
})