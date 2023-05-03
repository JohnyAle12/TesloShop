import { Reflector } from '@nestjs/core';
import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class UserRoleGuard implements CanActivate {

  constructor(
    private readonly reflector: Reflector
  ){}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    const roles: string[] = this.reflector.get('roles', context.getHandler())

    if(!roles) return true

    const request = context.switchToHttp().getRequest()
    const user = request.user as User

    if(!user)
        throw new BadRequestException('User not found')
    
    for (const role of user.roles) {
      if(roles.includes(role)) return true
    }

    throw new ForbiddenException(`The user ${user.name} doesn't have a valid role, nedds a admin role`)
  }
}
