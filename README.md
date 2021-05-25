# REAL.NET Web-editor

[![CircleCI](https://circleci.com/gh/REAL-NET/web-editor-frontend.svg?style=svg)](https://circleci.com/gh/REAL-NET/web-editor-frontend)

## Prerequisites

*   Docker (you can download it [here](https://www.docker.com/get-started))

## Getting started

To run the web-editor in the production mode, do the following steps:

0.  Launch Docker

1.  Download docker-compose file
```cmd
curl -o docker-compose.yml https://raw.githubusercontent.com/REAL-NET/web-editor-frontend/master/docker-compose.yml
```

2.  Run docker-compose
```cmd
docker compose up
```

3.  Open [http://localhost:5000](http://localhost:5000)

## Debugging

You can launch web-editor in 'debugging' mode:

0.  Launch Docker

1.  Download repository
```cmd
git clone https://github.com/REAL-NET/web-editor-frontend
```

2.  Launch non-web services from docker-compose
```cmd
docker compose up repo auth gateway test
```

3. Change host's url in gateway/routes files (except for routes.ts) from 'gateway:80' to 'localhost:8000' (5th string)


4.  Run web-editor's server
```cmd
cd gateway && npm start
```

5.  Launch web-editor
```cmd
npm run start-client
```

6.  Open [http://localhost:5000](http://localhost:5000)
