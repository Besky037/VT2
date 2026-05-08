# Impact Track Forge

This is a monorepo containing the frontend and backend for Impact Track Forge.

## Structure

- `frontend/` - React frontend built with Vite, TypeScript, shadcn-ui, Tailwind CSS
- `backend/` - Express.js backend with MongoDB

## Development

### Frontend
```sh
cd frontend
npm install
npm run dev
```

### Backend
```sh
cd backend
npm install
npm run dev
```

## Deployment

- Frontend: Deploy to Vercel from the root (configured in `vercel.json`)
- Backend: Deploy separately (e.g., to Heroku, Railway, or Vercel serverless)

For Vercel frontend deployment, set `VITE_API_BASE_URL` to your backend URL.

