import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FormDataRequest } from 'nestjs-form-data';
import { UploadFileDto } from './dto/upload-file.dto';
import { UploadImageDto } from './dto/upload-image.dto';
import { UploadVideoDto } from './dto/upload-video.dto';
import { UploadService } from './upload.service';
import { Public } from "../../app/decorators/public";

@ApiBearerAuth()
@ApiTags('Upload')
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @ApiOperation({ summary: 'Upload image files' })
  @Post('images')
  @FormDataRequest()
  async uploadImages(@Body() body: UploadImageDto) {
    return this.uploadService.uploadImage(body);
  }

  @ApiOperation({ summary: 'Upload video file' })
  @Post('video')
  @FormDataRequest()
  async uploadVideo(@Body() body: UploadVideoDto) {
    return this.uploadService.uploadVideo(body);
  }

  @ApiOperation({ summary: 'Upload audio, document files' })
  @Post('files')
  @FormDataRequest()
  async uploadFile(@Body() body: UploadFileDto) {
    return this.uploadService.uploadFile(body);
  }
}
