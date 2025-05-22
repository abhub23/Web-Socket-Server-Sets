'use client';

import { io } from 'socket.io-client';
import { useMessage } from '@/store/store';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { toast, Toaster } from 'sonner';
import socket from '@/utils/socket';
import type { Msgtype } from '@/store/store';
import Button from '@/components/Button';
import { CopyIcon } from '@radix-ui/react-icons';

const Chatroom = () => {
  const searchParams = useSearchParams();
  const username = searchParams.get('username');
  const roomId = searchParams.get('roomId');
  const [chatmessage, setChatMessage] = useState('');
  const { message, addMessage } = useMessage();
  const [client, setClient] = useState('')
  const [socketCount, setSocketCount] = useState<number>(0)

  console.log('before', message);

  const handleCopy = () => {
    navigator.clipboard.writeText(roomId);
    toast.success(`Copied: ${roomId}`);
  };

  const currTime = () => {
    return new Date().toLocaleTimeString('en-US', { hour12: true });
  };

  useEffect(() => {
    const handleEnter = (e: KeyboardEvent) => {
      if (e.key == 'Enter') {
        handleMessage();
      }
    };
    window.addEventListener('keydown', handleEnter);

    return () => {
      window.removeEventListener('keydown', handleEnter);
    };
  });

  const receiveMessage = ({ senderId, message, time }: Msgtype) => {
    console.log('Received message:', senderId, message, time);
    addMessage({ senderId, message, time });
    setClient(senderId)
    console.log('after', message);
  };

  useEffect(() => {
    console.log(socket.connected)
    socket.on('receive-message', receiveMessage);

    socket.on('socket-length', (listeners: number) => {
      setSocketCount(listeners)
      console.log('socket lengthhhhhhhhhhhhhhh   :', listeners);
    });

    return () => {
      socket.off('receive-message', receiveMessage);
      socket.off('socket-length')
    };
  },[]);

  const handleMessage = () => {
    if (chatmessage == '') {
      toast.error('Empty message cant be send');
      return;
    }

    const time = currTime();
    console.log(time);
    socket.emit('message', roomId, chatmessage, time);


    console.log(
      'message: ',
      message,
      'rooom id: ',
      roomId,
      'chat msg:',
      chatmessage,
    );
  };
  return (
    <>

      <div className='bg-bg-[#575858]/40 /90 dark:bg-[#575858]/20 text-[18px] text-white/60 items-center flex justify-around lg:mt-[16px] lg:rounded-[6px] lg:h-[50px] lg:w-[680px] mx-auto'>
        <div className="flex items-center mt-[4px] lg:mt-0 lg:text-[16px] text-[11px] lg:gap-2 gap-1">
          Share Room Id :
          <span className="lg:text-[16px] text-[14px] font-semibold">
            {roomId}
          </span>
          <CopyIcon
            className="h-[34px] w-[20px] text-black/80 hover:text-black dark:text-white/60 dark:hover:text-white transition-colors duration-300 cursor-pointer"
            onClick={handleCopy}
          />
        </div>
        <p>Users: {socketCount} </p>
      </div >
      <div
        className='lg:h-[520px] lg:w-[680px] w-[350px] h-[600px] text-yellow-300 p-1 overflow-auto outline-none mx-auto rounded-[6px] border-1 lg:mt-[12px] border-black/50 dark:border-white/60 flex flex-col gap-1'
      >
        {message.map((msg, id) => (
          <div
            key={id}
            className={`flex ${client === msg.senderId ? 'justify-end mr-[8px]' : 'justify-start mr-[8px]'}`}
          >
            <div
              className={`text-white dark:text-black bg-black/85 font-medium my-[4px] dark:bg-white/90 border-1 break-words border-black/50 w-fit h-fit text-justify max-w-[430px] rounded-[6px] dark:border-white/60 p-[4px] px-[10px]`}
            >
              {msg.message}
              <p className="text-zinc-300/80 dark:text-zinc-700 lg:text-[14px]">
                {msg.time}
              </p>
            </div>
          </div>
        ))}
      </div>


      <div className="fixed bottom-[10px] lg:h-[60px] lg:w-[860px] left-1/2 transform -translate-x-1/2">
        <Toaster />
        <div className="flex flex-row mx-auto justify-center">
          <input
            className="lg:h-[40px] lg:p-[8px] lg:w-[570px] lg:mr-3 border-1 rounded-[6px] outline-none border-black/80 dark:border-white/80 lg:text-[16px]"
            type="text"
            placeholder="Message"
            value={chatmessage}
            onChange={(e: React.ChangeEvent<any>) =>
              setChatMessage(e.target.value)
            }
          />
          <Button onClick={handleMessage} />
        </div>
      </div>
    </>
  );
};

export default Chatroom;
