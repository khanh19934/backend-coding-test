import { Request, Response } from 'express';
import { Database } from 'sqlite3';

import { Ride } from '../../models/ride';
import { dbQuery, dbRun } from '../../utils/database';

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
  const startLatitude = Number(req.body.start_lat);
  const startLongitude = Number(req.body.start_long);
  const endLatitude = Number(req.body.end_lat);
  const endLongitude = Number(req.body.end_long);
  const riderName = req.body.rider_name;
  const driverName = req.body.driver_name;
  const driverVehicle = req.body.driver_vehicle;

  if (startLatitude < -90 || startLatitude > 90 || startLongitude < -180 || startLongitude > 180) {
    return res.send({
      error_code: 'VALIDATION_ERROR',
      message:
        'Start latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively'
    });
  }

  if (endLatitude < -90 || endLatitude > 90 || endLongitude < -180 || endLongitude > 180) {
    return res.send({
      error_code: 'VALIDATION_ERROR',
      message:
        'End latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively'
    });
  }

  if (typeof riderName !== 'string' || riderName.length < 1) {
    return res.send({
      error_code: 'VALIDATION_ERROR',
      message: 'Rider name must be a non empty string'
    });
  }

  if (typeof driverName !== 'string' || driverName.length < 1) {
    return res.send({
      error_code: 'VALIDATION_ERROR',
      message: 'Driver name must be a non empty string'
    });
  }

  if (typeof driverVehicle !== 'string' || driverVehicle.length < 1) {
    return res.send({
      error_code: 'VALIDATION_ERROR',
      message: 'Driver vehicle must be a non empty string'
    });
  }

  var values = [
    req.body.start_lat,
    req.body.start_long,
    req.body.end_lat,
    req.body.end_long,
    req.body.rider_name,
    req.body.driver_name,
    req.body.driver_vehicle
  ];

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
