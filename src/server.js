
import http from 'http';
import 'dotenv/config.js';
import app from './app.js';
import { connectDB } from './config/db.js';

const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI;

async function start ()
{
  console.log('Starting server...');
  await connectDB(MONGODB_URI);
  const server = http.createServer(app);
  server.listen(PORT, () => console.log(`Cult CRM API running on http://localhost:${PORT}`));
}

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
