import { Application } from 'express';
import { Database } from 'sqlite3';
import bodyParser from 'body-parser';

import {
  healthCheckController,
  getRideDetailController,
  getListRideController,
  createRideController
} from './ridesController';

const jsonParser = bodyParser.json();

const rideRoutes = (app: Application, db: Database) => {
  app.get('/health', healthCheckController);
  app.get('/rides/:id', getRideDetailController(db));
  app.get('/rides', getListRideController(db));
  app.post('/rides', jsonParser, createRideController(db));
};

export default rideRoutes;
