import { IsNumber, IsString, MinLength } from "class-validator"

export class MessageDto{
    @IsNumber()
    id: number

    @IsString()
    @MinLength(3)
    message: string
}