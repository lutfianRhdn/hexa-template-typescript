import { Request, Response, NextFunction } from 'express';
import logger from '../../../utils/logger';

export const httpLogger = (req: Request, res: Response, next: NextFunction) => {
    const startTime = Date.now();
    logger.info('Incoming Request', { method: req.method, url: req.url, path: req.path, ip: req.ip, userAgent: req.get('user-agent') });

    const originalSend = res.send;
    res.send = function (data): Response {
        res.send = originalSend;
        const responseTime = Date.now() - startTime;
        const level = res.statusCode >= 400 ? 'warn' : 'info';
        logger.log(level, 'Outgoing Response', { method: req.method, url: req.url, statusCode: res.statusCode, responseTime: `${responseTime}ms` });
        return originalSend.call(this, data);
    };
    next();
};
