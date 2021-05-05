FROM node:latest

WORKDIR /app
COPY package.json /app
RUN npm install --force
RUN npm run build
COPY . /app

WORKDIR /app/gateway
COPY package.json /app/gateway
RUN npm install --force

EXPOSE 5000

CMD npm start
