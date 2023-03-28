import { Injectable, BadRequestException } from "@nestjs/common";
import { CreateUserDto } from "src/users/dto/create-user.dto";
import { UsersService } from "src/users/users.service";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import * as bcrypt from "bcryptjs";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService
  ) {}

  async register(userDto: CreateUserDto): Promise<any> {
    const userExists = await this.usersService.findByUsername(userDto.username);

    if (userExists) {
      throw new BadRequestException("User already exists");
    }

    const newUser = await this.usersService.create({
      ...userDto,
      password: bcrypt.hashSync(userDto.password, 10),
    });

    const tokens = await this.getTokens(newUser._id, newUser.username);
    return tokens;
  }

  async login(userDto: CreateUserDto) {
    const user = await this.usersService.findByUsername(userDto.username);
    if (!user) {
      throw new BadRequestException("User does not exists");
    }

    if (!bcrypt.compareSync(userDto.password, user.password)) {
      throw new BadRequestException("Password is incorrect");
    }

    const tokens = await this.getTokens(user._id, user.username);
    return tokens;
  }

  async getTokens(userId: string, username: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          syb: userId,
          username,
        },
        {
          secret: this.configService.get<string>("JWT_ACCESS_SECRET"),
          expiresIn: "15m",
        }
      ),
      this.jwtService.signAsync(
        { sub: userId, username },
        {
          secret: this.configService.get<string>("JWT_REFRESH_SECRET"),
          expiresIn: "7d",
        }
      ),
    ]);
    return { accessToken, refreshToken };
  }
}
