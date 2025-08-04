'use client';

import { useEffect } from 'react';
import { CopyIcon } from '@radix-ui/react-icons';
import { toast } from 'sonner';
import { useGenerate, usePending, useRoomId, useUsername } from '@/store/store';
import { useRouter } from 'next/navigation';
import socket from '@/utils/socket';
import Footer from '@/components/Footer';
import { SafeRender, ToggleTheme } from '@/components/ToggleTheme';
import { useEnter } from '@/store/useEnter';
import { easeInOut, motion } from 'motion/react';
import { Loader } from 'lucide-react';
import AnimatedText from '@/components/AnimatedText';
import { useTheme } from 'next-themes';

export default function Home() {
  const { roomId, setRoomId } = useRoomId();
  const { username, setUsername } = useUsername();
  const { generate, setGenerate } = useGenerate();
  const { isPending, setPending } = usePending();

  const { theme } = useTheme();

  const router = useRouter();

  useEffect(() => {
    socket.on('room-created', (socketGeneratedRoomId) => {
      setRoomId(socketGeneratedRoomId);
      setGenerate(true);
      setPending(false);
      toast.success(`New Room created`);
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
      toast.error('Enter your name');
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
    <div className="relative min-h-screen w-full bg-neutral-100 dark:bg-neutral-950">
      <SafeRender>
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage:
              theme == 'light'
                ? `
        radial-gradient(
          circle at top left,
          rgba(56, 193, 182, 0.6),
          transparent 70%
        )
      `
                : `
          radial-gradient(ellipse 120% 80% at 70% 20%, rgba(255, 20, 147, 0.15), transparent 60%),
          radial-gradient(ellipse 100% 60% at 30% 10%, rgba(0, 255, 255, 0.15), transparent 60%),
          radial-gradient(ellipse 90% 70% at 50% 0%, rgba(138, 43, 226, 0.18), transparent 65%),
          radial-gradient(ellipse 110% 50% at 80% 30%, rgba(255, 215, 0, 0.08), transparent 40%)
        `,
          }}
        >

          <span className="mt-[150px] flex items-center justify-center lg:mt-[120px]">
            <AnimatedText text={'Welcome to Privado'} />
          </span>
          <div className={`fixed top-[20px] right-[20px]`}>
            <ToggleTheme />
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20, filter: 'blur(16px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.5, ease: easeInOut }}
            className={`mx-auto mt-[10px] flex h-[330px] flex-col lg:mt-[1px] lg:h-[320px] lg:w-[1000px]`}
          >
            <div className="mx-auto flex flex-col gap-[4px]">
              <div className="mx-auto flex flex-col p-2 lg:p-4">
                <input
                  className="mx-auto h-[40px] w-[320px] rounded-[4px] border-1 border-black/50 p-2 text-[15px] outline-none lg:h-[40px] lg:w-[580px] lg:rounded-[4px] lg:border-1 lg:text-[16px] dark:border-white/50"
                  type="text"
                  placeholder="Enter Room Id"
                  maxLength={6}
                  value={roomId}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setRoomId(e.target.value)
                  }
                />
                <input
                  className="mx-auto mt-[8px] h-[40px] w-[320px] rounded-[4px] border-1 border-black/50 p-2 text-[15px] outline-none lg:mt-[10px] lg:h-[40px] lg:w-[580px] lg:rounded-[4px] lg:border-1 lg:text-[16px] dark:border-white/50"
                  type="text"
                  placeholder="Enter your name"
                  maxLength={20}
                  value={username}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setUsername(e.target.value)
                  }
                />
                <button
                  className="lg:text[14px] mt-[10px] h-[38px] w-[320px] cursor-pointer rounded-[4px] bg-black text-[15px] font-medium text-white transition-all duration-300 hover:bg-black/85 lg:mt-[16px] lg:h-[40px] lg:w-[580px] lg:rounded-[6px] lg:text-[16px] dark:bg-white dark:text-black hover:dark:bg-white/90"
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
                className="mx-auto h-[38px] w-[320px] cursor-pointer rounded-[4px] bg-blue-400 text-[15px] font-medium text-white transition-all duration-300 hover:bg-blue-400/90 lg:mt-[1px] lg:h-[40px] lg:w-[580px] lg:rounded-[6px] lg:text-[16px]"
                onClick={createId}
              >
                {isPending ? (
                  <span className="flex flex-row items-center justify-center gap-x-2">
                    Creating <Loader className="animate-spin" />
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
          </motion.div>
          <Footer />
        </div>
      </SafeRender>
    </div>
  );
}
