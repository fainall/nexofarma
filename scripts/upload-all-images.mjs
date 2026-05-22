/**
 * Sube TODAS las imágenes locales al servidor via cPanel Fileman API
 * Reemplaza las imágenes incorrectas del servidor con las correctas locales
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Config
const CPANEL_BASE = 'https://blue171.dnsmisitio.net:2083/cpsess5186383373';
const REMOTE_DIR = '/home/kitpanel/public_html/nexofarma.cl/images/products';
const REMOTE_SRC_DIR = '/home/kitpanel/nexofarma.cl/public/images/products';
const LOCAL_DIR = path.join(__dirname, '..', 'public', 'images', 'products');

// Get all image files from local directory
const allFiles = fs.readdirSync(LOCAL_DIR).filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f));
console.log(`Total local images: ${allFiles.length}`);

async function uploadFile(localPath, remoteDir, filename) {
  const fileData = fs.readFileSync(localPath);
  const base64 = fileData.toString('base64');

  const formData = new URLSearchParams();
  formData.append('dir', remoteDir);
  formData.append('file', filename);
  formData.append('content', base64);
  formData.append('charset', 'base64');

  const res = await fetch(`${CPANEL_BASE}/execute/Fileman/save_file_content`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData.toString(),
  });

  const result = await res.json();
  return result.status === 1;
}

async function main() {
  let uploaded = 0;
  let failed = 0;
  let skipped = 0;

  for (let i = 0; i < allFiles.length; i++) {
    const filename = allFiles[i];
    const localPath = path.join(LOCAL_DIR, filename);
    const sizeKB = (fs.statSync(localPath).size / 1024).toFixed(0);

    // Skip files larger than 1MB (cPanel API limit for base64)
    if (fs.statSync(localPath).size > 1024 * 1024) {
      console.log(`[${i+1}/${allFiles.length}] SKIP (too large ${sizeKB}KB): ${filename}`);
      skipped++;
      continue;
    }

    process.stdout.write(`[${i+1}/${allFiles.length}] ${filename} (${sizeKB}KB)...`);

    try {
      // Upload to both directories
      const ok1 = await uploadFile(localPath, REMOTE_DIR, filename);
      const ok2 = await uploadFile(localPath, REMOTE_SRC_DIR, filename);

      if (ok1 && ok2) {
        console.log(' ✓');
        uploaded++;
      } else {
        console.log(` ✗ (docroot:${ok1}, src:${ok2})`);
        failed++;
      }
    } catch (err) {
      console.log(` ✗ ${err.message}`);
      failed++;
    }

    // Rate limit every 5 files
    if (i % 5 === 4) await new Promise(r => setTimeout(r, 300));
  }

  console.log(`\n${'='.repeat(50)}`);
  console.log(`Uploaded: ${uploaded}/${allFiles.length}`);
  console.log(`Failed: ${failed}`);
  console.log(`Skipped: ${skipped}`);
}

main().catch(console.error);
