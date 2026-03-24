import express from 'express';
import { createServer } from 'http';
import env from '../../configs/env';
import cors from 'cors';
import helmet from 'helmet';
import { httpLogger } from './middlewares/httpLogger';
import router from './routers/index';
import bodyParser from 'body-parser';
import { errorHandler } from './middlewares/errorHandler';
import logger from '../../utils/logger';

export default class RestApiTransport {
  static app = express();
  static httpServer = createServer(RestApiTransport.app);

  static registerAppsUsed(): void {
    RestApiTransport.app.use(express.json());
    RestApiTransport.app.use(cors({ origin: '*' }));
    RestApiTransport.app.use(helmet());
    RestApiTransport.app.use(httpLogger);
    RestApiTransport.app.use(bodyParser.urlencoded({ extended: true }));
    RestApiTransport.app.use('/api', router);
    RestApiTransport.app.use(errorHandler);
  }

  static boot() {
    RestApiTransport.registerAppsUsed();
    RestApiTransport.httpServer.listen(env.transport.http.port, () => {
      logger.info(`[RestApi Transport] Server started on port (${env.transport.http.port})`);
    });
    logger.info('[RestApi Transport] Booted');
  }
}
