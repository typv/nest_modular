import { Module } from '@nestjs/common';
import { GoogleDriveService } from './google-drive.service';
import { ConfigModule } from "@nestjs/config";
import googleConfiguration from "../../../config/google.config";

@Module({
  imports: [
    ConfigModule.forFeature(googleConfiguration)
  ],
  providers: [GoogleDriveService],
  exports: [GoogleDriveService],
})
export class GoogleDriveModule {}
