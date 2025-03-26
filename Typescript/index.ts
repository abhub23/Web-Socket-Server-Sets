import express from 'express';
import http from 'http'
import { Server, Socket } from 'socket.io';

const app = express();
const httpserver = http.createServer(app)
const io = new Server(httpserver, {
    cors: {
        origin: '*'
    }
})

io.on('connection', (socket: Socket) => {
    io.emit(`New user connected ${socket.id}`)
})
