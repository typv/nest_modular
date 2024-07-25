import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { S3UploadBaseDto } from './s3-upload-base.dto';

export class UploadedFileDto extends S3UploadBaseDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  extension: string;

  @IsString()
  @IsNotEmpty()
  path: string;

  @IsString()
  @IsOptional()
  oldExtension?: string;
}
