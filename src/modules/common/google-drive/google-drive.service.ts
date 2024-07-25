import { BadRequestException, Injectable } from '@nestjs/common';
import { google } from 'googleapis';
import { MemoryStoredFile } from 'nestjs-form-data';
import { PdfMimeType, PptxMimeType } from './google-drive.constants';
import {
  IUpload,
  uploadInput,
  uploadResponse
} from "../../upload/upload.interface";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class GoogleDriveService implements IUpload {
  private readonly driveConfig;
  constructor(
    private configService: ConfigService,
  ) {
    this.driveConfig = this.configService.get<object>('google.drive');
  }

  async authorize() {
    const jwtClient = new google.auth.JWT(
      this.driveConfig?.clientEmail,
      null,
      this.driveConfig?.privateKey,
      this.driveConfig?.scopes
    );
    await jwtClient.authorize();
    return jwtClient;
  }

  async multipleUpload(files: uploadInput[]): Promise<uploadResponse[]> {
    try {
      const jwtClient = await this.authorize();
      const drive = google.drive({ version: 'v3', auth: jwtClient });
      return Promise.all(
        files.map(async (input) => {
          let { file } = input;
          const mimeType = file.mimetype === PdfMimeType ? PdfMimeType : PptxMimeType;
          const uploaded = await drive.files.create({
            media: {
              mimeType,
              body: file.buffer,
            },
            fields: 'id,webViewLink,webContentLink',
          });
          await drive.permissions.create({
            fileId: uploaded.data.id,
            requestBody: {
              role: this.driveConfig?.permissionRole,
              type: this.driveConfig?.permissionType,
            },
          });
          const changedTypeOfFile = file as unknown as MemoryStoredFile;

          return { name: changedTypeOfFile?.originalName, extension: file.mimetype, path: uploaded.data.id };
        }),
      );
    } catch (err) {
      throw new BadRequestException('Upload file to Google drive failed');
    }
  }

  async upload(input: uploadInput) {
    //TODO
  }
}
