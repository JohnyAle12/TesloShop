import { Injectable } from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ){}

  async register(registerUserDto: RegisterUserDto) {
    try {
      const user = this.userRepository.create(registerUserDto)
      await this.userRepository.save(user)

      return user
    } catch (error) {
      console.log(error);
    }
  }
}
