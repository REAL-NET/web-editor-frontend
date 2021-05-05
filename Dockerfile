FROM node:latest

WORKDIR /app

COPY package.json /app
COPY gateway/package.json /app/gateway

RUN npm install --force \
    && cd gateway \
    && npm install --force

COPY . /app

EXPOSE 5000

CMD npm start
