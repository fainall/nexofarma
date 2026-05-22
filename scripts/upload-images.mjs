/**
 * Sube las imágenes nuevas al servidor via cPanel Fileman API
 * y actualiza la BD de producción via API de productos
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Config
const CPANEL_BASE = 'https://blue171.dnsmisitio.net:2083/cpsess5186383373';
const REMOTE_DIR = '/home/kitpanel/public_html/nexofarma.cl/images/products';
const REMOTE_SRC_DIR = '/home/kitpanel/nexofarma.cl/public/images/products';
const SITE_URL = 'https://nexofarma.cl';
const LOCAL_DIR = path.join(__dirname, '..', 'public', 'images', 'products');

// Read download results to know which files are new
const results = JSON.parse(fs.readFileSync(path.join(__dirname, 'download-results.json'), 'utf8'));
const newFiles = results.downloaded.map(d => d.file);

console.log(`Files to upload: ${newFiles.length}`);

// Get cookie from browser - we'll pass it as arg
const cookie = process.argv[2];
if (!cookie) {
  console.log('Usage: node upload-images.mjs <cPanel-cookie>');
  console.log('Get cookie from browser DevTools');
  process.exit(1);
}

async function uploadFile(localPath, remoteDir, filename) {
  const fileData = fs.readFileSync(localPath);
  const base64 = fileData.toString('base64');

  // Use Fileman save_file_content with binary
  const formData = new URLSearchParams();
  formData.append('dir', remoteDir);
  formData.append('file', filename);
  formData.append('content', base64);
  formData.append('charset', 'base64');

  const res = await fetch(`${CPANEL_BASE}/execute/Fileman/save_file_content`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cookie': cookie,
    },
    body: formData.toString(),
  });

  const result = await res.json();
  return result.status === 1;
}

async function main() {
  let uploaded = 0;
  let failed = 0;
  const uploadedFiles = [];

  for (let i = 0; i < newFiles.length; i++) {
    const filename = newFiles[i];
    const localPath = path.join(LOCAL_DIR, filename);

    if (!fs.existsSync(localPath)) {
      console.log(`[${i+1}/${newFiles.length}] ✗ Not found: ${filename}`);
      failed++;
      continue;
    }

    const sizeKB = (fs.statSync(localPath).size / 1024).toFixed(0);
    process.stdout.write(`[${i+1}/${newFiles.length}] Uploading ${filename} (${sizeKB}KB)...`);

    try {
      // Upload to both doc root and source dir
      const ok1 = await uploadFile(localPath, REMOTE_DIR, filename);
      const ok2 = await uploadFile(localPath, REMOTE_SRC_DIR, filename);

      if (ok1 && ok2) {
        console.log(' ✓');
        uploaded++;
        uploadedFiles.push(filename);
      } else {
        console.log(' ✗ API error');
        failed++;
      }
    } catch (err) {
      console.log(` ✗ ${err.message}`);
      failed++;
    }

    // Rate limit
    if (i % 10 === 9) await new Promise(r => setTimeout(r, 500));
  }

  console.log(`\n${'='.repeat(50)}`);
  console.log(`Uploaded: ${uploaded}/${newFiles.length}`);
  console.log(`Failed: ${failed}/${newFiles.length}`);

  // Now update production DB - set image paths for products
  if (uploaded > 0) {
    console.log(`\nUpdating production database...`);

    // Get all products
    const res = await fetch(`${SITE_URL}/api/products?limit=200`);
    const products = await res.json();
    let dbUpdated = 0;

    for (const product of products) {
      if (product.image) continue; // already has image

      // Find matching image file
      const matchingFile = uploadedFiles.find(f => {
        const slug = f.replace(/\.(jpg|jpeg|png|webp)$/, '');
        return slug === product.slug;
      });

      if (matchingFile) {
        const imagePath = `/images/products/${matchingFile}`;
        try {
          await fetch(`${SITE_URL}/api/products/${product.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image: imagePath }),
          });
          dbUpdated++;
          process.stdout.write(`  DB: ${product.slug} → ${imagePath}\n`);
        } catch (err) {
          console.log(`  DB error: ${product.slug}: ${err.message}`);
        }
      }
    }

    console.log(`\nDB updated: ${dbUpdated} products`);
  }
}

main().catch(console.error);
