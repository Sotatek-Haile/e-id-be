FROM node:18.16.0-alpine

WORKDIR /app

RUN yarn global add pm2

COPY package.json .
COPY yarn.lock .

RUN yarn

COPY . .

RUN yarn build

CMD ["node", "dist/main.js"]