import { IsOptional, IsString, Matches } from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";

export class S3UploadBaseDto {
  @ApiProperty({ example: 'lecture_documents/[id]' })
  @Matches(/^[a-zA-Z0-9_/\-]+$/g)
  @IsString()
  @IsOptional()
  uploadPath: string;
}
