import 'dotenv/config';
import { GoogleGenerativeAI } from '@google/generative-ai';
import logger from './logger.js';

/**
 * JSON Schema for product ideas generation
 */
export const IDEAS_SCHEMA = {
  type: 'object',
  properties: {
    ideas: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          description: { type: 'string' },
          targetCustomer: { type: 'string' },
          productType: { type: 'string' },
          demandScore: { type: 'number', minimum: 0, maximum: 100 },
          competitionScore: { type: 'number', minimum: 0, maximum: 100 },
          profitabilityScore: { type: 'number', minimum: 0, maximum: 100 },
          bundleSuggestion: { type: 'string' },
        },
        required: [
          'title',
          'description',
          'targetCustomer',
          'productType',
          'demandScore',
          'competitionScore',
          'profitabilityScore',
          'bundleSuggestion',
        ],
      },
    },
  },
  required: ['ideas'],
};

export const OUTLINE_SCHEMA = {
  type: 'object',
  properties: {
    title: { type: 'string' },
    subtitle: { type: 'string' },
    chapters: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          description: { type: 'string' }
        },
        required: ['name', 'description']
      }
    },
    pageIdeas: {
      type: 'array',
      items: { type: 'string' }
    },
    bonusPages: {
      type: 'array',
      items: { type: 'string' }
    }
  },
  required: ['title', 'subtitle', 'chapters', 'pageIdeas', 'bonusPages']
};

export const CONTENT_SCHEMA = {
  type: 'object',
  properties: {
    sections: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          content: { type: 'string' },
          wordCount: { type: 'number' },
          keyPoints: {
            type: 'array',
            items: { type: 'string' }
          }
        },
        required: ['title', 'content', 'wordCount', 'keyPoints']
      }
    }
  },
  required: ['sections']
};

export const LISTING_SCHEMA = {
  type: 'object',
  properties: {
    etsyTitle: { type: 'string' },
    alternativeTitles: {
      type: 'array',
      items: { type: 'string' }
    },
    description: { type: 'string' },
    tags: {
      type: 'array',
      items: { type: 'string' }
    },
    searchPhrases: {
      type: 'array',
      items: { type: 'string' }
    },
    faq: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          question: { type: 'string' },
          answer: { type: 'string' }
        },
        required: ['question', 'answer']
      }
    },
    cta: { type: 'string' },
    pricingSuggestion: { type: 'number' },
    bundleSuggestion: { type: 'string' },
    seoScore: { type: 'number' },
    clarityScore: { type: 'number' },
    conversionScore: { type: 'number' }
  },
  required: [
    'etsyTitle', 'alternativeTitles', 'description', 'tags', 
    'searchPhrases', 'faq', 'cta', 'pricingSuggestion', 
    'bundleSuggestion', 'seoScore', 'clarityScore', 'conversionScore'
  ]
};

export const LISTING_ANALYSIS_SCHEMA = {
  type: 'object',
  properties: {
    currentScores: {
      type: 'object',
      properties: {
        seoScore: { type: 'number', minimum: 0, maximum: 100 },
        clarityScore: { type: 'number', minimum: 0, maximum: 100 },
        conversionScore: { type: 'number', minimum: 0, maximum: 100 },
        engagementScore: { type: 'number', minimum: 0, maximum: 100 }
      },
      required: ['seoScore', 'clarityScore', 'conversionScore', 'engagementScore']
    },
    issues: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          issue: { type: 'string' },
          description: { type: 'string' },
          priority: { type: 'string', enum: ['high', 'medium', 'low'] }
        },
        required: ['issue', 'description', 'priority']
      }
    },
    suggestions: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          type: { type: 'string' },
          issue: { type: 'string' },
          recommendation: { type: 'string' },
          impact: { type: 'string' },
          priority: { type: 'string', enum: ['high', 'medium', 'low'] }
        },
        required: ['type', 'issue', 'recommendation', 'impact', 'priority']
      }
    },
    optimizedListing: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        alternativeTitles: {
          type: 'array',
          items: { type: 'string' }
        },
        description: { type: 'string' },
        tags: {
          type: 'array',
          items: { type: 'string' }
        },
        faq: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              question: { type: 'string' },
              answer: { type: 'string' }
            },
            required: ['question', 'answer']
          }
        },
        cta: { type: 'string' }
      },
      required: ['title', 'alternativeTitles', 'description', 'tags', 'faq', 'cta']
    },
    newScores: {
      type: 'object',
      properties: {
        seoScore: { type: 'number', minimum: 0, maximum: 100 },
        clarityScore: { type: 'number', minimum: 0, maximum: 100 },
        conversionScore: { type: 'number', minimum: 0, maximum: 100 },
        engagementScore: { type: 'number', minimum: 0, maximum: 100 }
      },
      required: ['seoScore', 'clarityScore', 'conversionScore', 'engagementScore']
    },
    improvements: {
      type: 'object',
      properties: {
        seoImprovement: { type: 'number' },
        clarityImprovement: { type: 'number' },
        conversionImprovement: { type: 'number' },
        engagementImprovement: { type: 'number' }
      },
      required: ['seoImprovement', 'clarityImprovement', 'conversionImprovement', 'engagementImprovement']
    }
  },
  required: ['currentScores', 'issues', 'suggestions', 'optimizedListing', 'newScores', 'improvements']
};

/**
 * Initialize Gemini API client
 */
function initializeGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is not set');
  }
  return new GoogleGenerativeAI(apiKey);
}

/**
 * Call Gemini API with exponential backoff retry logic
 */
export async function callGeminiAPI(prompt, feature = 'content', retries = 3) {
  const client = initializeGeminiClient();
  const model = client.getGenerativeModel({ model: 'gemini-2.5-flash' });

  let lastError;
  let delay = 1000;
  const timeoutMs = 60000;

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      logger.info(`[Gemini API] Gemini request started for [${feature}]`);

      const startTime = Date.now();
      let timeoutWarningLogged = false;

      const response = await Promise.race([
        model.generateContent(prompt),
        new Promise((_, reject) => {
          setTimeout(() => {
            reject(new Error('Gemini request timeout after 60s'));
          }, timeoutMs);

          setTimeout(() => {
            if (!timeoutWarningLogged) {
              timeoutWarningLogged = true;
              logger.warn('[Gemini API] Request approaching timeout (50s elapsed)...');
            }
          }, 50000);
        }),
      ]);

      if (!response || !response.response) {
        throw new Error('Invalid response from Gemini API');
      }

      const text = response.response.text();
      const elapsedTime = ((Date.now() - startTime) / 1000).toFixed(1);
      logger.info(`[Gemini API] Gemini request completed in ${elapsedTime}s`);
      return text;
    } catch (error) {
      lastError = error;

      if (
        error.status === 401 ||
        error.message?.includes('API key') ||
        error.message?.includes('authentication')
      ) {
        throw new Error('Gemini API authentication failed. Check GEMINI_API_KEY.');
      }

      if (error.message?.includes('timeout') || error.message?.includes('ETIMEDOUT')) {
        if (attempt < retries - 1) {
          await new Promise((resolve) => setTimeout(resolve, delay));
          delay *= 2;
          continue;
        }
      }

      if (error.status === 429) {
        if (attempt < retries - 1) {
          await new Promise((resolve) => setTimeout(resolve, delay));
          delay *= 2;
          continue;
        }
      }

      if (attempt < retries - 1) {
        await new Promise((resolve) => setTimeout(resolve, delay));
        delay *= 2;
        continue;
      }
    }
  }

  throw new Error('Gemini API is currently slow. Please try again in a moment.');
}

/**
 * Extract JSON from text, handling markdown code blocks
 * @param {string} text - Raw text that may contain JSON
 * @returns {object} Parsed JSON object
 */
function extractAndParseJSON(text) {
  logger.info('[Gemini JSON Parse] Attempting to extract JSON from response');
  logger.debug(`[Gemini JSON Parse] Raw text (first 200 chars): ${text.substring(0, 200)}`);

  // Try to extract JSON from markdown code blocks (```json ... ``` or ``` ... ```)
  const jsonBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (jsonBlockMatch && jsonBlockMatch[1]) {
    logger.info('[Gemini JSON Parse] Found JSON in markdown code block');
    const jsonText = jsonBlockMatch[1].trim();
    logger.debug(`[Gemini JSON Parse] Extracted JSON (first 200 chars): ${jsonText.substring(0, 200)}`);
    
    try {
      const parsed = JSON.parse(jsonText);
      logger.info('[Gemini JSON Parse] Successfully parsed JSON from markdown block');
      return parsed;
    } catch (error) {
      logger.error(`[Gemini JSON Parse] Failed to parse extracted JSON: ${error.message}`);
      throw new Error(`Failed to parse AI response: Invalid JSON in code block - ${error.message}`);
    }
  }

  // Try to parse the entire text as JSON
  logger.info('[Gemini JSON Parse] Attempting to parse entire text as JSON');
  try {
    const parsed = JSON.parse(text);
    logger.info('[Gemini JSON Parse] Successfully parsed entire text as JSON');
    return parsed;
  } catch (error) {
    logger.error(`[Gemini JSON Parse] Failed to parse entire text: ${error.message}`);
    throw new Error(`Failed to parse AI response: Invalid JSON format - ${error.message}`);
  }
}

/**
 * Call Gemini API with structured output (JSON schema validation)
 */
export async function generateStructuredOutput(prompt, schema, feature = 'content', retries = 3) {
  const client = initializeGeminiClient();
  const model = client.getGenerativeModel({ model: 'gemini-2.5-flash' });

  logger.info(`[Gemini Structured] Starting structured output request for [${feature}]`);
  logger.debug(`[Gemini Structured] Schema: ${JSON.stringify(schema).substring(0, 200)}...`);

  let lastError;
  let delay = 1000;
  const timeoutMs = 60000;

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      logger.info(`[Gemini Structured] Attempt ${attempt + 1}/${retries} for [${feature}]`);

      const startTime = Date.now();
      let timeoutWarningLogged = false;

      const response = await Promise.race([
        model.generateContent(prompt, {
          generationConfig: {
            responseSchema: schema,
            responseMimeType: 'application/json',
          },
        }),
        new Promise((_, reject) => {
          setTimeout(() => {
            reject(new Error('Gemini request timeout after 60s'));
          }, timeoutMs);

          setTimeout(() => {
            if (!timeoutWarningLogged) {
              timeoutWarningLogged = true;
              logger.warn('[Gemini Structured] Request approaching timeout (50s elapsed)...');
            }
          }, 50000);
        }),
      ]);

      logger.info('[Gemini Structured] Received response from Gemini API');

      // Detailed logging of response structure
      if (!response) {
        throw new Error('Response object is null or undefined');
      }
      logger.debug(`[Gemini Structured] Response object keys: ${Object.keys(response).join(', ')}`);

      if (!response.response) {
        throw new Error('Response.response is null or undefined');
      }
      logger.debug(`[Gemini Structured] Response.response keys: ${Object.keys(response.response).join(', ')}`);

      // Check candidates array
      const candidates = response.response.candidates;
      if (!candidates || !Array.isArray(candidates)) {
        throw new Error('Response.response.candidates is not an array');
      }
      logger.info(`[Gemini Structured] Found ${candidates.length} candidate(s)`);

      if (candidates.length === 0) {
        throw new Error('No candidates returned from Gemini API');
      }

      const firstCandidate = candidates[0];
      logger.debug(`[Gemini Structured] First candidate keys: ${Object.keys(firstCandidate).join(', ')}`);

      // Check content
      const content = firstCandidate.content;
      if (!content) {
        throw new Error('Candidate content is null or undefined');
      }
      logger.debug(`[Gemini Structured] Content keys: ${Object.keys(content).join(', ')}`);

      // Check parts array
      const parts = content.parts;
      if (!parts || !Array.isArray(parts)) {
        throw new Error('Content.parts is not an array');
      }
      logger.info(`[Gemini Structured] Found ${parts.length} part(s) in content`);

      if (parts.length === 0) {
        throw new Error('No parts found in content');
      }

      const firstPart = parts[0];
      logger.debug(`[Gemini Structured] First part keys: ${Object.keys(firstPart).join(', ')}`);

      // Extract text from part
      let responseText;
      if (firstPart.text) {
        responseText = firstPart.text;
        logger.info('[Gemini Structured] Extracted text from part.text');
      } else if (firstPart.functionCall) {
        responseText = JSON.stringify(firstPart.functionCall);
        logger.info('[Gemini Structured] Extracted text from part.functionCall');
      } else {
        logger.error(`[Gemini Structured] First part structure: ${JSON.stringify(firstPart).substring(0, 300)}`);
        throw new Error('No text or functionCall found in response part');
      }

      logger.debug(`[Gemini Structured] Raw response text (first 300 chars): ${responseText.substring(0, 300)}`);

      // Parse JSON from response
      let parsedResponse;
      try {
        parsedResponse = extractAndParseJSON(responseText);
      } catch (parseError) {
        logger.error(`[Gemini Structured] JSON parsing failed: ${parseError.message}`);
        throw parseError;
      }

      const elapsedTime = ((Date.now() - startTime) / 1000).toFixed(1);
      logger.info(`[Gemini Structured] Successfully completed structured request in ${elapsedTime}s`);
      logger.debug(`[Gemini Structured] Parsed response keys: ${Object.keys(parsedResponse).join(', ')}`);

      return parsedResponse;
    } catch (error) {
      lastError = error;
      logger.error(`[Gemini Structured] Error on attempt ${attempt + 1}/${retries}: ${error.message}`);
      logger.error(`[Gemini Structured] Full error stack: ${error.stack}`);

      if (error.message?.includes('schema') || error.message?.includes('Schema')) {
        throw new Error('Failed to parse AI response: Schema validation failed');
      }

      if (error.message?.includes('parse') || error.message?.includes('JSON')) {
        throw error; // Re-throw parsing errors as-is
      }

      if (
        error.status === 401 ||
        error.message?.includes('API key') ||
        error.message?.includes('authentication')
      ) {
        throw new Error('Failed to parse AI response: Gemini API authentication failed');
      }

      if (error.message?.includes('timeout') || error.message?.includes('ETIMEDOUT')) {
        if (attempt < retries - 1) {
          logger.warn(`[Gemini Structured] Timeout on attempt ${attempt + 1}, retrying...`);
          await new Promise((resolve) => setTimeout(resolve, delay));
          delay *= 2;
          continue;
        }
      }

      if (error.status === 429) {
        if (attempt < retries - 1) {
          logger.warn(`[Gemini Structured] Rate limited on attempt ${attempt + 1}, retrying...`);
          await new Promise((resolve) => setTimeout(resolve, delay));
          delay *= 2;
          continue;
        }
      }

      if (attempt < retries - 1) {
        logger.warn(`[Gemini Structured] Retrying after error on attempt ${attempt + 1}...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        delay *= 2;
        continue;
      }
    }
  }

  logger.error(`[Gemini Structured] All ${retries} attempts failed for [${feature}]`);
  throw new Error('Failed to parse AI response: Gemini API is currently slow. Please try again in a moment.');
}

/**
 * Parse JSON from Gemini response text
 * Handles markdown code blocks and extracts valid JSON
 */
export function parseGeminiJSON(text) {
  return extractAndParseJSON(text);
}
