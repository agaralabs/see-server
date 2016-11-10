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
      "create_time": 1478739059000,
      "update_time": 0,
      "variations": []
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
            "is_active": true
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
      "usr_variation": null,
      "create_time": 1478738270000,
      "update_time": 1478738985000,
      "variations": []
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
        "create_time": 1478739343000,
        "update_time": 0
      },
      {
        "id": 6,
        "experiment_id": 7,
        "name": "TREATMENT",
        "split_percent": 50,
        "create_time": 1478739473000,
        "update_time": 0
      }
    ]
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
      "create_time": 1478739473000,
      "update_time": 1478739616000
    }
  }
}
```
