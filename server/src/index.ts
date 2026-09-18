import express from 'express';
import http from 'http';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import cron from 'node-cron';
import { initSocket } from './sockets/index';
import { checkAndExpireExchanges } from './services/exchange.service';

import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import matchRoutes from './routes/match.routes';
import exchangeRoutes from './routes/exchange.routes';
import chatRoutes from './routes/chat.routes';
import ratingRoutes from './routes/rating.routes';
import reportRoutes from './routes/report.routes';
import { generalRateLimiter } from './middleware/rateLimiter';

dotenv.config();

const app = express();
const httpServer = http.createServer(app);

app.use(helmet());
app.use(cors({ origin: process.env.ALLOWED_ORIGINS?.split(',') || '*' }));
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(generalRateLimiter);

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/match', matchRoutes);
app.use('/api/v1/exchanges', exchangeRoutes);
app.use('/api/v1/chats', chatRoutes);
app.use('/api/v1/ratings', ratingRoutes);
app.use('/api/v1/reports', reportRoutes);

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

initSocket(httpServer);

// Expire pending exchanges every minute
cron.schedule('* * * * *', async () => {
  try {
    const count = await checkAndExpireExchanges();
    if (count > 0) console.log(`Expired ${count} stale exchange request(s)`);
  } catch (err) {
    console.error('Exchange expiry cron error:', err);
  }
});

const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () => {
  console.log(`🚀 PaySaathi server running on port ${PORT}`);
});

