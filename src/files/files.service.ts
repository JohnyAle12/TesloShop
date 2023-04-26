import { Injectable } from '@nestjs/common';

@Injectable()
export class FilesService {
  upload(file: Express.Multer.File) {
    return file;
  }
}
