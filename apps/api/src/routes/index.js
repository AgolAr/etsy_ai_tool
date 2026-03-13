
import { Router } from 'express';
import healthCheck from './health-check.js';
import aiRouter from './ai.js';
import exportRouter from './export.js';
import productsRouter from './products.js';

const router = Router();

export default () => {
  router.get('/health', healthCheck);
  router.use('/ai', aiRouter);
  router.use('/export', exportRouter);
  router.use('/products', productsRouter);

  return router;
};
