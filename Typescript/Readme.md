# Express and Socket.IO Basics

## Express Does Not Create an HTTP Server
Express itself **does not** create an HTTP server. It only provides a framework to handle:
- Routes (e.g., `/notifications`)
- Middleware
- Request/response logic

When you call `app.listen()`, it **internally** uses Node.js' `http` module to create an HTTP server.

### How It Works Internally:
```js
import express from 'express';
import { createServer } from 'http';

const app = express();
const server = createServer(app);

server.listen(3000, () => {
  console.log('Server is running on port 3000');
});
```
Here, `createServer(app)` creates the HTTP server explicitly, which is what `app.listen(3000)` does internally.

## Understanding Socket.IO's `Server` Constructor
When creating a new `Server` instance in Socket.IO, it requires two arguments:

### 1. **First Argument: HTTP Server**
- The first handshake between the client and server happens over **HTTP**.
- It sends an **HTTP header request** to upgrade the connection to **WebSocket**.
- It also enables **long polling**, ensuring the connection remains alive even if WebSockets fail.

### 2. **Second Argument: Configuration Object (Optional)**
- Used for setting options like CORS, transports, and connection timeouts.

### Example:
```js
import { Server } from "socket.io";
import { createServer } from "http";
import express from "express";

const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins (adjust for production use)
  },
});

server.listen(3000, () => {
  console.log("Server is running on port 3000");
});
```

## Other Properties in the Options Object
Apart from `cors`, the options object can include:

- **`transports`**: Specifies the transport mechanisms (e.g., `['websocket', 'polling']`).
- **`allowEIO3`**: Allows clients using Socket.IO v3 to connect (`true` or `false`).
- **`pingTimeout`**: Time in ms before closing an inactive connection.
- **`pingInterval`**: Time in ms between pings sent to clients.
- **`maxHttpBufferSize`**: Maximum message size in bytes.
- **`allowRequest`**: A function to validate HTTP requests before allowing upgrades.
- **`cookie`**: Defines the name of the HTTP cookie used for session identification.

## Summary
- **Express does not create an HTTP server**; it only handles routing and middleware.
- `app.listen()` internally calls `http.createServer(app).listen(port)`.
- **Socket.IO requires an HTTP server** for the initial handshake and fallback mechanisms.
- **Socket.IO's `Server` constructor takes two arguments:**
  - First: An HTTP server (required).
  - Second: An options object (optional, for configurations like CORS, transports, timeouts, etc.).
