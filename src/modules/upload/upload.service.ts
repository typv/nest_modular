import { BadRequestException, Inject, Injectable, Logger } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { I18nService } from 'nestjs-i18n';
import { BaseService } from '../base/base.service';
import { UploadFileDto } from './dto/upload-file.dto';
import { UploadImageDto } from './dto/upload-image.dto';
import { UploadVideoDto } from './dto/upload-video.dto';
import { IUpload, uploadInput, uploadResponse } from './upload.interface';
import { AwsS3Service } from "../common/aws-s3/aws-s3.service";
import { DeleteImagesDto } from "./dto/delete-images.dto";
import { StoragePlace } from "./upload.constant";

@Injectable()
export class UploadService extends BaseService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly trans: I18nService,
    @Inject('S3_UPLOAD') private s3UploadProvider: IUpload,
    @Inject('DRIVE_UPLOAD') private driveProvider: IUpload,
  ) {
    super();
  }

  async uploadImage(body: UploadImageDto) {
    let uploadedImages = [];
    const { images, uploadPath } = body;
    try {
      for (let file of images) {
        uploadedImages.push(this.s3UploadProvider.upload({ file, path: uploadPath }));
      }
      [...uploadedImages] = await Promise.all([...uploadedImages]);

      return this.responseOk(uploadedImages);
    } catch (err) {
      this.logger.error('UploadService.uploadImages: Failed to upload image', err);

      throw new BadRequestException(this.trans.t('messages.BAD_REQUEST', { args: { action: 'upload image' } }));
    }
  }

  async uploadVideo(body: UploadVideoDto) {
    let { file, uploadPath: bucketFolder, contentType } = body;

    // Upload to s3
    let s3Response;
    try {
      s3Response = await this.s3UploadProvider.upload({ file, path: bucketFolder, contentType });
    } catch (err) {
      this.logger.error('UploadService.uploadVideo: Failed to upload video.', err);

      throw new BadRequestException(this.trans.t('messages.BAD_REQUEST', { args: { action: 'upload video' } }));
    }

    return this.responseOk(s3Response);
  }

  async uploadFile(body: UploadFileDto) {
    // Upload audio/document file
    const { files, uploadPath, contentType } = body;
    let uploadedFiles;
    try {
      const storage = body?.storage ? Number(body.storage) : StoragePlace.S3;
      if (storage === StoragePlace.GOOGLE_DRIVE) {
        let input: uploadInput[] = files as unknown as uploadInput[];
        uploadedFiles = await this.driveProvider.multipleUpload(input);
      } else {
        const uploadFilePromises = files.map(async (file) => {
          return this.s3UploadProvider.upload({ file, path: uploadPath, contentType });
        });
        uploadedFiles = await Promise.all(uploadFilePromises);
      }

      return this.responseOk(uploadedFiles.map((file) => ({ ...file, storage })));
    } catch (err) {
      this.logger.error('UploadService.uploadFile: Failed to upload file', err);

      throw new BadRequestException(this.trans.t('messages.BAD_REQUEST', { args: { action: 'upload file' } }));
    }
  }
}
