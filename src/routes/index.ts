import { Application } from 'express';
import rideRoutes from './rides/rides';
import { Database } from 'sqlite3';

const routes = [rideRoutes];

const registerAPIRoutes = (app: Application, db: Database): void => {
  routes.forEach((routeRegister) => routeRegister(app, db));
};

export default registerAPIRoutes;
