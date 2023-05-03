import { Injectable } from '@nestjs/common';
import { ProductsService } from '../products/products.service';
import { initialData } from './data/seed';
import { User } from 'src/auth/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeedService {

  constructor(
    private readonly productsService: ProductsService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ){}
  async runSeed() {
    this.deleteAll()
    const user = await this.insertNewUsers()
    await this.insertNewProducts(user)
    return 'Seed executed';
  }

  private async insertNewUsers(){
    const seedUsers = initialData.users

    const users: User[] = []

    seedUsers.forEach(user => {
      users.push(this.userRepository.create({
        ...user,
        password: bcrypt.hashSync(user.password, 10)
      }))
    })

    await this.userRepository.save(users)
    return users[0];
  }

  private async insertNewProducts(user: User){
    const producs = initialData.products

    const insertPromises = []

    producs.forEach(product => {
      insertPromises.push(this.productsService.create(product, user))
    })

    await Promise.all(insertPromises)
  }

  private async deleteAll(){
    await this.productsService.deleteAllProducts()
    const queryBuilder = this.userRepository.createQueryBuilder()
    await queryBuilder.delete().where({}).execute()
  }
}
