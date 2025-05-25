import { useEffect, useRef } from "react"
import type { Msgtype } from "./store"

export const useScrollBottom = (message: Msgtype[]) => {

    const containerRef = useRef<HTMLDivElement>(null)
    useEffect(() => {
        const container = containerRef.current
        if (container) {
            container.scrollTo({
                top: container.scrollHeight,
                behavior: 'smooth',
            });
        }
    }, [message])

    return containerRef
}

