import { expect } from 'chai';
import { Ride } from '../models/ride';

import {
  transformRequestBody,
  validateLatLongInputType,
  validateStartLatLong,
  validateEndLatLong,
  validateStringField,
  StringFieldInput,
  validateRideInput
} from './rides';

const buildRideInput = (override = {}) => ({
  start_lat: 40,
  start_long: 40,
  end_lat: 40,
  end_long: 40,
  rider_name: 'test',
  driver_name: 'test',
  driver_vehicle: 'test',
  ...override
});

describe('test ride business logic', () => {
  describe('transformRequestBody', () => {
    it('should transform body request to match db field', () => {
      const rideRequestBody = {
        start_lat: '40',
        start_long: '40',
        end_lat: '40',
        end_long: '40',
        rider_name: 'test',
        driver_name: 'test',
        driver_vehicle: 'test'
      };

      const actual = transformRequestBody(rideRequestBody);
      expect(actual).to.eql({
        startLat: 40,
        startLong: 40,
        endLat: 40,
        endLong: 40,
        riderName: 'test',
        driverName: 'test',
        driverVehicle: 'test'
      });
    });
  });

  describe('validateLatLongInputType', () => {
    it('should return error false if lat and long is valid', () => {
      const validStartLat = 40;
      const validStartLong = 40;
      const actual = validateLatLongInputType(validStartLat, validStartLong);
      expect(actual).to.eql({ error: false });
    });

    it('should return error true if lat and long is invalid', () => {
      const invalidCase = [
        {
          lat: '',
          long: 40
        },
        {
          lat: 40,
          long: ''
        },
        {
          lat: null,
          long: 40
        },
        {
          lat: false,
          long: 40
        },
        {
          lat: undefined,
          long: 30
        }
      ];
      invalidCase.forEach(item => {
        expect(validateLatLongInputType(item.lat, item.long)).to.eql({
          error: true,
          errorDetail: {
            error_code: 'VALIDATION_ERROR',
            message: 'Latitude and longitude must be an number'
          }
        });
      });
    });
  });

  describe('validateStartLatLong', () => {
    it('should return error false if startLat and startLong is valid', () => {
      const validCase = [
        {
          start_lat: 90,
          start_long: 90
        },
        {
          start_lat: 90,
          start_long: 90
        },
        {
          start_lat: 40,
          start_long: 170
        },
        {
          start_lat: 40,
          start_long: -170
        }
      ];

      validCase.forEach(item => {
        expect(validateStartLatLong(item.start_lat, item.start_long)).to.eql({
          error: false
        });
      });
    });

    it('should return error true if startLat and startLong is invalid', () => {
      const invalidCase = [
        {
          start_lat: -100,
          start_long: 90
        },
        {
          start_lat: 100,
          start_long: 90
        },
        {
          start_lat: 40,
          start_long: 190
        },
        {
          start_lat: 40,
          start_long: -190
        }
      ];

      invalidCase.forEach(item => {
        expect(validateStartLatLong(item.start_lat, item.start_long)).to.eql({
          error: true,
          errorDetail: {
            error_code: 'VALIDATION_ERROR',
            message:
              'Start latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively'
          }
        });
      });
    });
  });

  describe('validateEndLatLong', () => {
    it('should return error false if endLat and endLong is valid', () => {
      const validCase = [
        {
          end_lat: 90,
          end_long: 90
        },
        {
          end_lat: 90,
          end_long: 90
        },
        {
          end_lat: 40,
          end_long: 170
        },
        {
          end_lat: 40,
          end_long: -170
        }
      ];

      validCase.forEach(item => {
        expect(validateEndLatLong(item.end_lat, item.end_long)).to.eql({
          error: false
        });
      });
    });

    it('should return error true if endLat and endLong is invalid', () => {
      const invalidCase = [
        {
          end_lat: -100,
          end_long: 90
        },
        {
          end_lat: 100,
          end_long: 90
        },
        {
          end_lat: 40,
          end_long: 190
        },
        {
          end_lat: 40,
          end_long: -190
        }
      ];

      invalidCase.forEach(item => {
        expect(validateEndLatLong(item.end_lat, item.end_long)).to.eql({
          error: true,
          errorDetail: {
            error_code: 'VALIDATION_ERROR',
            message:
              'End latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively'
          }
        });
      });
    });
  });

  describe('validateStringField', () => {
    it('should return error false if input is valid', () => {
      const validCase = [
        {
          input: 'valid',
          fieldInput: StringFieldInput.RIDER_NAME
        },
        {
          input: 'valid',
          fieldInput: StringFieldInput.DRIVER_NAME
        },
        {
          input: 'valid',
          fieldInput: StringFieldInput.DRIVER_VEHICLE
        }
      ];

      validCase.forEach(item => {
        expect(validateStringField(item.input, item.fieldInput)).to.eql({ error: false });
      });
    });

    it('should return error true with specific message if input is invalid', () => {
      const invalidCase = [
        {
          input: '',
          fieldInput: StringFieldInput.RIDER_NAME,
          expectMessage: 'Rider name must be a non empty string'
        },
        {
          input: 1123,
          fieldInput: StringFieldInput.RIDER_NAME,
          expectMessage: 'Rider name must be a non empty string'
        },
        {
          input: false,
          fieldInput: StringFieldInput.RIDER_NAME,
          expectMessage: 'Rider name must be a non empty string'
        },
        {
          input: null,
          fieldInput: StringFieldInput.RIDER_NAME,
          expectMessage: 'Rider name must be a non empty string'
        },
        {
          input: undefined,
          fieldInput: StringFieldInput.RIDER_NAME,
          expectMessage: 'Rider name must be a non empty string'
        },
        {
          input: '',
          fieldInput: StringFieldInput.DRIVER_NAME,
          expectMessage: 'Driver name must be a non empty string'
        },
        {
          input: 2234,
          fieldInput: StringFieldInput.DRIVER_NAME,
          expectMessage: 'Driver name must be a non empty string'
        },
        {
          input: false,
          fieldInput: StringFieldInput.DRIVER_NAME,
          expectMessage: 'Driver name must be a non empty string'
        },
        {
          input: null,
          fieldInput: StringFieldInput.DRIVER_NAME,
          expectMessage: 'Driver name must be a non empty string'
        },
        {
          input: undefined,
          fieldInput: StringFieldInput.DRIVER_NAME,
          expectMessage: 'Driver name must be a non empty string'
        },
        {
          input: '',
          fieldInput: StringFieldInput.DRIVER_VEHICLE,
          expectMessage: 'Driver vehicle must be a non empty string'
        },
        {
          input: 2344,
          fieldInput: StringFieldInput.DRIVER_VEHICLE,
          expectMessage: 'Driver vehicle must be a non empty string'
        },
        {
          input: false,
          fieldInput: StringFieldInput.DRIVER_VEHICLE,
          expectMessage: 'Driver vehicle must be a non empty string'
        },
        {
          input: null,
          fieldInput: StringFieldInput.DRIVER_VEHICLE,
          expectMessage: 'Driver vehicle must be a non empty string'
        },
        {
          input: undefined,
          fieldInput: StringFieldInput.DRIVER_VEHICLE,
          expectMessage: 'Driver vehicle must be a non empty string'
        }
      ];

      invalidCase.forEach(item => {
        expect(validateStringField(item.input, item.fieldInput)).to.eql({
          error: true,
          errorDetail: {
            error_code: 'VALIDATION_ERROR',
            message: item.expectMessage
          }
        });
      });
    });
  });

  describe('validateRideInput', () => {
    it('should return empty array of error if input is valid', () => {
      const rideInput = buildRideInput();
      const actual = validateRideInput(rideInput as any);

      expect(actual).to.eql([]);
    });

    it('should return error if field in put is invalid', () => {
      const invalidCase = [
        {
          input: buildRideInput({ start_lat: null }),
          expectNumberOfError: 1
        },
        {
          input: buildRideInput({ start_lat: '' }),
          expectNumberOfError: 1
        },
        {
          input: buildRideInput({ start_long: '' }),
          expectNumberOfError: 1
        },
        {
          input: buildRideInput({ start_long: null }),
          expectNumberOfError: 1
        },
        {
          input: buildRideInput({ start_long: null, start_lat: '' }),
          expectNumberOfError: 1
        },
        {
          input: buildRideInput({ start_long: null, start_lat: -100 }),
          expectNumberOfError: 2
        },
        {
          input: buildRideInput({ end_lat: null }),
          expectNumberOfError: 1
        },
        {
          input: buildRideInput({ end_lat: '' }),
          expectNumberOfError: 1
        },
        {
          input: buildRideInput({ end_long: '' }),
          expectNumberOfError: 1
        },
        {
          input: buildRideInput({ end_long: null }),
          expectNumberOfError: 1
        },
        {
          input: buildRideInput({ end_long: null, end_lat: -100 }),
          expectNumberOfError: 2
        },
        {
          input: buildRideInput({ driver_name: null, end_lat: -100 }),
          expectNumberOfError: 2
        },
        {
          input: buildRideInput({ driver_vehicle: null, end_lat: -100 }),
          expectNumberOfError: 2
        },
        {
          input: buildRideInput({ rider_name: null, end_lat: -100 }),
          expectNumberOfError: 2
        }
      ];

      invalidCase.forEach(item => {
        //@ts-ignore
        expect(validateRideInput(item.input).length).to.eql(item.expectNumberOfError);
      });
    });
  });
});
