import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger/dist/decorators";
import { Document } from "mongoose";

export type UserDocument = User & Document;

@Schema()
export class User {
  @ApiProperty({ example: "dino123" })
  @Prop({ required: true })
  username: string;

  @ApiProperty({ example: "example@mail.com" })
  @Prop({ required: true })
  email: string;

  @ApiProperty({ example: "password" })
  @Prop({ required: true })
  password: string;

  @ApiProperty({ example: "I like pizza and air conditioners" })
  @Prop()
  bio: string;

  @ApiProperty({ example: "0bd89719-0023-4417-9cb5-45b93676129c.jpg" })
  @Prop()
  profileImage: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
