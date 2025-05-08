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