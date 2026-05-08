# Impact Track Forge Backend

## Start server

1. `cd backend`
2. `npm install`
3. Create `.env` (already provided) with:
   - `MONGO_URI` your MongoDB string
   - `JWT_SECRET` your secret
   - `PORT` optional (default 4000)

4. `npm run dev` (requires nodemon) or `npm start`

## API Endpoints

- `POST /api/auth/register` with `{ name, email, password }`
- `POST /api/auth/login` with `{ email, password }`
- `GET /api/projects`
- `GET /api/timelogs` (requires Bearer token)
- `POST /api/timelogs` (requires Bearer token) with `{ projectName, description, date, clockIn, clockOut, totalHours }`
