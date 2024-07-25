import { BadRequestException, Inject, Injectable, Logger, StreamableFile } from '@nestjs/common';
import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
  HeadObjectCommand,
  DeleteObjectCommand
} from "@aws-sdk/client-s3";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { ConfigService } from "@nestjs/config";
import { Upload } from "@aws-sdk/lib-storage";
import { I18nService } from "nestjs-i18n";
import { constants } from "../../../app/constants/common.constant";
import { S3ClientConfig } from "@aws-sdk/client-s3/dist-types/S3Client";
import { Readable } from 'stream';
import slugify from "slugify";
import { IUpload, uploadInput, uploadResponse } from "../../upload/upload.interface";

@Injectable()
export class AwsS3Service implements IUpload {
  private client;
  private readonly awsConfig;

  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private configService: ConfigService,
    private readonly trans: I18nService,
  ) {
    this.awsConfig = this.configService.get<object>('s3');
    const awsConfig: S3ClientConfig = {
      region: this.awsConfig?.region,
    }
    const allowAccessKeyEnvs = [
      constants.APP_ENVIRONMENT.LOCAL,
      constants.APP_ENVIRONMENT.DEVELOPMENT,
      constants.APP_ENVIRONMENT.STAGING,
    ]
    if (allowAccessKeyEnvs.includes(process.env.APP_ENVIRONMENT)) {
      awsConfig.credentials = {
        accessKeyId: this.awsConfig?.accessKeyId,
        secretAccessKey: this.awsConfig?.secretAccessKey,
      }
    }
    this.client = new S3Client(awsConfig);
  }

  async upload(input: uploadInput): Promise<uploadResponse> {
    const { file, path, contentType } = input;
    const originalName = file['originalName'];
    const extension = originalName.split('.').pop();
    const slugOptions = {
      replacement: '-',
      remove: undefined,
      lower: true,
      strict: true,
      locale: 'en',
      trim: true
    }
    const nameWithoutExt = originalName.slice(0, -(extension.length + 1));
    const nameConverted = slugify(nameWithoutExt, slugOptions);
    const bucket = this.awsConfig?.bucket;
    const fileName = `${ nameConverted }-${ new Date().getTime() }`;
    const fileKey = path ? `${ path }/${ fileName }.${ extension }` : `${ fileName }.${ extension }`;

    const readableStream = new Readable();
    readableStream.push(file.buffer);
    readableStream.push(null);

    const upload = new Upload({
      client: this.client,
      params: {
        Bucket: bucket,
        Key: fileKey,
        Body: readableStream,
        ContentType: contentType,
      },
    });
    try {
      await upload.done();

      return {
        name: nameConverted,
        extension: extension,
        path: fileKey,
      };
    } catch (err) {
      this.logger.error('AwsS3Service.upload: ', err);

      throw new Error();
    }
  }

  async multipleUpload(input: uploadInput[]){
    // TODO
  }

  async remove(fileKey: string) {
    const bucket = this.awsConfig?.bucket;
    const params = { Bucket: bucket, Key: fileKey };
    const cmd = new DeleteObjectCommand(params);
    try {
      const response = await this.client.send(cmd);

      return response;
    } catch (err) {
      this.logger.error('AwsS3Service.delete: ', err);
      throw new Error();
    }
  }

  async checkFileExist(bucket: string, key: string): Promise<boolean> {
    const params = {
      Bucket: bucket,
      Key: key,
    };

    try {
      await this.client.send(new HeadObjectCommand(params));

      return true;
    } catch (error) {
      this.logger.error('AwsS3Service.checkFileExist: ', error);

      return false;
    }
  }
}

