# drift-zone-user

## Running application
- Create `.env` from `.env.example` file
- Start service
```
npm i
npm run start:dev
```
- APIs are served at http://localhost:3001 by defaut
- View swagger docs at http://localhost:3001/docs

## Deploy in production
- Install pm2
- Create `.env` from `.env.example` file
- Start service
```
npm i
npm run build
pm2 start deploy/dev/app.json
```
