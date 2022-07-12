import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response, Request } from 'express';

@Injectable()
export class PagerMiddleware implements NestMiddleware {
  use(
    req: Request & { query: { limit: number; page: number } },
    res: Response,
    next: NextFunction,
  ) {
    const limit = +req.query.limit || 12;
    const page = +req.query.page || 1;

    req.query.limit = limit > 0 && limit < 13 ? limit : 12;
    req.query.page = page < 1 ? 1 : page;

    next();
  }
}
