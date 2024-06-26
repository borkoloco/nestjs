import { Injectable, NestMiddleware } from '@nestjs/common';
import { UsersService } from '../users.service';
import { Response, Request, NextFunction } from 'express';
import { User } from '../users.entity';

declare global {
  namespace Express {
    interface Request {
      currentUser?: User;
    }
  }
}
@Injectable()
export class CurrentUserMiddlware implements NestMiddleware {
  constructor(private usersService: UsersService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const { userId } = req.session || {};

    if (userId) {
      const user = await this.usersService.findOne(userId);
      req.currentUser = user;
    }
    next();
  }
}
