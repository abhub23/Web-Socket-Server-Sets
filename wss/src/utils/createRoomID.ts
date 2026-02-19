import { randomBytes } from 'crypto';

export const createRoomID = (): string => {
  return randomBytes(3).toString('hex').toUpperCase();
};
