import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Chat, ChatDocument } from "./chats.schema";
import { UserChats, UserChatsDocument } from "./userChats.schema";
import { Message, MessageDocument } from "./message.schema";

@Injectable()
export class ChatsService {
  constructor(
    @InjectModel(Chat.name) private chatModel: Model<ChatDocument>,
    @InjectModel(UserChats.name) private userChatsModel: Model<UserChatsDocument>,
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>
  ) {}

  async send(data) {
    const { user, receiver, message } = data;

    if (!user || !receiver || !message) {
      throw new BadRequestException("Inavlid data");
    }

    const messageInfo = {
      text: message,
      senter: user._id,
      time: Date.now(),
    };

    const userChatsInDB = await this.userChatsModel.findOne({ user: user._id }).clone();

    if (!userChatsInDB) {
      const newMessage = await this.messageModel.create(messageInfo);
      const newChat = await this.chatModel.create({
        receiver: receiver.username,
        messages: [newMessage],
      });
      const result = await this.userChatsModel.create({
        user: user._id,
        chats: [newChat._id],
      });

      await this.getMessage({ receiver, senter: user, message });

      return result;
    }

    const chat = userChatsInDB.chats.find((el) => el.receiver === receiver.username);

    if (!chat) {
      const newMessage = await this.messageModel.create(messageInfo);
      const newChat: ChatDocument = await this.chatModel.create({
        receiver: receiver.username,
        messages: [newMessage],
      });

      userChatsInDB.chats.push(newChat._id);

      const result = await this.userChatsModel.findOneAndUpdate(
        { user: user._id },
        {
          chats: userChatsInDB.chats,
        }
      );

      await this.getMessage({ receiver, senter: user, message });

      return result;
    }

    const newMessage = await this.messageModel.create(messageInfo);
    const chatInDB = await this.chatModel.findById(chat.id);
    chatInDB.messages.unshift(newMessage);

    const result = this.chatModel.findByIdAndUpdate(chatInDB._id, {
      receiver: receiver.username,
      messages: chatInDB.messages,
    });

    await this.getMessage({ receiver, senter: user, message });

    return result;
  }

  async getMessage(data) {
    const { receiver, senter, message } = data;

    const messageInfo = {
      text: message,
      senter: senter._id,
      time: Date.now(),
    };

    const receiverChatsInDB = await this.userChatsModel.findOne({ user: receiver.id }).clone();

    if (!receiverChatsInDB) {
      const newMessage = await this.messageModel.create(messageInfo);
      const newChat = await this.chatModel.create({
        receiver: senter.username,
        messages: [newMessage],
      });
      const result = await this.userChatsModel.create({
        user: receiver._id,
        chats: [newChat._id],
      });
      return result;
    }

    const chat = receiverChatsInDB.chats.find((el) => el.receiver === senter.username);

    if (!chat) {
      const newMessage = await this.messageModel.create(messageInfo);
      const newChat: ChatDocument = await this.chatModel.create({
        receiver: senter.username,
        messages: [newMessage],
      });

      receiverChatsInDB.chats.push(newChat._id);

      const result = await this.userChatsModel.findOneAndUpdate(
        { user: receiver._id },
        {
          chats: receiverChatsInDB.chats,
        }
      );
      return result;
    }

    const newMessage = await this.messageModel.create(messageInfo);
    const chatInDB = await this.chatModel.findById(chat.id);
    chatInDB.messages.unshift(newMessage);

    const result = this.chatModel.findByIdAndUpdate(chatInDB._id, {
      receiver: senter.username,
      messages: chatInDB.messages,
    });

    return result;
  }

  async getUserChats(uid: string) {
    const chatsInDb = await this.userChatsModel.findOne({ user: uid }).populate("chats").exec();
    return chatsInDb.chats;
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
