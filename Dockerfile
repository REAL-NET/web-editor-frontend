FROM node:latest

WORKDIR /app
COPY package.json ./
COPY package-lock.json ./
RUN npm install	

WORKDIR /gateway
COPY package.json /gateway
COPY package-lock.json /gateway
RUN npm install

WORKDIR ../../app
COPY . .
RUN npm run build
RUN npm i -g typescript
RUN tsc --project ./gateway

EXPOSE 5000

CMD ["node", "./gateway/build/app.js"]
