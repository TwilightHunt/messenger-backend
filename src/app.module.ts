import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigModule } from "@nestjs/config";
import { UsersModule } from "./users/users.module";
import { AuthModule } from "./auth/auth.module";
import { FilesModule } from "./files/files.module";
import { ChatsModule } from "./chats/chats.module";
import { GatewayModule } from "./gateway/gateway.module";

@Module({
  controllers: [],
  providers: [],
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.DB_URL, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    }),
    UsersModule,
    AuthModule,
    FilesModule,
    ChatsModule,
    GatewayModule,
  ],
})
export class AppModule {}
