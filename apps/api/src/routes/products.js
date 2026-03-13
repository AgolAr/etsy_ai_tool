
import express from 'express';
import pb from '../utils/pocketbase.js';
import logger from '../utils/logger.js';

const router = express.Router();

// POST /products - Create a new product
router.post('/', async (req, res) => {
  const data = req.body;
  
  if (!data.name || !data.category || !data.niche || !data.audience || !data.userId) {
    const error = new Error('Missing required fields: name, category, niche, audience, or userId');
    error.status = 400;
    throw error;
  }

  if (!data.outline || !data.content || !data.listing) {
    const error = new Error('Missing required generated data: outline, content, or listing');
    error.status = 400;
    throw error;
  }

  logger.info(`[Products] Creating new product for user: ${data.userId}`);
  
  const record = await pb.collection('generatedProducts').create(data, { $autoCancel: false });
  
  logger.info(`[Products] Successfully created product: ${record.id}`);
  res.status(201).json({
    id: record.id,
    name: record.name,
    createdAt: record.created
  });
});

// GET /products - List user's products
router.get('/', async (req, res) => {
  const { page = 1, limit = 10, userId } = req.query;
  
  if (!userId) {
    const error = new Error('Missing userId parameter');
    error.status = 400;
    throw error;
  }

  logger.info(`[Products] Fetching products for user: ${userId}, page: ${page}`);
  
  const result = await pb.collection('generatedProducts').getList(page, limit, {
    sort: '-created',
    filter: `userId="${userId}"`,
    $autoCancel: false
  });
  
  res.json({
    products: result.items,
    total: result.totalItems,
    totalPages: result.totalPages
  });
});

// GET /products/:id - Retrieve single product
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  
  logger.info(`[Products] Fetching product details: ${id}`);
  
  const record = await pb.collection('generatedProducts').getOne(id, { $autoCancel: false });
  
  if (!record) {
    const error = new Error('Product not found');
    error.status = 404;
    throw error;
  }
  
  res.json(record);
});

// PATCH /products/:id - Update product
router.patch('/:id', async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  
  logger.info(`[Products] Updating product: ${id}`);
  
  const record = await pb.collection('generatedProducts').update(id, data, { $autoCancel: false });
  
  res.json(record);
});

// DELETE /products/:id - Delete product
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  
  logger.info(`[Products] Deleting product: ${id}`);
  
  await pb.collection('generatedProducts').delete(id, { $autoCancel: false });
  
  res.json({ status: 'success', message: 'Product deleted' });
});

export default router;
