import dotenv from 'dotenv';
import { createApp } from './app.js';
import { connectDB } from './config/db.js';

dotenv.config();

const PORT = process.env.PORT || 5000;
const app = createApp();

connectDB();

app.listen(PORT, () => {
  console.log(`[HotelPro Server] Running on http://localhost:${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});
