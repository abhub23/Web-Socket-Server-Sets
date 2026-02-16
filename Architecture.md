# Privado Chat Architecture

> Real-time anonymous chat with ephemeral rooms

## Overview

Lightweight WebSocket chat using Socket.IO with Bun runtime. No database, no auth - just ephemeral rooms that auto-expire after 1 hour.

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                          │
│  ┌─────────────────────┐    ┌──────────────────────────┐   │
│  │   Next.js 15 App    │    │      Zustand Stores      │   │
│  │   (React 19 + TS)   │◄──►│  • Room ID Store         │   │
│  │                     │    │  • Username Store        │   │
│  │  Pages:             │    │  • Message Store         │   │
│  │  • / (Landing)      │    │                          │   │
│  │  • /chat-room       │    │                          │   │
│  └─────────────────────┘    └──────────────────────────┘   │
└──────────────────────────┬──────────────────────────────────┘
                           │ WebSocket (Socket.IO)
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                      Server Layer                            │
│  ┌─────────────────────┐    ┌──────────────────────────┐   │
│  │   Socket.IO Server  │    │    In-Memory Storage     │   │
│  │   (Port 6006)       │◄──►│    Map<string, Room>     │   │
│  │                     │    │                          │   │
│  │  Events:            │    │  Room:                   │   │
│  │  • create-room      │    │  • users: Set<string>    │   │
│  │  • private-chat     │    │  • messages: Msgtype[]   │   │
│  │  • message          │    │  • lastActive: number    │   │
│  │  • typing           │    │                          │   │
│  └─────────────────────┘    └──────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## Technology Stack

### Backend

| Component | Tech | Version | Docs |
|-----------|------|---------|------|
| **Runtime** | [Bun](https://bun.sh) | Latest | [Bun Docs](https://bun.sh/docs) |
| **HTTP** | [Express](https://expressjs.com) | 4.22.1 | [Express Docs](https://expressjs.com/en/api.html) |
| **WebSocket** | [Socket.IO](https://socket.io) | 4.8.3 | [Socket.IO Docs](https://socket.io/docs/v4) |
| **Language** | [TypeScript](https://www.typescriptlang.org) | 5.9.3 | [TS Docs](https://www.typescriptlang.org/docs) |

### Frontend

| Component | Tech | Version | Docs |
|-----------|------|---------|------|
| **Framework** | [Next.js](https://nextjs.org) | 15.2.8 | [Next.js Docs](https://nextjs.org/docs) |
| **UI** | [React](https://react.dev) | 19.0.0 | [React Docs](https://react.dev/learn) |
| **Styling** | [Tailwind CSS](https://tailwindcss.com) | 4.0.16 | [Tailwind Docs](https://tailwindcss.com/docs) |
| **State** | [Zustand](https://github.com/pmndrs/zustand) | 5.0.4 | [Zustand Docs](https://docs.pmnd.rs/zustand) |
| **WebSocket** | [Socket.IO Client](https://socket.io) | 4.8.1 | [Client Docs](https://socket.io/docs/v4/client-api) |
| **Animations** | [Framer Motion](https://www.framer.com/motion) | 12.9.4 | [Motion Docs](https://www.framer.com/motion/introduction) |

## Project Structure

```
Typescript/                          # Backend
├── index.ts                         # Socket.IO server, event handlers
├── createRoomID.ts                  # 6-char hex ID generator
├── package.json                     # Scripts: bun --watch index.ts
└── tsconfig.json

next-socket-client/                  # Frontend
├── app/
│   ├── page.tsx                     # Landing: create/join room
│   ├── chat-room/page.tsx           # Chat interface
│   ├── layout.tsx                   # Theme provider, toaster
│   └── globals.css                  # Tailwind config
├── components/
│   ├── AnimatedText.tsx             # Framer motion text
│   ├── Button.tsx                   # Send button
│   └── ToggleTheme.tsx              # Dark/light toggle
├── store/
│   ├── store.ts                     # Zustand stores
│   ├── useEnter.ts                  # Enter key handler hook
│   └── useScrollBottom.ts           # Auto-scroll hook
├── utils/
│   └── socket.ts                    # Socket.IO singleton
└── lib/
    └── utils.ts                     # Tailwind cn() helper
```

## Data Models

### Room (Server-side)

```typescript
Map<roomId: string, Roomdata>

type Roomdata = {
    users: Set<string>;              // Usernames
    messages: Msgtype[];             // Chat history
    lastActive: number;              // Timestamp (ms)
};

type Msgtype = {
    senderId: string;                // Socket ID
    message: string;                 // Message content
    time: string;                    // "2:30 PM"
};
```

### State (Client-side)

```typescript
// Zustand Stores
useRoomId: { roomId: string; setRoomId: (id: string) => void; }
useUsername: { username: string; setUsername: (name: string) => void; }
useMessage: { message: Msgtype[]; addMessage: (msg: Msgtype) => void; }
useGenerate: { generate: boolean; setGenerate: (v: boolean) => void; }
usePending: { isPending: boolean; setPending: (v: boolean) => void; }
```

## Socket Events

### Client → Server

| Event | Payload | Purpose |
|-------|---------|---------|
| `create-room` | `void` | Generate new room ID |
| `private-chat` | `(roomId: string, username: string)` | Join existing room |
| `message` | `(roomId, msg, time, username)` | Send chat message |
| `typing` | `(roomId: string, username: string)` | Typing indicator |

### Server → Client

| Event | Payload | Purpose |
|-------|---------|---------|
| `room-created` | `(roomId: string)` | Return generated room ID |
| `isConnected` | `(connected: boolean)` | Room join confirmation |
| `receive-message` | `({senderId, message, time})` | New message broadcast |
| `isTyping` | `(typing: boolean, username: string)` | Typing status |
| `user-count` | `(count: number)` | Connected user count |

## Data Flow

### Room Creation

```
User clicks "Create Room"
    │
    ▼
Client: socket.emit('create-room')
    │
    ▼
Server: crypto.randomBytes(3).toString('hex').toUpperCase()
    │
    ▼
Server: map.set(roomId, {users: new Set(), messages: [], lastActive: Date.now()})
    │
    ▼
Server: socket.emit('room-created', roomId)
    │
    ▼
Client: setRoomId(roomId) → router.push(`/chat-room?username=X&roomId=Y`)
```

### Message Send

```
User clicks Send
    │
    ▼
Client: socket.emit('message', roomId, chatmessage, time, username)
    │
    ▼
Server: const room = map.get(roomId)
        room.users.add(username)
        room.messages.push({senderId: socket.id, message, time})
        room.lastActive = Date.now()
    │
    ▼
Server: io.to(roomId).emit('receive-message', messageData)
    │
    ▼
All room clients: socket.on('receive-message') → addMessage() → Re-render
```

### Typing Indicator

```
User types in input
    │
    ▼
Client: socket.emit('typing', roomId, username)
    │
    ▼
Server: if (socket.data.typingTimeout) clearTimeout(socket.data.typingTimeout)
        io.to(roomId).emit('isTyping', true, username)
        socket.data.typingTimeout = setTimeout(() => {
            io.to(roomId).emit('isTyping', false, username)
        }, 2000)
    │
    ▼
Other clients: Display "{username} is typing..."
    │
    ▼
[After 2s of no typing]
    │
    ▼
Server: io.to(roomId).emit('isTyping', false, username)
    │
    ▼
Other clients: Hide typing indicator
```

## Key Features

### Room Cleanup

```typescript
// Runs every hour
setInterval(() => {
    const now = Date.now();
    for (const [key, value] of map.entries()) {
        if (value.users.size === 0 || now - value.lastActive > hour) {
            map.delete(key);
        }
    }
}, hour);
```

- Empty rooms deleted
- Inactive rooms (>1hr) deleted
- No persistence - restart = data loss

### Socket Singleton

```typescript
// utils/socket.ts
const socket: Socket<ServertoClientEvents, ClienttoServerEvents> = io(
    'http://localhost:6006'
);

export default socket;  // Single instance across app
```

### Custom Hooks

**useEnter** - Submit on Enter key
```typescript
export const useEnter = (func: () => void) => {
    const EnterRef = useRef<HTMLButtonElement>(null);
    useEffect(() => {
        const handleEnter = (e: KeyboardEvent) => {
            if (e.key === 'Enter' && !e.repeat) func();
        };
        window.addEventListener('keydown', handleEnter);
        return () => window.removeEventListener('keydown', handleEnter);
    }, [func]);
    return EnterRef;
};
```

**useScrollBottom** - Auto-scroll to latest message
```typescript
export const useScrollBottom = (dependency: any[]) => {
    const containerRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    }, [dependency]);
    return containerRef;
};
```

## Development

```bash
# Terminal 1 - Backend
cd Typescript
bun install
bun --watch index.ts

# Terminal 2 - Frontend
cd next-socket-client
bun install
bun run dev
```

## Deployment

### Backend

```dockerfile
FROM oven/bun:latest
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --production
COPY . .
EXPOSE 6006
CMD ["bun", "run", "index.ts"]
```

### Frontend

```typescript
// next.config.ts
const nextConfig = {
    output: 'export',
    distDir: 'dist'
};
```

```bash
cd next-socket-client
bun run build
# Deploy 'dist/' folder to Vercel/Netlify
```

## Environment Variables

```bash
# Backend (.env)
PORT=6006

# Frontend (.env.local)
NEXT_PUBLIC_BACKEND_SOCKET_URL=http://localhost:6006
```

## Design Decisions

| Decision | Rationale |
|----------|-----------|
| **In-memory storage** | Ephemeral by design, no persistence needed |
| **No authentication** | Anonymous chat, frictionless onboarding |
| **Small room IDs (6-char hex)** | Mobile-friendly, easy to share |
| **Atomic Zustand stores** | Better separation, selective re-renders |
| **Socket.IO rooms** | Built-in broadcast isolation |
| **Client-side rendering** | Socket.IO needs browser env |

## References

- [Socket.IO Documentation](https://socket.io/docs/v4)
- [Next.js App Router](https://nextjs.org/docs/app)
- [Zustand State Management](https://docs.pmnd.rs/zustand)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Bun Runtime](https://bun.sh/docs)
- [Express.js](https://expressjs.com/en/api.html)
- [Framer Motion](https://www.framer.com/motion/introduction)
- [Socket.IO TypeScript](https://socket.io/docs/v4/typescript)

---

*Last Updated: 2026-02-16*
