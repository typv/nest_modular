import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { HasMimeType, IsFile, MaxFileSize } from 'nestjs-form-data';
import { S3UploadBaseDto } from './s3-upload-base.dto';
import { StoragePlace } from '../upload.constant';
import { fileValidationConstant } from "../../../app/constants/file-validation.constant";

export class UploadFileDto extends S3UploadBaseDto {
  @IsFile({
    each: true,
    message: 'Must be a file',
  })
  @MaxFileSize(fileValidationConstant.FILE.MAX_SIZE_MB * 1024 * 1024, {
    each: true,
    message: `Maximum file size of video is ${fileValidationConstant.FILE.MAX_SIZE_MB} MB`,
  })
  @HasMimeType(fileValidationConstant.FILE.ALLOW_TYPE_MIME, {
    each: true,
    message: `File must be of one of the types: ${fileValidationConstant.FILE.ALLOW_TYPE_MIME.toString()}`,
  })
  @IsNotEmpty()
  files: Express.Multer.File[];

  @ApiProperty({ example: 'application/octet-stream' })
  @IsString()
  @IsOptional()
  contentType: string = 'application/octet-stream';

  @ApiPropertyOptional({
    enum: StoragePlace
  })
  @IsString()
  @IsOptional()
  storage?: StoragePlace
}
