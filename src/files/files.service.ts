import { join } from 'path';
import { existsSync } from 'fs';
import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class FilesService {
  upload(file: Express.Multer.File) {
    if(!file) throw new BadRequestException('Make sure that you select an image')


    const secureUrl = file.filename

    return {
      secureUrl
    };
  }

  getImage(image: string){
    const path = join( __dirname, '../../static/uploads', image )
    if(!existsSync(path)) throw new BadRequestException(`Image ${image} not found`)

    return path
  }
}
