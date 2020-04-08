import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';

import { enTokenType, TokenService } from '../services/token';

@Injectable()
export class BindUserMiddleware implements NestMiddleware {
  constructor(private tokenService: TokenService) {}

  public async use(req: Request, res: Response, next: Function) {
    const accessToken = req.get('Authorization');

    if (!accessToken) {
      return next();
    }

    try {
      (req as any).user = await this.tokenService.verify(accessToken.split(' ')[1], enTokenType.accessToken);
    } catch (err) {}

    next();
  }
}
