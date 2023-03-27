import { Module } from "@nestjs/common";
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';

@Module({
    controllers: [],
    providers: [],
    imports: [
        ConfigModule.forRoot(),
        MongooseModule.forRoot(process.env.DB_URL, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
      }),
        UsersModule
    ],
})
export class AppModule {

}