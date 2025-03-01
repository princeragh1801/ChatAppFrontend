import { UserInterface } from "./user";

export interface ChatListItemInterface {
  id: string;
  name: string;
  admin: string;
  lastMessage?: string;
  lastMessageTime?: string;
  createdAt: string;
  isGroupChat: boolean;
  user: UserInterface;
  participants?: UserInterface[];
  updatedAt: string;
}

export interface ChatMessageInterface {
  id: string;
  sender: Pick<UserInterface, "id" | "avatar" | "email" | "username">;
  senderId: string;
  content: string;
  chat: string;
  sentAt : string;
  attachments: {
    url: string;
    localPath: string;
    _id: string;
  }[];
  createdAt: string;
  updatedAt: string;
}
