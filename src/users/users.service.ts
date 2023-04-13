import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { FilesService } from "src/files/files.service";
import { UserDto } from "./dto/user.dto";
import { User, UserDocument } from "./user.schema";

type ParamType = {
  username?: string;
  id?: string;
};

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

  async findByParam(query: ParamType): Promise<UserDocument> {
    const { username, id } = query;

    if (username) {
      return this.userModel.findOne({ username }).exec();
    }

    if (id) {
      return this.userModel.findById(id).exec();
    }

    throw new BadRequestException("Incorrect param");
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

  async search(query: any) {
    const result = await this.userModel
      .aggregate([
        {
          $search: {
            index: "users",
            autocomplete: {
              query: query,
              path: "username",
              fuzzy: {
                maxEdits: 2,
              },
            },
          },
        },
      ])
      .exec();

    return result;
  }
}
