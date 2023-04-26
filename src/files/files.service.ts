import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class FilesService {
  upload(file: Express.Multer.File) {
    if(!file) throw new BadRequestException('Make sure that you select an image')
    return file;
  }
}
