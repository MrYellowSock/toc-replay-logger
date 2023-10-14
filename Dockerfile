FROM node:16.17.0-alpine

WORKDIR /app

COPY . .

RUN npm i

CMD ["npm" , "start"]
