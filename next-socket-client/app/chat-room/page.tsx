'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { toast, Toaster } from 'sonner'

const Chatroom = () => {
    const searchParams = useSearchParams()
    const username = searchParams.get('username')

    useEffect(() => {
        if (username) {
            toast.success(`${username} joined the room`)
        }
    }, [username])  // Add username to dependency array to avoid multiple toasts

    return (
        <>
            <Toaster />
            <div className="fixed bottom-[10px] lg:h-[60px] lg:w-[600px] left-1/2 transform -translate-x-1/2">
                <div className="flex flex-row">
                    <input
                        className="lg:h-[38px] lg:p-[8px] lg:w-[560px] border-1 rounded-[6px] outline-none border-black/80 dark:border-white/80 lg:text-[16px]"
                        type="text"
                        placeholder="Message"
                    />
                    <button
                        className="lg:h-[38px] lg:w-[140px] lg:ml-[12px] rounded-[6px] lg:text-16px font-medium bg-black dark:bg-white text-white dark:text-black cursor-pointer"
                        type="button"
                    >
                        Send
                    </button>
                </div>
            </div>
        </>
    )
}

export default Chatroom
