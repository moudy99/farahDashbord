import { User } from './user';

export interface Chat {
  chatId: number;
  user: User;
  lastMessage: string;
  lastMessageSentAt: string;
  isRead: boolean;
  iamTheLastMessageSender: boolean;
}
