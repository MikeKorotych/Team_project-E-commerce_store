import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

// --- CONFIGURATION ---
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
const SOURCE_DIR = 'api';
const ENRICHMENT_FILE = 'api/products.json'; // File with the 'year' data
const IMAGE_BUCKET_NAME = 'product-images';

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  throw new Error('Supabase URL or Key is missing in your .env file');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// --- HELPER FUNCTIONS ---

function readJsonFile(filePath) {
  console.log(`Reading ${filePath}...`);
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(fileContent);
}

/**
 * Transforms product data for insertion by enriching it with the year.
 * @param {object[]} products - Array of products from the JSON file (e.g., phones.json).
 * @param {string} category - The category of the products.
 * @param {Map<string, number>} yearMap - A map from itemId to year.
 * @returns {object[]}
 */
function transformProducts(products, category, yearMap) {
  const {
    data: { publicUrl },
  } = supabase.storage.from(IMAGE_BUCKET_NAME).getPublicUrl('');

  return products.map((product) => {
    // Get the year from the map using the product's id.
    // The key in products.json is 'itemId', but in phones.json it's 'id'.
    const year = yearMap.get(product.id);

    return {
      ...product, // Keep all original fields like 'id', 'priceRegular', etc.
      year,       // Add the enriched year
      category,
      // Transform image paths to full Supabase URLs
      images: product.images.map((imgPath) => `${publicUrl}/${imgPath}`),
    };
  });
}

async function insertData(table, data) {
  console.log(`Inserting ${data.length} items into "${table}"...`);

  const chunkSize = 500;
  for (let i = 0; i < data.length; i += chunkSize) {
    const chunk = data.slice(i, i + chunkSize);
    const { error } = await supabase.from(table).insert(chunk);
    if (error) {
      console.error(`Error inserting chunk ${Math.floor(i / chunkSize) + 1}:`, error);
      throw new Error('Failed to insert data.');
    } else {
      console.log(`Chunk ${Math.floor(i / chunkSize) + 1} inserted successfully.`);
    }
  }
}

// --- MAIN EXECUTION ---

async function migrate() {
  try {
    console.log('Starting data migration with year enrichment...');

    const enrichmentFilePath = path.join(process.cwd(), ENRICHMENT_FILE);
    if (!fs.existsSync(enrichmentFilePath)) {
      throw new Error(`Enrichment file not found: ${ENRICHMENT_FILE}`);
    }
    const productsForYear = readJsonFile(enrichmentFilePath);
    // The map key should be 'itemId' from products.json
    const yearMap = new Map(productsForYear.map(p => [p.itemId, p.year]));

    console.log(`Created a lookup map with ${yearMap.size} year entries.`);

    const categories = ['phones', 'tablets', 'accessories'];

    for (const category of categories) {
      const fileName = `${category}.json`;
      const filePath = path.join(process.cwd(), SOURCE_DIR, fileName);

      if (fs.existsSync(filePath)) {
        const products = readJsonFile(filePath);
        console.log(`Transforming ${products.length} products for category: ${category}`);
        const transformedData = transformProducts(products, category, yearMap);
        await insertData('products', transformedData);
      } else {
        console.warn(`Warning: ${filePath} not found. Skipping.`);
      }
    }

    console.log('---');
    console.log('✅ Data migration completed successfully!');
    console.log('---');
  } catch (error) {
    console.error('\n❌ Migration failed:');
    console.error(error.message);
    process.exit(1);
  }
}

migrate();