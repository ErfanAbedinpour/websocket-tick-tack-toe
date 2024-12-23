FROM node:23-alpine

WORKDIR /app

COPY *.json /app

RUN npm i

COPY . .