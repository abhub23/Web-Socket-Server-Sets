"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const createRoomID_1 = require("./createRoomID");
const app = (0, express_1.default)();
const Port = 6006;
const httpserver = http_1.default.createServer(app);
const io = new socket_io_1.Server(httpserver, {
    cors: {
        origin: '*'
    }
});
app.get('/', (req, res) => {
    res.json({ message: 'Server is alive' });
});
const map = new Map();
const hour = 3600000;
io.on('connection', (socket) => {
    console.log(`Client connected with socket ID: ${socket.id}`);
    socket.on('create-room', () => {
        const roomId = (0, createRoomID_1.createRoomID)();
        map.set(roomId, {
            users: new Set(),
            messages: [],
            lastActive: Date.now()
        });
        socket.emit('room-created', roomId);
    });
    socket.on('private-chat', (roomId, username) => __awaiter(void 0, void 0, void 0, function* () {
        let RoomExists;
        if (map.has(roomId)) {
            RoomExists = true;
            socket.join(roomId);
        }
        else {
            RoomExists = false;
        }
        socket.emit('isConnected', RoomExists);
        const roomSockets = yield io.in(roomId).fetchSockets();
        setTimeout(() => {
            io.to(roomId).emit('socket-length', roomSockets.length);
        }, 1000);
    }));
    socket.on('message', (roomId, chatmessage, time, username) => {
        const room = map.get(roomId);
        if (!room)
            return;
        room.users.add(username);
        room.messages.push({ senderId: socket.id, message: chatmessage, time: time });
        room.lastActive = Date.now();
        const lastMsg = room.messages[room.messages.length - 1];
        io.to(roomId).emit('receive-message', ({
            senderId: lastMsg.senderId,
            message: lastMsg.message,
            time: lastMsg.time
        }));
    });
    socket.on('disconnect', () => {
        console.log(`Client ${socket.id} Disconnected!`);
    });
});
// cLean-up func to set off all the Rooms if theres no one in the room or after 1 Hr anyways
setInterval(() => {
    const now = Date.now();
    for (let [key, value] of map.entries()) {
        if (value.users.size == 0 || now - value.lastActive > hour) {
            map.delete(key);
        }
    }
}, hour);
httpserver.listen(Port, '0.0.0.0', () => {
    console.log(`SocketIO Server Listening on Port: ${Port}`);
});
