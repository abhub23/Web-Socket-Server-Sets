# Web Socket using Gorilla

- Go doesn't have std lib for Web sockets, it do have *http/net* but for http connections only
- For Web Sockets we are going to use Socket.IO package imported from github
- There is also a package called gorilla but for that to interact we need Native WSS

**Let me explain Clearly**
- If you're using Socket.IO in Backend use Socket.IO in Frontend because it has a custom protocol, built-in reconnection, rooms, and events that won't work with native WebSockets.

- If you're using Native WS like Gorilla Provides in Go use Native WS in Frontend because it's lighter, faster, and directly compatible with the standard WebSocket API in browsers.

**Why? you must ask.**

The reason is protocol compatibility:

Socket.IO is NOT pure WebSockets – it uses a custom protocol with extra features (like handshake, heartbeats, message acknowledgment, and rooms).

A Socket.IO client expects these extra messages and won't understand a pure WebSocket server like Gorilla.
A pure WebSocket client (like the browser's WebSocket API) won’t understand Socket.IO’s special message format.
Gorilla WebSocket follows the WebSocket standard (RFC 6455) – it communicates using raw WebSocket frames without extra overhead.

A native WebSocket client (React's WebSocket API or react-use-websocket) will work perfectly with Gorilla.
A Socket.IO client expects a different handshake and message structure, so it won’t connect properly.

