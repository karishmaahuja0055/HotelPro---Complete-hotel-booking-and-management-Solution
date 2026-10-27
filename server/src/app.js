import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

export const createApp = () => {
  const app = express();

  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(cors());
  app.use(express.json());

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'healthy',
      system: 'HotelPro India MERN System',
      currency: 'INR',
      timezone: 'Asia/Kolkata (IST)',
      timestamp: new Date().toISOString(),
    });
  });

  return app;
};
