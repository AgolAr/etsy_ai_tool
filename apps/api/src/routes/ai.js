import express from 'express';
import multer from 'multer';
import pdfParse from 'pdf-parse';
import logger from '../utils/logger.js';
import { 
  callGeminiAPI, 
  parseGeminiJSON, 
  generateStructuredOutput, 
  IDEAS_SCHEMA,
  OUTLINE_SCHEMA,
  CONTENT_SCHEMA,
  LISTING_SCHEMA,
  LISTING_ANALYSIS_SCHEMA
} from '../utils/geminiClient.js';
import pb from '../utils/pocketbase.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Log schema initialization at startup
logger.info('[AI Routes] Initializing AI routes with schemas');
logger.debug(`[AI Routes] OUTLINE_SCHEMA loaded: ${Object.keys(OUTLINE_SCHEMA).join(', ')}`);
logger.debug(`[AI Routes] CONTENT_SCHEMA loaded: ${Object.keys(CONTENT_SCHEMA).join(', ')}`);
logger.debug(`[AI Routes] LISTING_SCHEMA loaded: ${Object.keys(LISTING_SCHEMA).join(', ')}`);

async function createGenerationRecord(featureName, modelName, inputJson, outputJson, status = 'completed') {
  try {
    await pb.collection('generations').create({
      feature_name: featureName,
      model_name: modelName,
      input_json: JSON.stringify(inputJson),
      output_json: JSON.stringify(outputJson),
      status,
      created_at: new Date().toISOString(),
    });
    logger.info(`[Generation Record] Created for ${featureName}`);
  } catch (error) {
    logger.error(`[Generation Record] Failed to create for ${featureName}:`, error.message);
  }
}

// POST /ai/ideas - Generate product ideas
router.post('/ideas', async (req, res) => {
  try {
    const { niche, audience, productType, tone, seasonality } = req.body;

    if (!niche || !audience || !productType) {
      return res.status(400).json({
        error: { message: 'Missing required fields: niche, audience, productType' }
      });
    }

    logger.info('[AI Ideas] Request received', { niche, audience, productType });

    const prompt = `Generate 20 product ideas for ${niche} targeting ${audience}. Include title, description, targetCustomer, productType, and scores (0-100) for demand, competition, and profitability. Add a bundle suggestion for each.`;

    const response = await generateStructuredOutput(prompt, IDEAS_SCHEMA, 'ideas');
    
    if (!response.ideas || !Array.isArray(response.ideas) || response.ideas.length === 0) {
      throw new Error('AI returned invalid structured data: ideas array is empty or missing');
    }

    logger.info(`[AI Ideas] Successfully generated ${response.ideas.length} ideas`);

    const apiResponse = {
      ideas: response.ideas,
      totalIdeas: response.ideas.length,
      generatedAt: new Date().toISOString(),
    };

    createGenerationRecord('ideas', 'gemini-2.5-flash', req.body, apiResponse);

    res.json(apiResponse);
  } catch (err) {
    logger.error('[AI Ideas] Error generating ideas:', err.message);
    logger.error('[AI Ideas] Full error stack:', err.stack);
    res.status(500).json({ 
      status: 'error', 
      message: `Failed to parse AI response: ${err.message}` 
    });
  }
});

// POST /ai/outline - Generate product outline
router.post('/outline', async (req, res) => {
  try {
    const { productTitle, productType, niche, audience, tone } = req.body;
    
    logger.info('[AI Outline] Request received', { productTitle, productType, niche, audience, tone });

    if (!productTitle) {
      return res.status(400).json({ 
        status: 'error', 
        message: 'Missing required field: productTitle' 
      });
    }
    if (!productType) {
      return res.status(400).json({ 
        status: 'error', 
        message: 'Missing required field: productType' 
      });
    }
    if (!niche) {
      return res.status(400).json({ 
        status: 'error', 
        message: 'Missing required field: niche' 
      });
    }
    if (!audience) {
      return res.status(400).json({ 
        status: 'error', 
        message: 'Missing required field: audience' 
      });
    }
    if (!tone) {
      return res.status(400).json({ 
        status: 'error', 
        message: 'Missing required field: tone' 
      });
    }

    logger.info('[AI Outline] All required fields validated');
    logger.debug(`[AI Outline] Using OUTLINE_SCHEMA: ${JSON.stringify(OUTLINE_SCHEMA).substring(0, 200)}...`);

    const prompt = `Create a detailed product outline for a ${productType} titled "${productTitle}" in ${niche} niche for ${audience} with ${tone} tone. Provide: title, subtitle, chapters (array of objects with name and description), pageIdeas (array of strings), bonusPages (array of strings).`;
    
    logger.info('[AI Outline] Calling Gemini API for outline generation');
    const generatedOutline = await generateStructuredOutput(prompt, OUTLINE_SCHEMA, 'outline');
    
    logger.info('[AI Outline] Successfully generated outline');
    logger.debug(`[AI Outline] Outline structure: title=${generatedOutline.title}, chapters=${generatedOutline.chapters?.length || 0}`);
    
    res.json({ status: 'success', outline: generatedOutline });
  } catch (error) {
    logger.error('[AI Outline] Error generating outline:', error.message);
    logger.error('[AI Outline] Full error stack:', error.stack);
    res.status(500).json({ 
      status: 'error', 
      message: `Failed to parse AI response: ${error.message}` 
    });
  }
});

// POST /ai/content - Generate product content
router.post('/content', async (req, res) => {
  try {
    const { outline, audience, tone } = req.body;
    
    logger.info('[AI Content] Request received', { audience, tone, outlineTitle: outline?.title });

    if (!outline) {
      return res.status(400).json({ 
        status: 'error', 
        message: 'Missing required field: outline' 
      });
    }
    if (!audience) {
      return res.status(400).json({ 
        status: 'error', 
        message: 'Missing required field: audience' 
      });
    }
    if (!tone) {
      return res.status(400).json({ 
        status: 'error', 
        message: 'Missing required field: tone' 
      });
    }

    logger.info('[AI Content] All required fields validated');
    logger.debug(`[AI Content] Using CONTENT_SCHEMA: ${JSON.stringify(CONTENT_SCHEMA).substring(0, 200)}...`);

    const prompt = `Generate detailed content for each chapter in this outline: ${JSON.stringify(outline)}. Target audience: ${audience}. Tone: ${tone}. Include content, word count, and key points for each section.`;
    
    logger.info('[AI Content] Calling Gemini API for content generation');
    const generatedContent = await generateStructuredOutput(prompt, CONTENT_SCHEMA, 'content');
    
    logger.info('[AI Content] Successfully generated content');
    logger.debug(`[AI Content] Content structure: sections=${generatedContent.sections?.length || 0}`);
    
    res.json({ status: 'success', content: generatedContent });
  } catch (error) {
    logger.error('[AI Content] Error generating content:', error.message);
    logger.error('[AI Content] Full error stack:', error.stack);
    res.status(500).json({ 
      status: 'error', 
      message: `Failed to parse AI response: ${error.message}` 
    });
  }
});

// POST /ai/listing - Generate product listing
router.post('/listing', async (req, res) => {
  try {
    const { productName, outline, content, audience } = req.body;
    
    logger.info('[AI Listing] Request received', { productName, audience, outlineTitle: outline?.title });

    if (!productName) {
      return res.status(400).json({ 
        status: 'error', 
        message: 'Missing required field: productName' 
      });
    }
    if (!outline) {
      return res.status(400).json({ 
        status: 'error', 
        message: 'Missing required field: outline' 
      });
    }
    if (!content) {
      return res.status(400).json({ 
        status: 'error', 
        message: 'Missing required field: content' 
      });
    }
    if (!audience) {
      return res.status(400).json({ 
        status: 'error', 
        message: 'Missing required field: audience' 
      });
    }

    logger.info('[AI Listing] All required fields validated');
    logger.debug(`[AI Listing] Using LISTING_SCHEMA: ${JSON.stringify(LISTING_SCHEMA).substring(0, 200)}...`);

    const prompt = `Create Etsy listing copy for this product: ${productName}. Outline: ${JSON.stringify(outline)}. Content: ${JSON.stringify(content)}. Target audience: ${audience}. Include title, description, tags, FAQ, CTA, pricing suggestion, bundle suggestion, and scores.`;
    
    logger.info('[AI Listing] Calling Gemini API for listing generation');
    const generatedListing = await generateStructuredOutput(prompt, LISTING_SCHEMA, 'listing');
    
    logger.info('[AI Listing] Successfully generated listing');
    logger.debug(`[AI Listing] Listing structure: title=${generatedListing.etsyTitle}, tags=${generatedListing.tags?.length || 0}`);
    
    res.json({ status: 'success', listing: generatedListing });
  } catch (error) {
    logger.error('[AI Listing] Error generating listing:', error.message);
    logger.error('[AI Listing] Full error stack:', error.stack);
    res.status(500).json({ 
      status: 'error', 
      message: `Failed to parse AI response: ${error.message}` 
    });
  }
});

// POST /ai/bundle - Generate bundle suggestions
router.post('/bundle', async (req, res) => {
  const { productIds, niche, audience, tone } = req.body;
  if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
    return res.status(400).json({ status: 'error', message: 'Missing required field: productIds' });
  }
  if (!niche || !audience || !tone) {
    return res.status(400).json({ status: 'error', message: 'Missing required fields' });
  }
  const prompt = `Create a bundle suggestion combining these products: ${productIds.join(', ')}. Target ${niche} niche, ${audience} audience, ${tone} tone. Provide: bundleName (string), bundleDescription (string), valueProposition (string), pricingSuggestion (number), coverDirection (design guidance string), listingCopy (Etsy-optimized string, 500-800 chars). Return as JSON object. Return ONLY valid JSON, no markdown formatting.`;
  const geminiResponse = await callGeminiAPI(prompt, 'bundle');
  const bundle = parseGeminiJSON(geminiResponse);
  res.json({ status: 'success', bundle, productIds, generatedAt: new Date().toISOString() });
});

// POST /ai/variant - Generate product variants
router.post('/variant', async (req, res) => {
  const { productId, variantType } = req.body;
  if (!productId || !variantType) {
    return res.status(400).json({ status: 'error', message: 'Missing required fields' });
  }
  const prompt = `Create a ${variantType} variant of this product: ${productId}. Provide: variantTitle (string), variantDescription (string), designChanges (array of 5 specific design changes), contentChanges (array of 5 content modifications). Return as JSON object. Return ONLY valid JSON, no markdown formatting.`;
  const geminiResponse = await callGeminiAPI(prompt, 'variant');
  const variant = parseGeminiJSON(geminiResponse);
  res.json({ status: 'success', variant, productId, variantType, generatedAt: new Date().toISOString() });
});

// POST /ai/upload-parse - Parse uploaded file
router.post('/upload-parse', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ status: 'error', message: 'No file uploaded.' });
  }
  const { originalname, mimetype, buffer } = req.file;
  let extractedText = '';
  try {
    if (mimetype === 'application/pdf') {
      const pdfData = await pdfParse(buffer);
      extractedText = pdfData.text;
    } else {
      extractedText = buffer.toString('utf-8');
    }
  } catch (error) {
    throw new Error(`Failed to extract text from file: ${error.message}`);
  }
  const truncatedText = extractedText.substring(0, 10000);
  const prompt = `Analyze this uploaded document content: ${truncatedText}. Provide: extractedText (cleaned text, max 500 chars), summary (brief overview, 100-200 chars), suggestedProductType (what product this could become), suggestedStructure (outline for product as array of chapter objects with name and description). Return as JSON object. Return ONLY valid JSON, no markdown formatting.`;
  const geminiResponse = await callGeminiAPI(prompt, 'upload-parse');
  const analysis = parseGeminiJSON(geminiResponse);
  res.json({ status: 'success', fileName: originalname, fileType: mimetype, analysis, generatedAt: new Date().toISOString() });
});

// POST /ai/listing-optimizer - Analyze and optimize Etsy listing
router.post('/listing-optimizer', async (req, res) => {
  const { listingText, category, audience, optimizationFocus } = req.body;

  // Validate listingText length (50-5000 characters)
  if (!listingText || typeof listingText !== 'string') {
    const error = new Error('Missing required field: listingText');
    error.status = 400;
    throw error;
  }

  const textLength = listingText.trim().length;
  if (textLength < 50 || textLength > 5000) {
    const error = new Error('listingText must be between 50 and 5000 characters');
    error.status = 400;
    throw error;
  }

  if (!category || !audience) {
    const error = new Error('Missing required fields: category, audience');
    error.status = 400;
    throw error;
  }

  const listingPreview = listingText.substring(0, 50);
  logger.info(`[Listing Optimizer] Analyzing listing: ${listingPreview}...`);

  const prompt = `Analyze this Etsy listing and provide optimization suggestions. Listing: ${listingText}. Category: ${category}. Target audience: ${audience}. Focus on: ${optimizationFocus || 'overall improvement'}. Provide: (1) currentScores object with seoScore, clarityScore, conversionScore, engagementScore (each 0-100), (2) issues array with { issue, description, priority }, (3) suggestions array with { type, issue, recommendation, impact, priority }, (4) optimizedListing object with title (max 140 chars), alternativeTitles (array of 3), description, tags (array of 13), faq (array of { question, answer }), cta, (5) newScores object with same structure as currentScores, (6) improvements object with seoImprovement, clarityImprovement, conversionImprovement, engagementImprovement (as +X numbers). Return ONLY valid JSON.`;

  const analysis = await generateStructuredOutput(prompt, LISTING_ANALYSIS_SCHEMA, 'listing-optimizer');

  logger.info(`[Listing Optimizer] Analysis complete, scores: SEO=${analysis.currentScores.seoScore}, Clarity=${analysis.currentScores.clarityScore}, Conversion=${analysis.currentScores.conversionScore}, Engagement=${analysis.currentScores.engagementScore}`);

  res.json(analysis);
});

// POST /ai/optimized-listings - Save optimized listing to PocketBase
router.post('/optimized-listings', async (req, res) => {
  const { originalListing, category, audience, currentScores, optimizedListing, newScores, improvements } = req.body;

  if (!originalListing || !category || !audience || !currentScores || !optimizedListing || !newScores || !improvements) {
    const error = new Error('Missing required fields: originalListing, category, audience, currentScores, optimizedListing, newScores, improvements');
    error.status = 400;
    throw error;
  }

  logger.info('[Optimized Listings] Creating optimized listing record');

  const record = await pb.collection('optimizedListings').create({
    originalListing,
    category,
    audience,
    currentScores: JSON.stringify(currentScores),
    optimizedListing: JSON.stringify(optimizedListing),
    newScores: JSON.stringify(newScores),
    improvements: JSON.stringify(improvements),
    userId: req.auth?.id || 'anonymous'
  }, { $autoCancel: false });

  logger.info(`[Optimized Listings] Successfully created record: ${record.id}`);

  res.status(201).json(record);
});

// GET /ai/optimized-listings - Retrieve user's optimized listings
router.get('/optimized-listings', async (req, res) => {
  const { sort = '-createdAt', limit = 50 } = req.query;
  const userId = req.auth?.id;

  if (!userId) {
    const error = new Error('Authentication required');
    error.status = 401;
    throw error;
  }

  logger.info(`[Optimized Listings] Fetching listings for user: ${userId}, limit: ${limit}`);

  const result = await pb.collection('optimizedListings').getList(1, parseInt(limit), {
    sort,
    filter: `userId="${userId}"`,
    $autoCancel: false
  });

  logger.info(`[Optimized Listings] Retrieved ${result.items.length} listings`);

  res.json({
    optimizations: result.items,
    total: result.totalItems
  });
});

export default router;
