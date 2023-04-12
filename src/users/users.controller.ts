import { FileInterceptor } from "@nestjs/platform-express";
import { ApiOperation, ApiResponse } from "@nestjs/swagger/dist";
import { ApiTags } from "@nestjs/swagger/dist/decorators";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { ValidationPipe } from "src/pipes/validation.pipe";
import { UserDto } from "./dto/user.dto";
import { User } from "./user.schema";
import { UsersService } from "./users.service";
import {
  Controller,
  Put,
  Body,
  UsePipes,
  Get,
  Query,
  UseInterceptors,
  UploadedFile,
} from "@nestjs/common";

@ApiTags("Users")
@Controller("users")
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UsePipes(ValidationPipe)
  @ApiOperation({ summary: "User update" })
  @ApiResponse({ status: 200, type: [User] })
  // @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor("profileImage"))
  @Put("/update")
  async update(@Body() userDto: UserDto, @UploadedFile() file) {
    const data = { user: userDto, profileImage: file };
    return await this.usersService.update(data);
  }

  @Get("/user")
  async getByParam(@Query() query: Object) {
    return await this.usersService.findByParam(query);
  }
}
