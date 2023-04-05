import {
  Controller,
  Get,
  Request,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { ChatsService } from "./chats.service";

@Controller("chats")
export class ChatsController {
  constructor(private chatsService: ChatsService) {}

  @UsePipes(ValidationPipe)
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor("profileImage"))
  @Get("/user-chats")
  async getUserChats(@Request() req) {
    return await this.chatsService.getUserChats(req.user._id);
  }
}
