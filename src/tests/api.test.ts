import request from 'supertest';
import { expect } from 'chai';
import sqlite from 'sqlite3';
import startServer from '../app';
import buildSchemas from '../schemas';
const sqlite3 = sqlite.verbose();
const db = new sqlite3.Database(':memory:');

const app = startServer(db);

describe('API tests', () => {
  before(done => {
    db.serialize(
      // @ts-ignore
      (err: unknown): void => {
        if (err) {
          return done(err);
        }

        buildSchemas(db);

        done();
      }
    );
  });

  describe('GET /health', () => {
    it('should return health', done => {
      request(app)
        .get('/health')
        .expect('Content-Type', /text/)
        .expect(200, done);
    });
  });

  describe('GET /rides', () => {
    it('should call api rides succesful', done => {
      request(app)
        .get('/rides')
        .expect(200, done);
    });
  });

  describe('GET /rides/{id}', () => {
    it('should call api rides deatil succesful', done => {
      request(app)
        .get('/rides/1')
        .expect(200, done);
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

    it('should return error if start latitude and longitude not valid', done => {
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

      invalidStartLatLong.forEach(item => {
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

    it('should return error if end latitude and longitude not valid', done => {
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

      invalidEndLatLong.forEach(item => {
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

    it('should return error if ride name not valid', done => {
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

      invalidRideName.forEach(item => {
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

    it('should return error if driverName not valid', done => {
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

      invalidDriverName.forEach(item => {
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

    it('should return error if driverVehicle not valid', done => {
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

      invalidDriverVehicle.forEach(item => {
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

    it('should create ride success', done => {
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
