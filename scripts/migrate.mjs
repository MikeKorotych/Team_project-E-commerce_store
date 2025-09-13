import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

// --- CONFIGURATION ---
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY; // Use the powerful service role key for migration
const SOURCE_DIR = 'api';
const IMAGE_BUCKET_NAME = 'product-images'; // IMPORTANT: Make sure this bucket exists in your Supabase project

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  throw new Error('Supabase URL or Key is missing in your .env file');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// --- HELPER FUNCTIONS ---

/**
 * Reads and parses a JSON file.
 * @param {string} filePath - Path to the JSON file.
 * @returns {object[]}
 */
function readJsonFile(filePath) {
  console.log(`Reading ${filePath}...`);
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(fileContent);
}

/**
 * Transforms product data for insertion.
 * @param {object[]} products - Array of products from the JSON file.
 * @param {string} category - The category of the products (e.g., 'phones').
 * @returns {object[]}
 */
function transformProducts(products, category) {
  const {
    data: { publicUrl },
  } = supabase.storage.from(IMAGE_BUCKET_NAME).getPublicUrl('');

  return products.map((product) => ({
    ...product,
    category, // Add the category field
    // Transform image paths to full Supabase URLs
    images: product.images.map((imgPath) => `${publicUrl}/${imgPath}`),
    // The 'description' field is already in a valid JSONB format
  }));
}

/**
 * Inserts data into a Supabase table.
 * @param {string} table - The name of the table.
 * @param {object[]} data - The data to insert.
 */
async function insertData(table, data) {
  console.log(`Inserting ${data.length} items into "${table}"...`);

  // Supabase has a limit on how many records can be inserted at once.
  // We'll process in chunks of 500.
  const chunkSize = 500;
  for (let i = 0; i < data.length; i += chunkSize) {
    const chunk = data.slice(i, i + chunkSize);
    const { error } = await supabase.from(table).insert(chunk);
    if (error) {
      console.error(`Error inserting chunk ${i / chunkSize + 1}:`, error);
      throw new Error('Failed to insert data.');
    } else {
      console.log(`Chunk ${i / chunkSize + 1} inserted successfully.`);
    }
  }
}

// --- MAIN EXECUTION ---

async function migrate() {
  try {
    console.log('Starting data migration...');

    const categories = ['phones', 'tablets', 'accessories'];

    for (const category of categories) {
      const fileName = `${category}.json`;
      const filePath = path.join(process.cwd(), SOURCE_DIR, fileName);

      if (fs.existsSync(filePath)) {
        const products = readJsonFile(filePath);
        const transformedData = transformProducts(products, category);
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
