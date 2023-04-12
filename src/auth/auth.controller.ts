import { Controller, Post, Get, Body, UsePipes, Res, Req } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { ValidationPipe } from "src/pipes/validation.pipe";
import { UserDto } from "src/users/dto/user.dto";
import { AuthService } from "./auth.service";
import { Response, Request } from "express";
import { AuthDto } from "./dto/auth.dto";

@ApiTags("Authorization")
@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("/login")
  async login(@Body() authDto: AuthDto, @Res({ passthrough: true }) res: Response) {
    const { refreshToken, accessToken, user } = await this.authService.login(authDto);
    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    return { user, token: accessToken };
  }

  @UsePipes(ValidationPipe)
  @Post("/register")
  async register(@Body() userDto: UserDto) {
    return this.authService.register(userDto);
  }

  @Get("/refresh")
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const { refreshToken, accessToken } = await this.authService.refresh(
      req.cookies["refresh_token"]
    );

    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return { token: accessToken };
  }
}
