import {
  ArrayMaxSize, IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from "class-validator";

import { HasMimeType, IsFile, MaxFileSize, MemoryStoredFile } from "nestjs-form-data";
import { fileValidationConstant } from "../../../app/constants/file-validation.constant";
import { S3UploadBaseDto } from "./s3-upload-base.dto";

export class UploadImageDto extends S3UploadBaseDto {
  @ArrayMaxSize(10, {
    message: 'Up to 10 image per upload'
  })
  @IsFile({
    each: true,
    message: 'Each image must be a file'
  })
  @MaxFileSize(fileValidationConstant.IMAGE.MAX_SIZE_MB*1024*1024, {
    each: true,
    message: `Maximum file size of each image is ${ fileValidationConstant.IMAGE.MAX_SIZE_MB } MB`,
  })
  @HasMimeType(fileValidationConstant.IMAGE.ALLOW_TYPE_MIME, {
    each: true,
    message: `Each file must be of one of the types: ${fileValidationConstant.IMAGE.ALLOW_TYPE_MIME.toString()}`,
  })
  @IsNotEmpty()
  images: Express.Multer.File[];
}
