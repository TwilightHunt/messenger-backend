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
<<<<<<< Updated upstream
    return await this.chatsService.getUserChats(req.user._id);
=======
    const chats = await this.chatsService.getUserChats(req.user._id);

    return chats;
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
>>>>>>> Stashed changes
  }
}
