import { Injectable, NestMiddleware } from '@nestjs/common';
import { Response } from 'express';
import { TokenService } from 'modules/common/services/token';
import { AUTH } from 'settings';

@Injectable()
export class RenewTokenMiddleware implements NestMiddleware {
  constructor(private tokenService: TokenService) {}

  public async use(req: any, res: Response, next: Function) {
    if (req.method === 'OPTIONS' || !req.user) {
      return next();
    }

    const now = Math.floor(Date.now() / 1000) * 1;
    const diff = (<any>req.user).exp - now;

    if (diff <= AUTH.timeout * 0.6) {
      const token = await this.tokenService.renewAccessToken(req.user);
      res.setHeader('X-Token', token);
    }

    return next();
  }
}
