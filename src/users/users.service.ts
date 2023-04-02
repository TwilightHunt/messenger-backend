import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { FilesService } from "src/files/files.service";
import { UserDto } from "./dto/user.dto";
import { User, UserDocument } from "./user.schema";

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private fileService: FilesService
  ) {}

  async create(dto: UserDto): Promise<UserDocument> {
    const newUser = new this.userModel(dto);
    return newUser.save();
  }

  async findByUsername(username: string): Promise<UserDocument> {
    return this.userModel.findOne({ username }).exec();
  }

  async findByEmail(email: string): Promise<UserDocument> {
    return this.userModel.findOne({ email }).exec();
  }

  async update(data): Promise<UserDocument> {
    const { user, profileImage } = data;

    const userInDB = await this.userModel.findById(user._id);
    if (!userInDB) {
      throw new BadRequestException("Cannot find user");
    }

    let fileName = userInDB.profileImage;

    if (profileImage) {
      fileName = await this.fileService.createFile(profileImage);
    }

    const updatedUser = await this.userModel.findByIdAndUpdate(
      userInDB._id,
      {
        ...user,
        password: userInDB.password,
        profileImage: fileName,
      },
      {
        new: true,
      }
    );

    return updatedUser;
  }
}
