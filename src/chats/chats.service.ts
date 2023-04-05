import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Chat, ChatDocument } from "./chats.schema";
import { UserChats, UserChatsDocument } from "./userChats.schema";

@Injectable()
export class ChatsService {
  constructor(
    @InjectModel(Chat.name) private chatModel: Model<ChatDocument>,
    @InjectModel(UserChats.name) private userChatsModel: Model<UserChatsDocument>
  ) {}

  async getUserChats(uid: string) {
    return this.userChatsModel.findOne({ user: uid });
  }

  async getChatHistory(id: string, offset: number, amount: number) {
    if (!id) {
      throw new BadRequestException("Id is not specified");
    }

    const chat = await this.chatModel.findById(id);

    if (!chat) {
      throw new BadRequestException("Cannot find the chat");
    }

    const end: number = offset + amount;

    let result = [];

    for (let i = offset; i < end; i++) {
      if (i >= chat.messages.length) {
        break;
      }
      result.push(chat.messages[i]);
    }

    return result;
  }
}
