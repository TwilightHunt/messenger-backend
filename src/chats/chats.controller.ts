import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { ChatsService } from "./chats.service";

@Controller("chats")
export class ChatsController {
  constructor(private chatsService: ChatsService) {}

  @UsePipes(ValidationPipe)
  @UseGuards(JwtAuthGuard)
  @Get("/user-chats")
  async getUserChats(@Request() req) {
    return await this.chatsService.getUserChats(req.user._id);
  }

  @Get("/history")
  async getChatHistory(@Query() query) {
    const { id, offset, amount } = query;
    return await this.chatsService.getChatHistory(id, offset, amount);
  }

  @UseGuards(JwtAuthGuard)
  @Post("/send")
  async send(@Request() req, @Body() body) {
    const user = req.user;
    const message = await this.chatsService.send({ ...body, user });
    return message;
  }
}
