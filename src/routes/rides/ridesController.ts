import { Request, Response } from 'express';
import { Database } from 'sqlite3';

import { Ride } from '../../models/ride';
import { dbQuery, dbRun } from '../../utils/database';
import { transformRequestBody, validateRideInput } from '../../businessLogic/rides';

export const healthCheckController = (req: Request, res: Response) => res.send('Healthy');

export const getRideDetailController = (db: Database) => async (req: Request, res: Response) => {
  try {
    const rows = (await dbQuery(
      `SELECT * FROM Rides WHERE rideID='${req.params.id}'`,
      db
    )) as Ride[];

    if (rows.length === 0) {
      return res.send({
        error_code: 'RIDES_NOT_FOUND_ERROR',
        message: 'Could not find any rides'
      });
    }

    res.send(rows);
  } catch (e) {
    res.send({
      error_code: 'SERVER_ERROR',
      message: 'Unknown error'
    });
  }
};

export const getListRideController = (db: Database) => async (req: Request, res: Response) => {
  let limit: number = parseInt(req.query.limit as string);
  let page: number = parseInt(req.query.page as string);

  // TODO: Refactor conditonal for check the query parameter type

  if (!req.query.limit || !req.query.page) {
    try {
      const rows = (await dbQuery(`SELECT * FROM Rides`, db)) as Ride[];
      res.send(rows);
      if (rows.length === 0) {
        return res.send({
          error_code: 'RIDES_NOT_FOUND_ERROR',
          message: 'Could not find any rides'
        });
      }
    } catch (e) {
      res.send({
        error_code: 'SERVER_ERROR',
        message: 'Unknown error'
      });
    }

    return;
  }

  if (Number.isNaN(limit) || Number.isNaN(page)) {
    return res.send({
      error_code: 'SERVER_ERROR',
      message: 'Invalid query params'
    });
  }

  if (parseInt(req.query.limit as string) === 0) {
    limit = 50;
  }

  if (parseInt(req.query.page as string) === 0) {
    page = 1;
  }

  const offset = (page - 1) * limit;
  try {
    const rows = (await dbQuery(
      `SELECT * FROM Rides LIMIT ${limit} OFFSET ${offset}`,
      db
    )) as Ride[];
    if (rows.length === 0) {
      return res.send({
        error_code: 'RIDES_NOT_FOUND_ERROR',
        message: 'Could not find any rides'
      });
    }
    res.send(rows);
  } catch (e) {
    res.send({
      error_code: 'SERVER_ERROR',
      message: 'Unknown error'
    });
  }
};

export const createRideController = (db: Database) => async (req: Request, res: Response) => {
  const errors = validateRideInput(req.body);

  if (errors.length > 0) {
    const error = errors[0].errorDetail;
    return res.send(error);
  }

  const {
    startLat,
    startLong,
    endLat,
    endLong,
    riderName,
    driverName,
    driverVehicle
  } = transformRequestBody(req.body);

  const values = [startLat, startLong, endLat, endLong, riderName, driverName, driverVehicle];

  try {
    const rows = await dbRun(
      'INSERT INTO Rides(startLat, startLong, endLat, endLong, riderName, driverName, driverVehicle) VALUES (?, ?, ?, ?, ?, ?, ?)',
      db,
      values
    )('SELECT * FROM Rides WHERE rideID = ?');
    res.send(rows);
  } catch (e) {
    res.send({
      error_code: 'SERVER_ERROR',
      message: 'Unknown error'
    });
  }
};
