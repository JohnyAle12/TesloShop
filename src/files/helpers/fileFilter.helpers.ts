import { BadRequestException } from "@nestjs/common";
import { Request } from "express";

export const fileFilter = (
    request: Request,
    file: Express.Multer.File,
    callback: Function
) => {
    const ext = file.mimetype.split('/')[1]
    const validExt = ['jpg', 'png']

    if(!validExt.includes(ext)) return callback(new BadRequestException(`File extension ${ext} is not allowed`), false)
    
    callback(null, true)
}