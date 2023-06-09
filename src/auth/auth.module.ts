import { Module, forwardRef } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { UsersModule } from "src/users/users.module";
import { AccessTokenStrategy } from "./accessToken.strategy";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { RefreshTokenStrategy } from "./refreshToken.strategy";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "src/users/user.schema";

@Module({
  imports: [
    forwardRef(() => UsersModule),
    JwtModule.register({}),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [AuthController],
  providers: [AuthService, AccessTokenStrategy, RefreshTokenStrategy],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
