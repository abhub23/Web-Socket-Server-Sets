import {create} from 'zustand'

type Roomtype = {
    roomId: string;
    setRoomId: (state: string) => void
}

export const useRoomId = create<Roomtype>((set) => ({
    roomId: '',
    setRoomId: (state: string) => set({roomId: state})
}))

type Usernametype = {
    username: string;
    setUsername: (state: string) => void
}

export const useUsername = create<Usernametype>((set) => ({
    username: '',
    setUsername: (state: string) => set({username: state})
}))

type Generatetype = {
    generate: boolean;
    setGenerate: (state: boolean) => void
}

export const useGenerate = create<Generatetype>((set) => ({
    generate: false,
    setGenerate: (state: boolean) => set({generate: state})
}))

type Messagetype = {
    message: Array<{senderId: string, message: string}>;
    addMessage: (senderId: string, message: string) => void
}

export const useMessage = create<Messagetype>((set, get) => ({
    message: [],
    addMessage: (senderId: string, message: string) => set((state) => ({
        message: [...state.message, {senderId, message}]
    }))
}))