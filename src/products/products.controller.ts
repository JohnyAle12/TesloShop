import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query, UseGuards, Res, Headers, SetMetadata } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/auth/entities/user.entity';
import { RawHeaders } from 'src/common/decorators/raw-headers.decorator';
import { IncomingHttpHeaders } from 'http';
import { UserRoleGuard } from 'src/auth/guards/user-role/user-role.guard';
import { RoleProtected } from 'src/auth/decorators/role-protected.decorator';
import { ValidRoles } from 'src/auth/interfaces/valid-roles';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @Auth(ValidRoles.user)
  create(
    @Body() createProductDto: CreateProductDto,
    @GetUser() user: User
  ) {
    return this.productsService.create(createProductDto, user);
  }

  @Get()
  @UseGuards(AuthGuard())
  findAll(
    @Query() paginationDto:PaginationDto,
    @GetUser() user: User,
    @GetUser('email') userEmail: User,
    @RawHeaders() rawHeaders: string[],
    @Headers() headers: IncomingHttpHeaders
  ) {

    console.log({
      user,
      userEmail,
      rawHeaders,
      headers
    });
    
    return this.productsService.findAll(paginationDto);
  }

  @Get('private')
  // @SetMetadata('roles', ['admin', 'superuser'])
  @RoleProtected(ValidRoles.superuser, ValidRoles.admin)
  @UseGuards(AuthGuard(), UserRoleGuard)
  privateAccess(
    @GetUser() user: User,
  ) {
    return {
      user
    };
  }

  @Get('private2')
  @Auth(ValidRoles.superuser)
  privateAccessTwo(
    @GetUser() user: User,
  ) {
    return {
      user
    };
  }

  @Get(':term')
  findOne(@Param('term') term: string) {
    return this.productsService.findOnePlane(term);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.remove(id);
  }

}
