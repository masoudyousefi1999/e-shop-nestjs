import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { User } from 'src/user/entity/user.entity';
import { Role } from 'src/user/user-role.enum';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(contex: ExecutionContext): boolean {
    const user: User = contex.switchToHttp().getRequest().user;
    if (user.role === Role.ADMIN) {
      return true;
    }
    throw new ForbiddenException('only admin can accsess');
  }
}
