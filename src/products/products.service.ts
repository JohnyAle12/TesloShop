import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { validate as isUUID } from 'uuid'
import { Product, ProducImage } from './entities';
@Injectable()
export class ProductsService {
  private readonly logger = new Logger('ProductsService');

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProducImage)
    private readonly productImageRepository: Repository<ProducImage>,
    private readonly dataSource: DataSource
  ){}

  async create(createProductDto: CreateProductDto) {
    try {
      const { images = [], ...detailProduct } = createProductDto
      const product = this.productRepository.create({
        ...detailProduct,
        images: images.map( image => this.productImageRepository.create({ url: image }))
      })
      await this.productRepository.save(product)
      
      return {
        ...product,
        images
      }
    } catch (error) {
      this.handleDBException(error)
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto
    
    const products = await this.productRepository.find({
      take: limit,
      skip: offset,
      relations: {
        images: true
      }
    })

    return products.map( ({images, ...rest}) => ({
      ...rest,
      images: images.map( image => image.url )
    }))
  }

  private async findOne(term: string) {
    let product: Product;
    if (isUUID(term)) {
      product = await this.productRepository.findOneBy({ id:term })
    } else {
      const query = this.productRepository.createQueryBuilder('prod')
      product = await query.where('slug =:slug OR LOWER(title) LIKE :title', {
          slug: term.toLowerCase(),
          title: `%${ term.toLowerCase() }%`
        })
        .leftJoinAndSelect('prod.images', 'prodImages')
        .getOne()
    }

    if(!product) throw new NotFoundException(`Not found product with term ${term}`)

    return product
  }

  async findOnePlane(term: string) {
    const { images = [], ...product } = await this.findOne(term)
    return {
      ...product,
      images: images.map( image => image.url )
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto) {

    const { images, ...productUpdate } = updateProductDto
    const product = await this.productRepository.preload({id, ...productUpdate})

    if(!product) throw new NotFoundException(`Not found product with id ${id}`)

    const queryRunner = this.dataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()

    try {
      if(images){
        await queryRunner.manager.delete(ProducImage, { product: { id } })
        product.images = images.map( image => this.productImageRepository.create({ url: image }))
      }

      await queryRunner.manager.save(product)
      // await this.productRepository.save(product)

      await queryRunner.commitTransaction()

      return this.findOnePlane(id);
    } catch (error) {
      await queryRunner.rollbackTransaction()
      this.handleDBException(error)
    }
  }

  async remove(id: string) {
    const product = await this.findOne(id)
    await this.productRepository.remove(product)
    return product;
  }

  private handleDBException(error: any) {
    if(error.code === '23505')
      throw new BadRequestException(error.detail)

    this.logger.error(error)
    throw new InternalServerErrorException('Unexpected error, check server logs!!')
  }

  async deleteAllProducts(){
    try {
      const query = this.productRepository.createQueryBuilder('product')
      return await query.delete()
        .where({})
        .execute()

    } catch (error) {
      this.handleDBException(error)
    }
  }
}
