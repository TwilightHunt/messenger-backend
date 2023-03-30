import { ApiProperty } from "@nestjs/swagger/dist/decorators";
import { IsString, Length } from "class-validator";
import { IsEmail } from "class-validator";

export class CreateUserDto {
  @ApiProperty({ example: "catman@mail.com" })
  @IsString({ message: "String expected" })
  @IsEmail({}, { message: "Incorrect email" })
  readonly email: string;

  @ApiProperty({ example: "cat12" })
  @IsString({ message: "String expected" })
  @Length(3, 30, { message: "Max lenght - 30, min - 3" })
  readonly username: string;

  @ApiProperty({ example: "pussword333" })
  @IsString({ message: "String expected" })
  @Length(8, undefined, { message: "Password must contain at least 8 symbols" })
  readonly password: string;
}
