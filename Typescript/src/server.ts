import express from "express";
import http from 'http';
import { PORT } from "./utils/constants";

const app = express();
export const httpServer = http.createServer(app);

app.get('/', (_, res) => {
    res.status(200).json({ message: "Server is Healthy" });
});

httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`SocketIO Server Listening on Port: ${PORT}`);
});

