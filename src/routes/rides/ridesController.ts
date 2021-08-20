import { Request, Response } from 'express';
import { Database } from 'sqlite3';

import { Ride } from '../../models';
import { dbQuery } from '../../utils/database';

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
