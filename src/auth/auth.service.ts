import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt'
import { LoginUserDto } from './dto/login-user.dto';
import { JwtPayload } from './interfaces/jwt.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService
  ){}

  async register(registerUserDto: RegisterUserDto) {
    try {
      const {password, ...userData} = registerUserDto

      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10)
      })
      await this.userRepository.save(user)
      delete user.password

      return {
        ...user,
        token: this.getJwtToken({ id: user.id })
      }
    } catch (error) {
      this.handleDBException(error)
    }
  }

  async login({email, password}: LoginUserDto){
    const user = await this.userRepository.findOne({
      where: {email},
      select: {email: true, password: true, id: true}
    })

    if(!user)
      throw new UnauthorizedException('The credentials are not valid (email)')

    if(!bcrypt.compareSync(password, user.password))
      throw new UnauthorizedException('The credentials are not valid (passwod)')

    return {
      ...user,
      token: this.getJwtToken({ id: user.id })
    }
  }

  checkAuthStatus(user: User){
    const {roles, isActive, ...userData} = user
    return {
      ...userData,
      token: this.getJwtToken({ id: user.id })
    }
  }

  private getJwtToken( payload: JwtPayload){
    return this.jwtService.sign(payload)
  }

  private handleDBException(error: any): never {
    if(error.code === '23505')
      throw new BadRequestException(error.detail)

    throw new InternalServerErrorException('Unexpected error, check server logs!!')
  }
}
