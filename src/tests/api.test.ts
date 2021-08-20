import request from 'supertest';
import { expect } from 'chai';
import sqlite from 'sqlite3';
import express from 'express';
import startServer from '../app';
import buildSchemas from '../schemas';
const sqlite3 = sqlite.verbose();
const db = new sqlite3.Database(':memory:');

const expressApp = express();
const app = startServer(expressApp, db);

describe('API tests', () => {
  before((done) => {
    db.serialize(
      // @ts-ignore
      async (err: unknown): void => {
        if (err) {
          return done(err);
        }

        buildSchemas(db);

        const testData = {
          rider_name: 'riderName',
          driver_name: 'driverName',
          driver_vehicle: 'drvierVehicle',
          start_lat: 40,
          start_long: -100,
          end_lat: 30,
          end_long: 100
        };

        const values = [
          testData.start_lat,
          testData.start_long,
          testData.end_lat,
          testData.end_long,
          testData.rider_name,
          testData.driver_name,
          testData.driver_vehicle
        ];
        const promise = [];
        for (var i = 0; i < 50; i++) {
          promise.push(
            db.run(
              'INSERT INTO Rides(startLat, startLong, endLat, endLong, riderName, driverName, driverVehicle) VALUES (?, ?, ?, ?, ?, ?, ?)',
              values
            )
          );
        }

        await Promise.all(promise);

        done();
      }
    );
  });

  describe('GET /health', () => {
    it('should return health', (done) => {
      request(app).get('/health').expect('Content-Type', /text/).expect(200, done);
    });
  });

  describe('GET /rides', () => {
    it('should call api rides succesful', (done) => {
      request(app).get('/rides').expect(200, done);
    });

    it('should return all record if not provide pagination query', (done) => {
      request(app)
        .get('/rides')
        .expect(200)
        .end((err, res) => {
          if (err) done(err);
          expect(res.body.length).to.eql(50);
          done();
        });
    });

    it('should return correctly with pagination query', (done) => {
      const querySetup = [
        {
          limit: 20,
          page: 2,
          expectNumberItem: 20
        },

        {
          limit: 50,
          page: 1,
          expectNumberItem: 50
        },
        {
          limit: 15,
          page: 4,
          expectNumberItem: 5
        },
        {
          limit: 0,
          page: 0,
          expectNumberItem: 50
        },
        {
          limit: null,
          page: null,
          expectNumberItem: 50
        },
        {
          limit: undefined,
          page: undefined,
          expectNumberItem: 50
        }
      ];

      querySetup.forEach((item) => {
        request(app)
          .get('/rides')
          .query({ limit: item.limit, page: item.page })
          .expect(200)
          .end((err, res) => {
            expect(res.body.length).to.eql(item.expectNumberItem);
          });
      });

      done();
    });

    it('should return error if provide invalid pagination query', (done) => {
      const querySetup = [
        {
          limit: 'asd',
          page: 'asd'
        },
        {
          limit: true,
          page: false
        }
      ];

      querySetup.forEach((item) => {
        request(app)
          .get('/rides')
          .query({ limit: item.limit, page: item.page })
          .expect(200)
          .end((err, res) => {
            expect(res.body).to.eql({
              error_code: 'SERVER_ERROR',
              message: 'Invalid query params'
            });
            // expect(true).to.eql(true);
          });
      });

      done();
    });
  });

  describe('GET /rides/{id}', () => {
    it('should call api rides detail succesful', (done) => {
      request(app).get('/rides/1').expect(200, done);
    });
  });

  describe('POST /rides', () => {
    const payload = {
      rider_name: 'riderName',
      driver_name: 'driverName',
      driver_vehicle: 'drvierVehicle',
      start_lat: 40,
      start_long: -100,
      end_lat: 30,
      end_long: 100
    };

    it('should return error if start latitude and longitude not valid', (done) => {
      const invalidStartLatLong = [
        {
          start_lat: -100,
          start_long: 90,
          end_lat: 40,
          end_long: 100
        },
        {
          start_lat: 100,
          start_long: 90,
          end_lat: 40,
          end_long: 100
        },
        {
          start_lat: 40,
          start_long: 190,
          end_lat: 40,
          end_long: 100
        },
        {
          start_lat: 40,
          start_long: -190,
          end_lat: 40,
          end_long: 100
        }
      ];

      invalidStartLatLong.forEach((item) => {
        request(app)
          .post('/rides')
          .send({ ...payload, ...item })
          .expect(200)
          .end((err, res) => {
            expect(res.body).to.eql({
              error_code: 'VALIDATION_ERROR',
              message:
                'Start latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively'
            });
          });
      });

      done();
    });

    it('should return error if end latitude and longitude not valid', (done) => {
      const invalidEndLatLong = [
        {
          start_lat: 40,
          start_long: 90,
          end_lat: -100,
          end_long: 100
        },
        {
          start_lat: 40,
          start_long: 90,
          end_lat: 100,
          end_long: 100
        },
        {
          start_lat: 40,
          start_long: 90,
          end_lat: 40,
          end_long: -190
        },
        {
          start_lat: 40,
          start_long: 90,
          end_lat: 80,
          end_long: 190
        }
      ];

      invalidEndLatLong.forEach((item) => {
        request(app)
          .post('/rides')
          .send({ ...payload, ...item })
          .expect(200)
          .end((err, res) => {
            expect(res.body).to.eql({
              error_code: 'VALIDATION_ERROR',
              message:
                'End latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively'
            });
          });
      });

      done();
    });

    it('should return error if ride name not valid', (done) => {
      const invalidRideName = [
        {
          rider_name: null
        },
        {
          rider_name: undefined
        },
        {
          rider_name: false
        },
        {
          rider_name: 12
        },
        {
          rider_name: ''
        }
      ];

      invalidRideName.forEach((item) => {
        request(app)
          .post('/rides')
          .send({ ...payload, ...item })
          .expect(200)
          .end((err, res) => {
            expect(res.body).to.eql({
              error_code: 'VALIDATION_ERROR',
              message: 'Rider name must be a non empty string'
            });
          });
      });

      done();
    });

    it('should return error if driverName not valid', (done) => {
      const invalidDriverName = [
        {
          driver_name: null
        },
        {
          driver_name: undefined
        },
        {
          driver_name: false
        },
        {
          driver_name: 12
        },
        {
          driver_name: ''
        }
      ];

      invalidDriverName.forEach((item) => {
        request(app)
          .post('/rides')
          .send({ ...payload, ...item })
          .expect(200)
          .end((err, res) => {
            expect(res.body).to.eql({
              error_code: 'VALIDATION_ERROR',
              message: 'Driver name must be a non empty string'
            });
          });
      });

      done();
    });

    it('should return error if driverVehicle not valid', (done) => {
      const invalidDriverVehicle = [
        {
          driver_vehicle: null
        },
        {
          driver_vehicle: undefined
        },
        {
          driver_vehicle: false
        },
        {
          driver_vehicle: 12
        },
        {
          driver_vehicle: ''
        }
      ];

      invalidDriverVehicle.forEach((item) => {
        request(app)
          .post('/rides')
          .send({ ...payload, ...item })
          .expect(200)
          .end((err, res) => {
            expect(res.body).to.eql({
              error_code: 'VALIDATION_ERROR',
              message: 'Driver vehicle must be a non empty string'
            });
          });
      });

      done();
    });

    it('should create ride success', (done) => {
      request(app)
        .post('/rides')
        .send(payload)
        .expect(200)
        .end((err, res) => {
          expect(res.body).not.to.eql({
            error_code: 'VALIDATION_ERROR',
            message: 'Driver vehicle must be a non empty string'
          });
          done();
        });
    });
  });
});
