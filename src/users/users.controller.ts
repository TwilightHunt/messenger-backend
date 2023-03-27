import { Controller, Post, Body } from "@nestjs/common";
import { ApiOperation, ApiResponse } from "@nestjs/swagger/dist";
import { ApiTags } from "@nestjs/swagger/dist/decorators";
import { CreateUserDto } from "./dto/create-user.dto";
import { User } from "./user.schema";
import { UsersService } from "./users.service";

@ApiTags("Users")
@Controller("users")
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiOperation({ summary: "User creating" })
  @ApiResponse({ status: 200, type: [User] })
  @Post()
  create(@Body() userDto: CreateUserDto) {
    return this.usersService.create(userDto);
  }
}
