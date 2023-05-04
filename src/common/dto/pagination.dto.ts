import { ApiProperty } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { IsOptional, IsPositive, Min } from "class-validator"

export class PaginationDto{
    
    @ApiProperty({
        default: 10,
        description: 'Limit of row per page'
    })
    @IsPositive()
    @IsOptional()
    @Type(() => Number) // enableImplicitConversion: true its the same if we put this on the useGlobalPipes ValidationPipe
    limit?: number

    @ApiProperty({
        default: 0,
        description: 'Limit of row to skip'
    })
    @IsPositive()
    @IsOptional()
    @Min(0)
    @Type(() => Number)
    offset?: number
}