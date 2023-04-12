import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type MessageDocument = Message & Document;

@Schema()
export class Message {
  @Prop({ required: true })
  senter: string;

  @Prop({ required: true })
  text: string;

  @Prop()
  files: string;

  @Prop()
  time: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
