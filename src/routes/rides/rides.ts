import { Application } from 'express';
import { Database } from 'sqlite3';

import { healthCheckController, getRideDetailController } from './ridesController';

const rideRoutes = (app: Application, db: Database) => {
  app.get('/health', healthCheckController);
  app.get('/rides/:id', getRideDetailController(db));
};

export default rideRoutes;
