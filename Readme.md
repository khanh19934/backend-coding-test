# Xendit Coding Exercise

The goal of these exercises are to assess your proficiency in software engineering that is related to the daily work that we do at Xendit. Please follow the instructions below to complete the assessment.

## Setup

1. Create a new repository in your own github profile named `backend-coding-test` and commit the contents of this folder
2. Ensure `node (>8.6 and <= 10)` and `npm` are installed
3. Run `npm install`
4. Run `npm test`
5. Run `npm start`
6. Hit the server to test health `curl localhost:8010/health` and expect a `200` response

## API Documentation

- This application is for create and get the information of ride.

1. API for get list of ride: `http://localhost:8010/rides` with method `GET`

- The response of this API

```
    [
        {
            "rideID": "string",
            "startLat": 0,
            "startLong": 0,
            "endLat": 0,
            "endLong": 0,
            "riderName": "string",
            "driverName": "string",
            "driverVehicle": "string",
            "created": "datetime"
        }
    ]
```

2. API for create ride: `http://localhost:8010/rides` with method `POST`

- The request body need to send to this API:

```
   {
        "start_lat": 0,
        "start_long": 0,
        "end_lat": 0,
        "end_long": 0,
        "rider_name": "string",
        "driver_name": "string",
        "driver_vehicle": "string"
    }
```

- The response of this API

```
    {
        "rideID": "string",
        "startLat": 0,
        "startLong": 0,
        "endLat": 0,
        "endLong": 0,
        "riderName": "string",
        "driverName": "string",
        "driverVehicle": "string",
        "created": "datetime"
    }
```

3. API for get detail of ride: `http://localhost:8010/rides/{id}` with method `GET` and parameter is `id` as rideID

- The param of this API is `id` as `string`
- The response of this API

```
    {
        "rideID": "string",
        "startLat": 0,
        "startLong": 0,
        "endLat": 0,
        "endLong": 0,
        "riderName": "string",
        "driverName": "string",
        "driverVehicle": "string",
        "created": "datetime"
    }
```

4. The general error will have schema like that

```
    {
        "error_code": "string",
        "message": "string"
    }
```

- For more information, you can run the application and open browser then enter that url to check more on swagger
  `http://localhost:8010/api-docs`
