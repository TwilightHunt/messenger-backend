import { Controller, Post, Body, UseGuards, UsePipes } from "@nestjs/common";
import { ApiOperation, ApiResponse } from "@nestjs/swagger/dist";
import { ApiTags } from "@nestjs/swagger/dist/decorators";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { ValidationPipe } from "src/pipes/validation.pipe";
import { CreateUserDto } from "./dto/create-user.dto";
import { User } from "./user.schema";
import { UsersService } from "./users.service";

@ApiTags("Users")
@Controller("users")
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiOperation({ summary: "User creating" })
  @ApiResponse({ status: 200, type: [User] })
  @UsePipes(ValidationPipe)
  @Post()
  create(@Body() userDto: CreateUserDto) {
    return this.usersService.create(userDto);
  }

  //@UseGuards(JwtAuthGuard)
}
