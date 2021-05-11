FROM node:latest

WORKDIR /app
COPY package.json ./
COPY package-lock.json ./
RUN npm install --force
COPY . ./
RUN npm run build	

WORKDIR /app/gateway
COPY package.json /gateway
COPY package-lock.json /gateway
RUN npm install --force

EXPOSE 5000

CMD npm run start-gateway
