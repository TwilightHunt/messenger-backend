import { Injectable } from '@nestjs/common';
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateUserDto } from './dto/create-user.dto';
import { User, UserDocument } from './user.schema';

@Injectable()
export class UsersService {

    constructor(@InjectModel(User.name) private UserModel: Model<UserDocument>) {}

    async create(dto: CreateUserDto): Promise<User> {
        const newUser = new this.UserModel(dto);
        return newUser.save();
    }
}
