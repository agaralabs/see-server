# Stayzilla Experimentation Engine
### Creating an experiment

**Request:**
```sh
curl -i \
    -X POST \
    -H "Content-type: application/json" \
    -d '{
        "experiment": {
            "name": "Secure checkout page",
            "exposure_percent": 5.0
        }
    }' \
    "http://see.com/experiments"
```

**Response:**
```
HTTP/1.1 201 Created
Content-Type: application/json

{
  "data": {
    "experiment": {
      "id": 7,
      "name": "Checkout page",
      "version": 1,
      "exposure_percent": 5,
      "is_active": false,
      "is_usr_participating": false,
      "usr_variation": null,
      "is_deleted": 0,
      "create_time": 1478739059000,
      "update_time": 0,
      "variations": [],
      "metric_name": ""
    }
  }
}
```

### Get all experiments

**Request:**
```sh
curl -i "http://see.com/experiments"
```

**Response:**
```
HTTP/1.1 200 OK
Content-Type: application/json

{
  "data": {
    "experiments": [
        // ...
    ]
  }
}
```

### Delete experiment

**Request:**
```sh
curl -i \
    -X DELETE \
    -H "Content-type: application/json" \
    "http://see.com/experiments/7"
```

**Response:**
```
HTTP/1.1 200 OK
Content-Type: application/json

{
  "data": {
    "experiment": {
      "id": 7,
      "name": "Secure msg on checkout page",
      "version": 2,
      "exposure_percent": 11,
      "is_active": true,
      "is_usr_participating": false,
      "usr_variation": null,
      "is_deleted": 1,
      "create_time": 1478738270000,
      "update_time": 1478738985000,
      "variations": [],
      "metric_name": ""
    }
  }
}
```


### Update experiment

It is possible to update the name, exposure percentage and state of
an experiment.

**Request:**
```sh
curl -i \
    -X PUT \
    -H "Content-type: application/json" \
    -d '{
        "experiment": {
            "name": "Secure msg on checkout page",
            "exposure_percent": 10.5,
            "is_active": true,
            "metric_name": "pay_btn_click"
        }
    }' \
    "http://see.com/experiments/7"
```

**Response:**
```
HTTP/1.1 201 Created
Content-Type: application/json

{
  "data": {
    "experiment": {
      "id": 7,
      "name": "Secure msg on checkout page",
      "version": 2,
      "exposure_percent": 11,
      "is_active": true,
      "is_usr_participating": false,
      "is_deleted": 0,
      "usr_variation": null,
      "create_time": 1478738270000,
      "create_time": 1478738270000,
      "update_time": 1478738985000,
      "variations": [],
      "metric_name": "pay_btn_click"
    }
  }
}
```

### Add variation to experiment

**Request:**
```sh
curl -i \
    -X POST \
    -H "Content-type: application/json" \
    -d '{
        "variation": {
            "name": "CONTROL",
            "split_percent": 50.0
        }
    }' \
    "http://see.com/experiments/7/variations"
```

**Response:**
```
HTTP/1.1 201 Created
Content-Type: application/json

{
  "data": {
    "variation": {
      "id": 5,
      "experiment_id": 7,
      "name": "CONTROL",
      "split_percent": 50,
      "is_deleted": 0,
      "create_time": 1478739343000,
      "update_time": 0
    }
  }
}
```

### Get all variations for an experiment

**Request:**
```sh
curl -i "http://see.com/experiments/7/variations"
```

**Response:**
```
HTTP/1.1 200 OK
Content-Type: application/json

{
  "data": {
    "variations": [
      {
        "id": 5,
        "experiment_id": 7,
        "name": "CONTROL",
        "split_percent": 50,
        "is_deleted": 0,
        "create_time": 1478739343000,
        "update_time": 0
      },
      {
        "id": 6,
        "experiment_id": 7,
        "name": "TREATMENT",
        "split_percent": 50,
        "is_deleted": 0,
        "create_time": 1478739473000,
        "update_time": 0
      }
    ]
  }
}
```

### Delete variation

**Request:**
```sh
curl -i \
    -X DELETE \
    -H "Content-type: application/json" \
    "http://see.com/experiments/7/variations/6"
```

**Response:**
```
HTTP/1.1 200 OK
Content-Type: application/json

{
  "data": {
    "variation": {
      "id": 6,
      "experiment_id": 7,
      "name": "Secure payment msg",
      "split_percent": 50,
      "is_deleted": 1,
      "create_time": 1478739473000,
      "update_time": 1478739616000
    }
  }
}
```

### Update variation 

**Request:**
```sh
curl -i \
    -X PUT \
    -H "Content-type: application/json" \
    -d '{
        "variation": {
            "name": "Secure payment msg",
            "split_percent": 50.0
        }
    }' \
    "http://see.com/experiments/7/variations/6"
```

**Response:**
```
HTTP/1.1 200 OK
Content-Type: application/json

{
  "data": {
    "variation": {
      "id": 6,
      "experiment_id": 7,
      "name": "Secure payment msg",
      "split_percent": 50,
      "is_deleted": 0,
      "create_time": 1478739473000,
      "update_time": 1478739616000
    }
  }
}
```

### Upgrade experiment version

**Request:**
```sh
curl -i -X POST "http://see.com/experiments/7/version"
```

**Response:**
```
HTTP/1.1 201 Created
Content-Type: application/json

{
  "data": {
    "version": 8
  }
}
```

### Get current experiment version

**Request:**
```sh
curl -i "http://see.com/experiments/7/version"
```

**Response:**
```
HTTP/1.1 200 OK
Content-Type: application/json

{
  "data": {
    "version": 8
  }
}
```

### Get experiment stats

#### Get event counts

Pass a request of the form: `/experiments/<experiment_id>/stats/counts`,

**Request:**
```sh
curl -i "http://see.com/experiments/2/stats/counts"
```

**Response:**
```
HTTP/1.1 200 OK
Content-Type: application/json

{
  "data": {
    "variations": [
      {
        id: 1,
        name: 'control',
        "unique_counts": [
            {
                name: "participation",
                value: 170
            },
            {
                name: "btn_click",
                value: 20
            },
            // ...
        ]
      }, {
        id: 2,
        name: 'treatment',
        "unique_counts": [
            {
                name: "participation",
                value: 172
            },
            {
                name: "btn_click",
                value: 35
            },
            // ...
        ]
      },
      // ...
    ]
  }
}
```

#### Get counts by time range

Pass a request of the form: `/experiments/<experiment_id>/stats/timeline/<from>/<to>/<granularity>`,

    where <granularity> may be one of [ 'daily', 'hourly', 'monthly' ]

**Request:**
```sh
curl -i "http://see.com/experiments/2/stats/timeline/2017-01-10T00:00:00/2017-01-20T00:00:00/daily"
```

**Response:**
```
HTTP/1.1 200 OK
Content-Type: application/json

{
  "data": {
    "variations": [
      {
        id: 1,
        name: 'control',
        "timeline": [
            {
                time: 14224232323 // unix ts in ms
                event_name: "participation",
                count: 170
            },
            {
                time: 14224232323 // unix ts in ms
                event_name: "btn_click",
                count: 15
            },
            // ...
        ]
      }, {
        id: 2,
        name: 'treatment',
        "unique_counts": [
            {
                time: 14224232323 // unix ts in ms
                event_name: "participation",
                count: 180
            },
            {
                time: 14224232323 // unix ts in ms
                event_name: "btn_click",
                count: 35
            },
            // ...
        ]
      },
      // ...
    ]
  }
}
```
