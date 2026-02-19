type MessageType = {
  senderId: string;
  message: string;
  time: string;
};

export type RoomData = {
  users: Set<string>;
  messages: MessageType[];
  lastActive: number;
};
