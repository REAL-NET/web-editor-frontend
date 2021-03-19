FROM node:latest

WORKDIR /app

RUN npm install
COPY . /app

EXPOSE PORT

CMD npm start
