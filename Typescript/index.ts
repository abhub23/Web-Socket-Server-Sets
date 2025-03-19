import express from 'express';
import http from 'http'
import { Server } from 'socket.io';

const app = express();
const httpserver = http.createServer(app)
const io = new Server(httpserver, {
    cors: {
        origin: '*'
    }
})


