import { Controller, Get, Param, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter } from './helpers/fileFilter.helpers';
import { diskStorage } from 'multer';
import { fileNamer } from './helpers/fileNamer.helpers';
import { Response } from 'express';
import { Auth } from 'src/auth/decorators/auth.decorator';

@Controller('files')
@Auth()
export class FilesController {
  constructor(
    private readonly filesService: FilesService
  ) {}

  @Post('product')
  @UseInterceptors(FileInterceptor('file', {
    fileFilter: fileFilter,
    limits: { fieldSize: 1000 },
    storage: diskStorage({
      destination: './static/uploads',
      filename: fileNamer
    })
  }))
  uploadProductFiles(
    @UploadedFile() file: Express.Multer.File
  ) {
    return this.filesService.upload(file);
  }

  @Get('product/:image')
  findProductImage(
    @Res() response: Response,
    @Param('image') image: string
  ){
    //using @Res decorator we are using the express responses and we stop to use the nest framework
    //it can be dangerous because we break the nest life cycle, and function such as interceptors or restrictions from nest wont work
    const file = this.filesService.getImage(image)
    response.sendFile(file)
    // return { file }
  }
}
