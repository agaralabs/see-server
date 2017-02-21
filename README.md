# Stayzilla Experimentation Engine Server

This is the server component of SEE. It allocates experiments
and provides a REST-ful API to manage experiments.

## Requirements

- node >= 4
- nginx
- redis server
- mysql server
- redshift server

## Installation 

```sh
npm install
```

## Configuration

Edit `src/config/config.ini`

## Running

```sh
node src/app.js
```

**WARNING -** The server does NOT handle `/track` calls. This must be done
by nginx. Here's a sample configuration:

```nginx
server {
    listen 80;
    server_name YOUR_SERVER_NAME;

    location /track {
        access_log /var/log/nginx/tracker.log;
        return 200 logged;
    }
 
    location / {
        proxy_pass http://127.0.0.1:8080/;
    }
}
```

## API documentation

API documentation is [available here](APIDOC.md).
