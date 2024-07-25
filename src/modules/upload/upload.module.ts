import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { NestjsFormDataModule } from "nestjs-form-data";
import { AwsS3Module } from "../common/aws-s3/aws-s3.module";
import { AwsS3Service } from "../common/aws-s3/aws-s3.service";
import { GoogleDriveService } from "../common/google-drive/google-drive.service";

@Module({
  imports: [
    AwsS3Module,
    NestjsFormDataModule,
  ],
  controllers: [UploadController],
  providers: [
    UploadService,
    {
      provide: 'S3_UPLOAD',
      useClass: AwsS3Service,
    },
    {
      provide: 'DRIVE_UPLOAD',
      useClass: GoogleDriveService,
    },
  ],
  exports: [UploadService],
})
export class UploadModule {}
