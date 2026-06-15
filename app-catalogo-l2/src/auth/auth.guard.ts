import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    if (context.switchToHttp().getRequest().headers['authorization'].includes('Bearer mysecrettoken')) {
      return true;
    }
    return false;
  }
}
