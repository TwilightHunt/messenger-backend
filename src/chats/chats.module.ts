import { Module } from "@nestjs/common";
import { ChatsController } from "./chats.controller";
import { ChatsService } from "./chats.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Chat, ChatSchema } from "./chats.schema";
import { UserChats, UserChatsSchema } from "./userChats.schema";
import { JwtModule } from "@nestjs/jwt";

@Module({
  controllers: [ChatsController],
  providers: [ChatsService],
  imports: [
    JwtModule.register({}),
    MongooseModule.forFeature([{ name: Chat.name, schema: ChatSchema }]),
    MongooseModule.forFeature([{ name: UserChats.name, schema: UserChatsSchema }]),
  ],
})
export class ChatsModule {}
