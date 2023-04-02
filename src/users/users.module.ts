import { Module, forwardRef } from "@nestjs/common";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "./user.schema";
import { AuthModule } from "src/auth/auth.module";
import { FilesModule } from "src/files/files.module";

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    forwardRef(() => AuthModule),
    FilesModule,
  ],
  exports: [UsersService],
})
export class UsersModule {}
