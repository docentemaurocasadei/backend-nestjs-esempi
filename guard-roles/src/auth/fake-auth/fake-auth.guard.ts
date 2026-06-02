import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Role } from '../role.enum';

@Injectable()
export class FakeAuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    const roleKey = request.headers['x-role-key'];
    let roles = [Role.User];

    if (roleKey === 'admin-key') {
      roles = [Role.Admin];
    }

    if (roleKey === 'user-key') {
      roles = [Role.User];
    }

    request.user = {
      id: 1,
      username: 'testuser',
      roles,
    };

    return true;
  }
}