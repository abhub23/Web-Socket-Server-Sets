import express from "express";
import http from 'http';


const app = express();
export const httpServer = http.createServer(app);

app.get('/', (_, res) => {
    res.status(200).json({ message: "Server is Healthy" });
});



