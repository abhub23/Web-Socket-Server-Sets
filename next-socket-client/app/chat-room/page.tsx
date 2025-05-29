'use client';

import { useMessage } from '@/store/store';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { toast, Toaster } from 'sonner';
import socket from '@/utils/socket';
import type { Msgtype } from '@/store/store';
import Button from '@/components/Button';
import { CopyIcon } from '@radix-ui/react-icons';
import { ToggleTheme } from '@/components/ToggleTheme';
import { useScrollBottom } from '@/store/useScrollBottom';
import { useEnter } from '@/store/useEnter';

const Chatroom: React.FC = () => {
  const searchParams = useSearchParams();
  const username = searchParams.get('username') ?? '';
  const roomId = searchParams.get('roomId') ?? '';
  const [chatmessage, setChatMessage] = useState('');
  const { message, addMessage } = useMessage();
  const [socketCount, setSocketCount] = useState<number>(0);
  const containerRef = useScrollBottom(message);

  const handleCopy = () => {
    navigator.clipboard.writeText(String(roomId));
    toast.success(`Copied: ${roomId}`);
  };

  const currTime = () => {
    return new Date().toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    });
  };

  const receiveMessage = ({ senderId, message, time }: Msgtype) => {
    addMessage({ senderId, message, time });
  };

  useEffect(() => {
    socket.on('receive-message', receiveMessage);

    socket.on('socket-length', (listeners: number) => {
      setSocketCount(listeners);
    });

    return () => {
      socket.off('receive-message', receiveMessage);
      socket.off('socket-length');
    };
  }, []);

  const handleMessage = () => {
    if (chatmessage == '') {
      toast.error(`Empty message cannot be send`);
      return;
    }

    const time = currTime();
    socket.emit('message', roomId, chatmessage, time, username);
    setChatMessage('');
  };

  const SendRef = useEnter(handleMessage);
  return (
    <>
      <div className="mx-auto flex items-center justify-start bg-[#575858]/20 text-[12px] text-black lg:mt-[16px] lg:h-[50px] lg:w-[680px] lg:justify-around lg:rounded-[6px] lg:text-[16px] dark:bg-[#575858]/20 dark:text-white/60">
        <div className="ml-3 flex h-[50px] items-center gap-1 lg:gap-2">
          Share Room Id :
          <span className="text-[14px] font-semibold lg:text-[16px]">
            {roomId}
          </span>
          <CopyIcon
            className="h-[34px] w-[20px] cursor-pointer text-black/80 transition-colors duration-300 hover:text-black dark:text-white/60 dark:hover:text-white"
            onClick={handleCopy}
          />
        </div>
        <p className="ml-4">Connected Users: {socketCount} </p>
        <p className="fixed right-[10px] lg:top-[18px] lg:right-[26px]">
          <ToggleTheme />
        </p>
      </div>

      <div
        className="no-scrollbar mx-auto flex h-[580px] w-[360px] flex-col gap-1 border-1 border-black/30 p-1 outline-none lg:mt-[14px] lg:h-[520px] lg:w-[680px] lg:rounded-[6px] dark:border-b-white/20 lg:dark:border-white/20"
        ref={containerRef}
      >
        {message.map((msg, id) => (
          <div
            key={id}
            className={`flex ${msg.senderId == socket.id ? 'mr-[5px] justify-end' : 'ml-[5px] justify-start'}`}
          >
            <div
              className={`my-[2px] h-fit w-fit max-w-[230px] rounded-[6px] border-1 border-black/50 bg-black/85 p-[4px] px-[10px] text-start text-[14px] font-medium break-words text-white lg:max-w-[430px] lg:text-[16px] dark:border-white/60 dark:bg-white dark:text-black`}
            >
              {msg.message}
              <p className="text-[12px] text-zinc-300/80 lg:text-[12px] dark:text-zinc-700">
                {msg.time}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="fixed bottom-[10px] left-1/2 h-[40px] w-full -translate-x-1/2 transform lg:h-[60px] lg:w-[860px]">
        <div className="mx-auto flex flex-row justify-around lg:justify-center">
          <input
            className="h-[40px] w-[260px] rounded-[6px] border-1 border-black/30 p-[8px] outline-none lg:mr-3 lg:h-[42px] lg:w-[570px] lg:p-[12px] lg:text-[16px] dark:border-white/20"
            type="text"
            placeholder="Message"
            value={chatmessage}
            onChange={(e: React.ChangeEvent<any>) =>
              setChatMessage(e.target.value)
            }
          />
          <Button onClick={handleMessage} ref={SendRef} />
        </div>
      </div>
      <Toaster />
    </>
  );
};

export default Chatroom;
