FROM node:latest

WORKDIR /app

RUN npm install
COPY . /app

EXPOSE 3000

ENTRYPOINT npm start
