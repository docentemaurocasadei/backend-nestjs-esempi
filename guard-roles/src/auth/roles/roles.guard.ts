import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Role } from '../role.enum';
import { Reflector } from '@nestjs/core'; 
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const handler = context.getHandler();
  const controller = context.getClass();

  const roles = this.reflector.getAllAndOverride<Role[]>(
    ROLES_KEY,
    [handler, controller],
  );

    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    console.log('User roles:', user.roles);

    return roles.some(role => user.roles.includes(role));
  }
}
