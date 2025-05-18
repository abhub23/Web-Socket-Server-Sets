'use client';

import { io } from 'socket.io-client';
import { useTheme } from 'next-themes';
import { MoonIcon, SunIcon, CopyIcon } from '@radix-ui/react-icons';
import { toast, Toaster } from 'sonner';
import { createRoomID } from '@/utils/createRoomID';
import { SafeRender } from '@/utils/Saferender';
import { useGenerate, useRoomId, useUsername } from '@/store/store';
import { useRouter } from 'next/navigation';

const socket = io(process.env.NEXT_PUBLIC_BACKEND_SOCKET_URL);

export default function Home() {
  const { roomId, setRoomId } = useRoomId();
  const { username, setUsername } = useUsername();
  const { generate, setGenerate } = useGenerate()
  const { theme, setTheme } = useTheme();

  const router = useRouter()

  const toggleTheme = () => {
    setTheme(theme == 'light' ? 'dark' : 'light');
  };

  const validateRoomId = (Id: string) => {
    return /^\d{4}$/.test(Id)
  }
  const createId = () => {
    setRoomId(createRoomID());
    toast.success('Room Id Created');
    setGenerate(true)
  };

  const handleRoomJoin = (e: React.ChangeEvent<any>) => {
    if (!roomId || (!validateRoomId(roomId))) {
      toast.error('Enter a valid room Id');
      return
    } else if (username == '') {
      toast.error('Enter username')
      return
    }
    else {
      console.log(username, roomId)
      socket.emit('private-chat', ({
        roomId: roomId
      }))
      router.push(`/chat-room?username=${username}&roomId=${roomId}`)

    }

  };

  const handleRoomId = () => {
    navigator.clipboard.writeText(roomId);
    toast.success(`Copied: ${roomId}`);
  };

  return (
    <>
      <div
        className={`lg:h-[60px] flex lg:px-[40px] lg:pt-[30px] px-[30px] pt-[30px] justify-end`}
      >
        <span className="h-[20px] cursor-pointer" onClick={toggleTheme}>
          <SafeRender>
            {theme == 'light' ? (
              <MoonIcon className="h-[20px] w-[20px]" />
            ) : (
              <SunIcon className="h-[20px] w-[20px]" />
            )}
          </SafeRender>
        </span>
      </div>
      <div
        className={`lg:mt-[70px] mt-[140px] flex flex-col lg:w-[1000px] lg:h-[400px] mx-auto `}
      >
        <h1 className="pt-[20px] text-[30px] lg:text-[78px] mx-auto font-bold bg-gradient-to-r from-fuchsia-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
          Welcome to Chathub
        </h1>

        <Toaster />
        <div className="flex flex-col gap-[4px] mx-auto">
          <div className="lg:p-4 p-2 flex flex-col mx-auto">
            <input
              className="lg:h-[38px] h-[34px] lg:w-[560px] w-[300px] lg:rounded-[4px] p-2 rounded-[4px] lg:text-[16px] text-[14px] lg:border-2 border-1 outline-none border-black/50 dark:border-white/50 mx-auto "
              type="text"
              placeholder="Enter Room Id"
              maxLength={4}
              value={roomId}
              onChange={(e: any) => setRoomId(e.target.value)}
            />
            <input
              className="lg:h-[38px] h-[34px] lg:w-[560px] w-[300px] lg:mt-[10px] mt-[8px] lg:rounded-[4px] p-2 rounded-[4px] lg:text-[16px] text-[14px] lg:border-2 border-1 outline-none border-black/50 dark:border-white/50 mx-auto "
              type="text"
              placeholder="Username"
              maxLength={20}
              value={username}
              onChange={(e: any) => setUsername(e.target.value)}
            />
            <button
              className="lg:h-[36px] h-[32px] lg:w-[560px] w-[300px] lg:rounded-[6px] rounded-[4px] lg:text-[16px] text-[14px] lg:mt-[16px] mt-[10px] lg:text[14px] text-white dark:text-black bg-black dark:bg-white hover:bg-black/85 transition-all duration-300 hover:dark:bg-white/90 cursor-pointer"
              onClick={handleRoomJoin}
            >
              Join Room
            </button>



          </div>
          <span className="p-2 lg:text-[16px] text-[14px] lg:w-[700px] text-center w-[220px] mx-auto">
            Don't have any Room to join? Create your own Private Room
          </span>
          <button
            className="lg:h-[36px] h-[32px] lg:w-[560px] w-[300px] lg:rounded-[6px] rounded-[4px] lg:text-[16px] text-[14px] lg:mt-[1px] mx-auto text-white bg-blue-400 hover:bg-blue-400/90 transition-all duration-300 cursor-pointer"
            onClick={createId}
          >
            Create Room
          </button>
          {generate == true && (
            <div className="lg:p-2 mx-auto">
              <div className="flex items-center lg:text-[16px] text-[14px] gap-2">
                Share this Room Id with your friends to chat privately:
                <span className="lg:text-[18px] text-[16px] font-semibold">
                  {roomId}
                </span>
                <CopyIcon
                  className="h-[34px] w-[20px] cursor-pointer"
                  onClick={handleRoomId}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
