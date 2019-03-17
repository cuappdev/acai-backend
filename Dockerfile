FROM node:10

RUN mkdir /usr/src/app
WORKDIR /usr/src/app

COPY . .

RUN npm install

CMD npm run start:prod
