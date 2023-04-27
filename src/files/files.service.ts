import { join } from 'path';
import { existsSync } from 'fs';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FilesService {
  constructor(
    private readonly configService: ConfigService
  ) {}

  upload(file: Express.Multer.File) {
    if(!file) throw new BadRequestException('Make sure that you select an image')

    const secureUrl = `${ this.configService.get('HOST_API') }:${ this.configService.get('PORT') }/api/v1/files/product/${ file.filename }` 

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
