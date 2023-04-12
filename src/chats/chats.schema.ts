import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";

export type ChatDocument = Chat & Document;

@Schema()
export class Chat {
  @Prop({ required: true })
  receiver: string;

  @Prop()
  messages: Array<Object>;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User" })
  id: string;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
