import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { JwtSetUserInterface } from 'src/interface';

@Injectable()
export class permissionGuard implements CanActivate {
  private checkPermission;
  constructor(permission: string) {
    this.checkPermission = permission;
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const userDataFromReq = (request as Request & { user: JwtSetUserInterface })
      .user;
    if (userDataFromReq.role === 'admin') {
      return true;
    }
    if (!userDataFromReq.permissions.includes(this.checkPermission))
      throw new ForbiddenException(
        'You Have Not To Permission To Access This Api',
      );

    return true;
  }
}
