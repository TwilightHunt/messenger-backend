import { Injectable, BadRequestException } from "@nestjs/common";
import { UserDto } from "src/users/dto/user.dto";
import { UsersService } from "src/users/users.service";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import * as bcrypt from "bcryptjs";
import { UserDocument } from "src/users/user.schema";
import { AuthDto } from "./dto/auth.dto";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService
  ) {}

  async register(userDto: UserDto): Promise<any> {
    const userExists = await this.usersService.findByUsername(userDto.username);

    if (userExists) {
      throw new BadRequestException("User already exists");
    }

    const newUser = await this.usersService.create({
      ...userDto,
      password: bcrypt.hashSync(userDto.password, 10),
    });

    const tokens = await this.getTokens(newUser);
    return tokens;
  }

  async login(userDto: AuthDto) {
    const user = userDto.login.includes("@")
      ? await this.usersService.findByEmail(userDto.login)
      : await this.usersService.findByUsername(userDto.login);

    if (!user) {
      throw new BadRequestException("User does not exists");
    }

    if (!bcrypt.compareSync(userDto.password, user.password)) {
      throw new BadRequestException("Password is incorrect");
    }

    const tokens = await this.getTokens(user);
    return { ...tokens, user };
  }

  async getTokens(payload: UserDocument) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { user: payload },
        {
          secret: process.env.JWT_ACCESS_SECRET,
          expiresIn: "15m",
        }
      ),
      this.jwtService.signAsync(
        { user: payload },
        {
          secret: process.env.JWT_REFRESH_SECRET,
          expiresIn: "7d",
        }
      ),
    ]);
    return { accessToken, refreshToken };
  }
}
