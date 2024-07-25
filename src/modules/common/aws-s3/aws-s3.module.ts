import { Module } from '@nestjs/common';
import { AwsS3Service } from './aws-s3.service';
import s3Config from 'src/config/s3.config';
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [
    ConfigModule.forFeature(s3Config)
  ],
  providers: [AwsS3Service],
  exports: [AwsS3Service],
})
export class AwsS3Module {}
