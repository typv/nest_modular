import { IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';
import { HasMimeType, IsFile, MaxFileSize } from 'nestjs-form-data';
import { fileValidationConstant } from '../../../app/constants/file-validation.constant';
import { S3UploadBaseDto } from './s3-upload-base.dto';

export class UploadVideoDto extends S3UploadBaseDto {
  @IsFile({
    message: 'Video must be a file',
  })
  @MaxFileSize(fileValidationConstant.VIDEO.MAX_SIZE_MB * 1024 * 1024, {
    message: `Maximum file size of video is ${fileValidationConstant.VIDEO.MAX_SIZE_MB} MB`,
  })
  @HasMimeType(fileValidationConstant.VIDEO.ALLOW_TYPE_MIME, {
    message: `File must be of one of the types: ${fileValidationConstant.VIDEO.ALLOW_TYPE_MIME.toString()}`,
  })
  @IsNotEmpty()
  file: Express.Multer.File;

  @IsString()
  @IsOptional()
  contentType: string = 'video/mp4';
}
