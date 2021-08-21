import { isNumber, isNil } from 'lodash';
import { Ride } from '../models/ride';

interface RideInput {
  start_lat: string;
  start_long: string;
  end_lat: string;
  end_long: string;
  rider_name: string;
  driver_name: string;
  driver_vehicle: string;
}

export const transformRequestBody = (input: RideInput): Ride => {
  const startLat = Number(input.start_lat);
  const startLong = Number(input.start_long);
  const endLat = Number(input.end_lat);
  const endLong = Number(input.end_long);
  const riderName = input.rider_name;
  const driverName = input.driver_name;
  const driverVehicle = input.driver_vehicle;
  return {
    startLat,
    startLong,
    endLat,
    endLong,
    riderName,
    driverName,
    driverVehicle
  };
};

export const validateLatLongInputType = (lat: unknown, long: unknown) => {
  if (!isNumber(lat) || !isNumber(long || isNil(lat) || isNil(long))) {
    return {
      error: true,
      errorDetail: {
        error_code: 'VALIDATION_ERROR',
        message: 'Latitude and longitude must be an number'
      }
    };
  }
  return {
    error: false
  };
};

export const validateStartLatLong = (startLat: any, startLong: any) => {
  if (startLat < -90 || startLat > 90 || startLong < -180 || startLong > 180) {
    return {
      error: true,
      errorDetail: {
        error_code: 'VALIDATION_ERROR',
        message:
          'Start latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively'
      }
    };
  }
  return {
    error: false
  };
};

export const validateEndLatLong = (endLat: any, endLong: any) => {
  if (endLat < -90 || endLat > 90 || endLong < -180 || endLong > 180) {
    return {
      error: true,
      errorDetail: {
        error_code: 'VALIDATION_ERROR',
        message:
          'End latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively'
      }
    };
  }
  return {
    error: false
  };
};

export enum StringFieldInput {
  RIDER_NAME,
  DRIVER_NAME,
  DRIVER_VEHICLE
}

export const validateStringField = (input: unknown, fieldInput: StringFieldInput) => {
  const errorByFieldInput = {
    [StringFieldInput.RIDER_NAME]: 'Rider name must be a non empty string',
    [StringFieldInput.DRIVER_NAME]: 'Driver name must be a non empty string',
    [StringFieldInput.DRIVER_VEHICLE]: 'Driver vehicle must be a non empty string'
  };

  if (typeof input !== 'string' || input.length < 1) {
    return {
      error: true,
      errorDetail: {
        error_code: 'VALIDATION_ERROR',
        message: errorByFieldInput[fieldInput]
      }
    };
  }
  return {
    error: false
  };
};

export const validateRideInput = (rideInput: RideInput) => {
  const validate = [
    validateLatLongInputType(rideInput.start_lat, rideInput.start_long),
    validateLatLongInputType(rideInput.end_lat, rideInput.end_long),
    validateStartLatLong(rideInput.start_lat, rideInput.start_long),
    validateEndLatLong(rideInput.end_lat, rideInput.end_long),
    validateStringField(rideInput.rider_name, StringFieldInput.RIDER_NAME),
    validateStringField(rideInput.driver_name, StringFieldInput.DRIVER_NAME),
    validateStringField(rideInput.driver_vehicle, StringFieldInput.DRIVER_VEHICLE)
  ];

  return validate.filter(item => item.error);
};
