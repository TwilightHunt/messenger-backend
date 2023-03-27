import { ApiProperty } from "@nestjs/swagger/dist/decorators";

export class CreateUserDto {
  @ApiProperty({ example: "catman@mail.com" })
  readonly email: string;
  @ApiProperty({ example: "cat12" })
  readonly username: string;
  @ApiProperty({ example: "pussword333" })
  readonly password: string;
}
