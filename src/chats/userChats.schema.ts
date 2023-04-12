import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document, ObjectId } from "mongoose";
import { Chat } from "./chats.schema";
import { User } from "src/users/user.schema";

export type UserChatsDocument = UserChats & Document;

@Schema()
export class UserChats {
  @Prop({})
  user: string;

  @Prop([Chat])
  chats: Chat[];
}

export const UserChatsSchema = SchemaFactory.createForClass(UserChats);
