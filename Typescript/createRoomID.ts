import { randomBytes } from "crypto";

export const createRoomID: Function = (): string => {
    return randomBytes(3).toString('hex').toUpperCase()
}
