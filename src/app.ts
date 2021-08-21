import { Application } from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../swagger.json';
import registerRoutes from './routes';
import { Database } from 'sqlite3';

const startServer = (app: Application, db: Database) => {
  registerRoutes(app, db);

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  return app;
};

export default startServer;
