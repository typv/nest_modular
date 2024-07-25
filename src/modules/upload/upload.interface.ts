import { Injectable } from "@nestjs/common";

export interface uploadInput {
  file: Express.Multer.File,
  path?: string,
  contentType?: string,
}

export interface uploadResponse {
  name: string,
  path: string,
  extension: string,
}


@Injectable()
export abstract class IUpload {
  abstract upload(input: uploadInput): Promise<uploadResponse>|Promise<void>;
  abstract multipleUpload(input: uploadInput[]): Promise<uploadResponse[]>|Promise<void>;
}