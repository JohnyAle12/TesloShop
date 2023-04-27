import { Request } from "express";
import { v4 as uuid } from 'uuid'

export const fileNamer = (
    request: Request,
    file: Express.Multer.File,
    callback: Function
) => {
    const ext = file.mimetype.split('/')[1]
    const name = `${ uuid() }.${ ext }`
    callback(null, name)
}