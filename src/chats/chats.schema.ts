import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type ChatDocument = Chat & Document;

@Schema()
export class Chat {
  @Prop({ required: true })
  receiver: string;

  @Prop()
  messages: Array<Object>;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
