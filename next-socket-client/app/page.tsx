'use client'

import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { Bricolage } from "@/utils/fonts";
import { useTheme } from "next-themes";
import { MoonIcon, SunIcon, CopyIcon } from "@radix-ui/react-icons";
import { toast, Toaster } from 'sonner'
import { createRoomID } from "@/utils/createRoomID";
import { SafeRender } from "@/utils/Saferender";

const Socket_URL = 'http://localhost:6006'

const socket = io(Socket_URL)

export default function Home() {

  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme == 'light' ? 'dark' : 'light')
  }

  const [message, setMessage] = useState<string>('')
  const [chat, setChat] = useState<string[]>([])
  const [roomId, setRoomId] = useState<number>(0)

  const handleMessage = (e: any) => {
    const msg = e.target.value
    setMessage(msg)
  }

  const createId = () => {
    setRoomId(createRoomID())
      toast.success('Room Id Created')
  }

 const handleRoomId = () => {
  navigator.clipboard.writeText(roomId.toString())
  toast.success(`Copied: ${roomId}`)
 }
  return (
    <>
      <div className={`lg:h-[60px] flex lg:px-[40px] lg:pt-[30px] px-[30px] pt-[30px] justify-end ${Bricolage}`}>
        <span className="h-[20px] cursor-pointer" onClick={toggleTheme}>
          <SafeRender>
          {theme == 'light' ? (<MoonIcon className="h-[20px] w-[20px]" />) : (<SunIcon className="h-[20px] w-[20px]" />)}
          </SafeRender>
          </span>
      </div>
      <div className={`lg:mt-[80px] mt-[140px] flex flex-col lg:w-[1000px] lg:h-[400px] mx-auto ${Bricolage}`}>
        <span className="pt-[20px] lg:text-[64px] text-[30px] mx-auto font-bold">Welcome to Chathub</span>
        <Toaster/>
        <div className="flex flex-col gap-[4px] mx-auto">
          <div className="lg:p-4 p-2 flex flex-col mx-auto">
            <input className="lg:h-[38px] h-[32px] lg:w-[500px] w-[280px] lg:rounded-[4px] p-2 rounded-[4px] lg:text-[16px] text-[14px] lg:border-2 border-1 outline-none border-black/50 dark:border-white/50 mx-auto "
              type="text" placeholder="Enter Room Id" maxLength={4} />
            <button className="lg:h-[36px] h-[30px] lg:w-[500px] w-[280px] lg:rounded-[6px] rounded-[4px] lg:text-[16px] text-[14px] lg:mt-[10px] mt-[10px] lg:text[14px] text-white dark:text-black bg-black dark:bg-white hover:bg-black/90 hover:dark:bg-white/90 cursor-pointer">Join Room</button>
          </div>
          <span className="p-2 lg:text-[16px] text-[14px] lg:w-[700px] text-center w-[220px] mx-auto">Don't have any Room to join? Create your own Private Room</span>
          <button className="lg:h-[36px] h-[30px] lg:w-[500px] w-[280px] lg:rounded-[6px] rounded-[4px] lg:text-[16px] text-[14px] lg:mt-[1px] mx-auto text-white bg-blue-400 hover:bg-blue-400/95 cursor-pointer"
            onClick={createId}>Create Room
          </button>
          {roomId != 0 &&
            <div className="lg:p-2 mx-auto">
              <div className="flex items-center lg:text-[16px] text-[14px] gap-2">
                Room Id Created:
                <span className="lg:text-[18px] text-[16px] font-semibold">{roomId}</span>
                <CopyIcon className="h-[34px] w-[20px] cursor-pointer" onClick={handleRoomId}/>
              </div>
            </div>
          }

        </div>

      </div>

    </>

  );
}
