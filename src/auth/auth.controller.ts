import { Controller, Post, Body, UsePipes, Res } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { ValidationPipe } from "src/pipes/validation.pipe";
import { UserDto } from "src/users/dto/user.dto";
import { AuthService } from "./auth.service";
import { Response } from "express";
import { AuthDto } from "./dto/auth.dto";

@ApiTags("Authorization")
@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("/login")
  async login(@Body() authDto: AuthDto, @Res({ passthrough: true }) response: Response) {
    const { refreshToken, accessToken, user } = await this.authService.login(authDto);
    response.cookie("refresh_token", refreshToken);
    return { user, token: accessToken };
  }

  @UsePipes(ValidationPipe)
  @Post("/register")
  async register(@Body() userDto: UserDto) {
    return this.authService.register(userDto);
  }
}
