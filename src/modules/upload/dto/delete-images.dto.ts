import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsString } from "class-validator";

export class DeleteImagesDto{
  @ApiProperty()
  @IsArray()
  @IsString()
  imagesUrl: string[]
}