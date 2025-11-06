import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import assetsRouter from './routes/assets';
import alertsRouter from './routes/alerts';
import monitorRouter from './routes/monitor';
import probabilityRouter from './routes/probability';
import monitorService from './services/monitorService';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/assets', assetsRouter);
app.use('/api/alerts', alertsRouter);
app.use('/api/monitor', monitorRouter);
app.use('/api/probability', probabilityRouter);

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    monitor: monitorService.getStatus()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'Ben-COMET Financial Monitor API',
    version: '1.0.0',
    endpoints: {
      assets: '/api/assets',
      alerts: '/api/alerts',
      monitor: '/api/monitor',
      probability: '/api/probability',
      health: '/health'
    }
  });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 API available at http://localhost:${PORT}`);
  console.log(`💚 Health check: http://localhost:${PORT}/health`);

  // Start monitoring service
  monitorService.start();
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  monitorService.stop();
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully...');
  monitorService.stop();
  process.exit(0);
});

export default app;
