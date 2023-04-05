import { Injectable } from "@nestjs/common";
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
}
