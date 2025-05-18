'use client'

import { io, Socket } from 'socket.io-client'
import React, { useEffect, useState, useRef } from 'react'
import { toast, Toaster } from 'sonner'
import { useSearchParams } from 'next/navigation'
import { useMessage } from '@/store/store'


const Chatroom = () => {
  const searchParams = useSearchParams()
  const username = searchParams.get('username')
  const roomId = searchParams.get('roomId')

  const [chatmessage, setChatMessage] = useState('')

  // Use useRef to keep socket instance persistent
  const socketRef = useRef<Socket | null>(null)

  const { message ,addMessage } = useMessage();

useEffect(() => {
    socketRef.current = io(process.env.NEXT_PUBLIC_BACKEND_SOCKET_URL || '');

    socketRef.current.on('connect', () => {
        if (roomId) {
            socketRef.current?.emit('private-chat', roomId, username || 'Anonymous');
        }
    });

    socketRef.current.on('receive-message', ({ senderId, message }) => {
        addMessage(`${senderId === socketRef.current?.id ? 'Me' : senderId}: ${message}`);
    });

    return () => {
        socketRef.current?.disconnect();
    };
}, [roomId, username, addMessage]);

  const handleMessage = () => {
    if (chatmessage.trim() === '') {
      toast.error("Empty message can't be sent")
      return
    }
    if (!roomId) {
      toast.error("No room ID provided")
      return
    }
    socketRef.current?.emit('message', roomId, chatmessage)
    setChatMessage('') // Clear input after sending
  }

  return (
    <>
      <div className="lg:h-[620px] lg:w-[560px] text-yellow-300 mx-auto border-1 border-black/50 dark:border-white/80 overflow-auto">
        <div className="overflow-auto ...">
    {message.map((msg, idx) => (
      <div key={idx}>{msg}</div>
    ))}
  </div>
      </div>

      <div className="fixed bottom-[10px] lg:h-[60px] lg:w-[600px] left-1/2 transform -translate-x-1/2">
        <Toaster />
        <div className="flex flex-row">
          <input
            className="lg:h-[38px] lg:p-[8px] lg:w-[560px] border-1 rounded-[6px] outline-none border-black/80 dark:border-white/80 lg:text-[16px]"
            type="text"
            placeholder="Message"
            value={chatmessage}
            onChange={(e) => setChatMessage(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleMessage() }}
          />
          <button
            className="lg:h-[38px] lg:w-[140px] lg:ml-[12px] rounded-[6px] lg:text-16px font-medium bg-black dark:bg-white text-white dark:text-black cursor-pointer"
            type="button"
            onClick={handleMessage}
          >
            Send
          </button>
        </div>
      </div>
    </>
  )
}

export default Chatroom
