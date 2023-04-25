import { Injectable } from '@nestjs/common';
import { ProductsService } from '../products/products.service';
import { initialData } from './data/seed';

@Injectable()
export class SeedService {

  constructor(
    private readonly productsService: ProductsService
  ){}
  async runSeed() {
    await this.insertNewProducts()
    return 'Seed executed';
  }

  private async insertNewProducts(){
    await this.productsService.deleteAllProducts()
    
    const producs = initialData.products

    const insertPromises = []

    producs.forEach(product => {
      insertPromises.push(this.productsService.create(product))
    })

    await Promise.all(insertPromises)
  }
}
