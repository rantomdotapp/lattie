import { NextFunction, Request, Response } from 'express';

import logger from '../../lib/logger';

export function middleware(request: Request, response: Response, next: NextFunction) {
  (request as any).requestTimestamp = new Date().getTime();

  next();
}

export function writeResponse(request: Request, response: Response, status: number, data: any) {
  const elapsed = new Date().getTime() - (request as any).requestTimestamp;

  logger.info('served api request', {
    service: 'api',
    method: request.method,
    path: request.url,
    status: status,
    elapsed: `${elapsed}ms`,
    ip: request.header('CF-Connecting-IP')
      ? request.header('CF-Connecting-IP')
      : `${request.socket.remoteFamily}:${request.socket.remoteAddress}`,
  });

  response.status(status).json(data);
}
