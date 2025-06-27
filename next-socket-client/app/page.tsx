'use client';

import { useEffect } from 'react';
import { CopyIcon } from '@radix-ui/react-icons';
import { toast, Toaster } from 'sonner';
import { useGenerate, usePending, useRoomId, useUsername } from '@/store/store';
import { useRouter } from 'next/navigation';
import socket from '@/utils/socket';
import Footer from '@/components/Footer';
import { ToggleTheme } from '@/components/ToggleTheme';
import { useEnter } from '@/store/useEnter';
import { motion } from 'motion/react';
import Loader from '@/components/Loader';

export default function Home() {
  const { roomId, setRoomId } = useRoomId();
  const { username, setUsername } = useUsername();
  const { generate, setGenerate } = useGenerate();
  const { isPending, setPending } = usePending();

  const router = useRouter();

  useEffect(() => {
    socket.on('room-created', (socketGeneratedRoomId) => {
      setRoomId(socketGeneratedRoomId);
      setGenerate(true);
      setPending(false);
      toast.success(`Room Id Created ${roomId}`);
    });

    return () => {
      socket.off('room-created');
      socket.off('isConnected');
    };
  }, [roomId]);

  const createId = () => {
    setPending(true);
    socket.emit('create-room');
  };

  const handleRoomJoin = () => {
    if (!roomId) {
      toast.error('Enter Room Id');
      return;
    } else if (username.trim() == '') {
      toast.error('Enter username');
      return;
    } else {
      socket.emit('private-chat', roomId, username);
      socket.on('isConnected', (value: boolean) => {
        if (value) {
          router.push(`/chat-room?username=${username}&roomId=${roomId}`);
        } else {
          toast.error('This Room do not exist');
        }
      });
    }
  };

  const EnterRef = useEnter(handleRoomJoin);

  const handleCopy = () => {
    navigator.clipboard.writeText(roomId);
    toast.success(`Copied: ${roomId}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, filter: 'blur(16px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.5 }}
      className="overflow-hidden"
    >
      <div
        className={`flex justify-end px-[14px] pt-[20px] lg:h-[50px] lg:px-[30px] lg:pt-[30px]`}
      >
        <ToggleTheme />
      </div>
      <div
        className={`mx-auto mt-[110px] flex h-[330px] flex-col lg:mt-[60px] lg:h-[400px] lg:w-[1000px]`}
      >
        <h1 className="mx-auto bg-gradient-to-r from-fuchsia-400 via-pink-400 to-red-400 bg-clip-text pt-[20px] text-[33px] font-bold text-transparent lg:text-[78px]">
          Welcome to Privado
        </h1>

        <Toaster />
        <div className="mx-auto flex flex-col gap-[4px]">
          <div className="mx-auto flex flex-col p-2 lg:p-4">
            <input
              className="mx-auto h-[40px] w-[320px] rounded-[4px] border-1 border-black/50 p-2 text-[15px] outline-none lg:h-[40px] lg:w-[560px] lg:rounded-[4px] lg:border-1 lg:text-[16px] dark:border-white/50"
              type="text"
              placeholder="Enter Room Id"
              maxLength={6}
              value={roomId}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setRoomId(e.target.value)
              }
            />
            <input
              className="mx-auto mt-[8px] h-[40px] w-[320px] rounded-[4px] border-1 border-black/50 p-2 text-[15px] outline-none lg:mt-[10px] lg:h-[40px] lg:w-[560px] lg:rounded-[4px] lg:border-1 lg:text-[16px] dark:border-white/50"
              type="text"
              placeholder="Username"
              maxLength={20}
              value={username}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setUsername(e.target.value)
              }
            />
            <button
              className="lg:text[14px] mt-[10px] h-[38px] w-[320px] cursor-pointer rounded-[4px] bg-black text-[15px] font-medium text-white transition-all duration-300 hover:bg-black/85 lg:mt-[16px] lg:h-[38px] lg:w-[560px] lg:rounded-[6px] lg:text-[16px] dark:bg-white dark:text-black hover:dark:bg-white/90"
              onClick={handleRoomJoin}
              ref={EnterRef}
            >
              Join Room
            </button>
          </div>
          <span className="mx-auto w-[240px] p-2 text-center text-[15px] lg:w-[700px] lg:text-[16px]">
            Don&apos;t have any Room to join? Create your own Private Room
          </span>
          <button
            className="mx-auto h-[38px] w-[320px] cursor-pointer rounded-[4px] bg-blue-400 text-[15px] font-medium text-white transition-all duration-300 hover:bg-blue-400/90 lg:mt-[1px] lg:h-[38px] lg:w-[560px] lg:rounded-[6px] lg:text-[16px]"
            onClick={createId}
          >
            {isPending ? (
              <span className="flex flex-row items-center justify-center gap-x-2">
                Creating... <Loader />
              </span>
            ) : (
              'Create New Room'
            )}
          </button>
          {generate == true && (
            <div className="mx-auto mt-[4px] flex w-[240px] flex-col items-center text-center text-[15px] lg:mt-0 lg:w-fit lg:flex-row lg:text-[16px]">
              <div className="mx-auto w-[240px] p-2 text-center text-[15px] lg:w-fit lg:text-[16px]">
                Share this Room Id with your friends to chat privately:
              </div>
              <span className="mt-[-12px] flex w-[120px] items-center justify-center text-[16px] font-semibold lg:mt-[0px] lg:ml-[-8px] lg:w-fit lg:text-[18px]">
                <span className="w-fit px-[8px]">{roomId}</span>

                <CopyIcon
                  className="h-[40px] w-[22px] cursor-pointer text-black/80 transition-colors duration-300 hover:text-black dark:text-white/80 dark:hover:text-white"
                  onClick={handleCopy}
                />
              </span>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </motion.div>
  );
}
