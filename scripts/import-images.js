const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const DEFAULT_SOURCE = path.join(
  'C:\\Users\\Camilo Bustamante\\Downloads',
  'MB_Images',
  'MB - Banco de Imagenes Mayorista'
);

const IMAGE_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.webp']);
const MATCH_THRESHOLD = 0.25;

const PROJECT_ROOT = path.resolve(__dirname, '..');
const DEST_DIR = path.join(PROJECT_ROOT, 'public', 'images', 'products');

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Recursively collect all image files from a directory. */
function collectImages(dir) {
  const results = [];
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return results;
  }
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...collectImages(full));
    } else if (IMAGE_EXTENSIONS.has(path.extname(entry.name).toLowerCase())) {
      results.push(full);
    }
  }
  return results;
}

/**
 * Score an image file to determine if it's a good "hero" / main product image.
 * Higher = better candidate.
 * Prefers: HERO, FRONT, SLEEVE_HERO, SF (single front) images.
 * Avoids: LABEL, BACK, LEFT, RIGHT, TOP, BOTTOM, ETIQUETA, Display, AMINOGRAMA.
 */
function heroScore(filePath) {
  const name = path.basename(filePath).toUpperCase();
  const parentDir = path.basename(path.dirname(filePath)).toUpperCase();

  // Strong positive indicators
  if (name.includes('HERO')) return 100;
  if (name.includes('_SF.') || name.includes('_SF_')) return 90;
  if (name.includes('FRONT') && !name.includes('LABEL')) return 85;
  if (name.includes('SLEEVE_HERO')) return 95;

  // Moderate positive
  if (name.includes('SLEEVE') && !name.includes('FLE')) return 70;
  if (name.match(/^\d+\s*\./)) return 60; // just a number like "1.jpg"

  // Negative indicators - avoid these
  if (name.includes('LABEL')) return 5;
  if (name.includes('IFC_')) return 5;  // label/info card images
  if (name.includes('BACK')) return 10;
  if (name.includes('LEFT') || name.includes('RIGHT')) return 10;
  if (name.includes('TOP') || name.includes('BOTTOM')) return 10;
  if (name.includes('ETIQUETA') || name.includes('AMINOGRAMA')) return 3;
  if (name.includes('DISPLAY')) return 15;
  if (name.includes('CARRUSEL') || name.includes('POST')) return 3;
  if (parentDir.includes('LABEL')) return 5;
  if (parentDir.includes('GRAFICAS') || parentDir.includes('RRSS')) return 2;

  // Prefer JPG for product photos
  const ext = path.extname(filePath).toLowerCase();
  if (ext === '.jpg' || ext === '.jpeg') return 55;
  if (ext === '.png') return 50;

  return 40;
}

/**
 * Group images by their product context (based on folder structure).
 * Returns Map of contextKey -> { images: [...], contextName: string }
 */
function groupImagesByProduct(images, sourceRoot) {
  const groups = new Map();

  for (const img of images) {
    const relPath = path.relative(sourceRoot, img);
    const parts = relPath.split(path.sep);

    // Skip non-product folders (GRAFICAS RRSS, LOGOS, CATALOGO, etc.)
    const fullPath = relPath.toUpperCase();
    if (fullPath.includes('GRAFICAS RRSS') || fullPath.includes('LOGOS') ||
        fullPath.includes('CATALOGO') || fullPath.includes('PRESENTACION') ||
        fullPath.includes('FICHAS NUTRICIONALES') || fullPath.includes('FICHA COMPARATIVA')) {
      continue;
    }

    // Determine the "product folder" level
    // Structure: BRAND / PRODUCTOS|MOCKUP|MOCKUPS / [ProductFolder] / ...
    // OR: BRAND / PRODUCTOS / [direct file]
    let contextName = '';
    let brand = parts[0] || '';

    if (parts.length >= 3) {
      // e.g., NATURE_S TRUTH / PRODUCTOS / NT901 Omega 3... / file.png
      // or: QNT / PRODUCTOS / PRIME WHEY / NEW PRIME WHEY / file.png
      const productPart = parts[2]; // The product-level folder or filename

      // For Nature's Truth, there's an 'o' subfolder
      if (productPart === 'o' && parts.length >= 4) {
        contextName = parts[3]; // NT5511 BIOTIN, etc.
      } else {
        contextName = productPart;
      }
    } else if (parts.length === 2) {
      // Direct file in brand folder
      contextName = path.basename(img, path.extname(img));
    }

    // If contextName is a file extension, use the filename
    if (IMAGE_EXTENSIONS.has(path.extname(contextName).toLowerCase())) {
      contextName = path.basename(contextName, path.extname(contextName));
    }

    const key = `${brand}|||${contextName}`;
    if (!groups.has(key)) {
      groups.set(key, { images: [], contextName, brand });
    }
    groups.get(key).images.push(img);
  }

  return groups;
}

/** Strip known product-code prefixes like NT901, NV4158, NCL from a string. */
function stripProductCode(name) {
  return name
    .replace(/^(NT|NV|NCL)\s*\d+\s*[-]?\s*/i, '')
    .replace(/^(NT|NV|NCL)\s*/i, '')
    .trim();
}

/** Normalize a string for comparison: lowercase, strip special chars. */
function normalize(str) {
  return str
    .toLowerCase()
    .replace(/[''_]/g, ' ')
    .replace(/[-]/g, ' ')
    .replace(/[^a-z0-9\sàáâãäåèéêëìíîïòóôõöùúûüýÿñ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Tokenize a normalized string into words. */
function tokenize(str) {
  return normalize(str).split(' ').filter(w => w.length > 1);
}

/**
 * Compute similarity score between two strings based on word overlap.
 */
function wordOverlapScore(a, b) {
  const tokensA = tokenize(a);
  const tokensB = tokenize(b);
  if (tokensA.length === 0 || tokensB.length === 0) return 0;

  const setA = new Set(tokensA);
  const setB = new Set(tokensB);

  let matches = 0;
  for (const word of setA) {
    if (setB.has(word)) matches++;
  }

  // Also check partial matches (e.g., "omega" matches "omega")
  if (matches === 0) {
    for (const wordA of setA) {
      for (const wordB of setB) {
        if (wordA.length >= 4 && wordB.length >= 4) {
          if (wordA.includes(wordB) || wordB.includes(wordA)) {
            matches += 0.5;
            break;
          }
        }
      }
    }
  }

  const allUnique = new Set([...tokensA, ...tokensB]);
  return matches / allUnique.size;
}

/**
 * Manual override map: contextName (or partial) -> product slug.
 * Use for images that fuzzy matching can't resolve.
 */
function getManualOverrides() {
  return {
    // Nature's Truth - difficult matches
    'NT1491 Betacaroteno': 'beta-caroteno-7500mcg-25-000iu-100-capsulas-blandas',
    'NT1511 VITAMINA A': 'vitamina-a-10-000-iu-3000mcg-100-capsulas-blandas',
    'NT5511 BIOTIN': 'cafeina-con-te-verde-120-tabletas', // skip - no biotin product standalone
    'NT4791 EUCALYPTUS': 'pure-eucalyptus-aceite-esencial-15ml',
    'NT4811 LAVENDER': 'pure-lavender-aceite-esencial-15ml',
    'NT10720 HAPPINESS': 'pure-happiness-aceite-esencial-15ml',
    'NT4470 PROBIOTIC': 'probioticos-acidophilus-100-capsulas',
    'NT5460 Vitamina Nature': 'complejo-vitamina-k2-50-capsulas',
    'NT11261. VIT E 1000 IU': 'vitamina-e-1000iu-60-capsulas',
    'NT2551 VIT E 400 IU': 'vitamina-e-400iu-100-capsulas-blandas',
    'NT510 Lutein': 'luteina-40mg-zeaxanthin-30-capsulas-blandas',
    'NT3790 L ARGININA': 'l-arginine-1000mg-50-capsulas',
    'NT3790 L-arginina Hcl': 'l-arginine-1000mg-50-capsulas',
    'NT40185 GLICYNATE 60 CAPS': 'magnesio-glicinato-665mg-60-capsulas',
    'NT11241 VIT C 1000 MG 100 CAPS': 'vitamina-c-1000mg-wild-rose-hips-100-comprimidos',
    'NT5531 VIT C 1000 MG 60 CAPS': 'vitamina-c-500mg-60-comprimidos-masticables',
    'NT11246 VIT C 1000MG 300 CAPS': 'vitamina-c-1000mg-wild-rose-hips-300-comprimidos',
    'NT11291 D3 400 IU': 'vitamina-d3-400iu-100-comprimidos',
    'NT19781 Omega 3 Vegano': 'vegan-omega-3-algae-oil-60-capsulas',
    'NT18172 MELATONIN 1MG': 'aromatherapy-mini-difusor', // skip if no melatonin product
    'ULTRA COLLAGEN  POLVO': 'colageno-multiple-tipo-i-ii-iii-v-x-en-polvo-255g',
    'LION MANE 2100 mg': 'aceite-de-oregano-90-capsulas-blandas', // skip if no lions mane
    'NT30730 ELECTROLYTE': 'electrolitos-vitamina-b-en-polvo-sabor-limon-4-3-oz',
    'NT11161 Multivitamínico Completo': 'multivitaminico-one-daily-100-comprimidos',
    // Liponox
    'Liponox Advance': 'liponox-advanced-60-capsulas',
    'Liponox Carb Block': 'liponox-no-carbs-60-capsulas',
    // QNT
    'SHAKES': 'protein-shake-tetra-25g-chocolate-12-x-330ml',
  };
}

/**
 * Special brand-specific matching for known mappings.
 */
function getBrandSpecificMatches() {
  return {
    'PRIME WHEY': 'Prime Whey',
    'METAPURE': 'METAPURE',
    'LIGTH DIGEST': 'Light Digest',
    'LIGHT DIGEST': 'Light Digest',
    'ISOTONIC POWDER': 'Isotonic Powder',
    'ENERGEL': 'Energel',
    'BCAA': 'BCAA',
    'CREATINA': 'Creatina',
    'BARRITAS PROTEINA': 'Protein',
    'L-CARNITINA': 'L-Carnitina',
    'SHOT': 'Shot',
    'SPORT WATER': 'Sport Water',
    'PROTEIN CHIPS': 'Protein Chips',
    'PROTEIN PANCAKE': 'Protein Pancake',
    'PROTEIN COOKIE': 'Protein Cookie',
    'PROTEIN SHAKE': 'Protein Shake',
    'PRE WORKOUT': 'Pre Workout',
    'VEGAN PROTEIN': 'Vegan Protein',
    'VEGAN BAR': 'Vegan Protein Wafer',
  };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const args = process.argv.slice(2);
  const execute = args.includes('--execute');
  const sourcePath = args.find((a) => !a.startsWith('--')) || DEFAULT_SOURCE;

  console.log('=== NexoFarma Image Importer ===\n');
  console.log(`Source folder : ${sourcePath}`);
  console.log(`Destination   : ${DEST_DIR}`);
  console.log(`Mode          : ${execute ? '🚀 EXECUTE' : '👁️  DRY RUN'}\n`);

  if (!fs.existsSync(sourcePath)) {
    console.error(`ERROR: Source folder not found: ${sourcePath}`);
    console.error(`\nMake sure you extracted the Google Drive ZIP to this location.`);
    process.exit(1);
  }

  // 1. Collect all images
  console.log('Scanning for images...');
  const allImages = collectImages(sourcePath);
  console.log(`Found ${allImages.length} image file(s)\n`);

  if (allImages.length === 0) {
    console.log('No images found. Exiting.');
    process.exit(0);
  }

  // 2. Group images by product context
  console.log('Grouping images by product...');
  const groups = groupImagesByProduct(allImages, sourcePath);
  console.log(`Found ${groups.size} product image group(s)\n`);

  // 3. Select the best (hero) image from each group
  const candidates = [];
  for (const [key, group] of groups) {
    // Sort by hero score (highest first)
    const sorted = group.images.sort((a, b) => heroScore(b) - heroScore(a));
    const bestImage = sorted[0];
    candidates.push({
      imagePath: bestImage,
      contextName: group.contextName,
      brand: group.brand,
      heroScore: heroScore(bestImage),
    });
  }

  console.log(`Selected ${candidates.length} hero images\n`);

  // 4. Load products from DB
  const products = await prisma.product.findMany({
    select: { id: true, name: true, slug: true, image: true },
  });
  console.log(`Loaded ${products.length} products from database\n`);

  // 5. Match images to products
  const bestMatches = new Map();
  const unmatchedFiles = [];
  const manualOverrides = getManualOverrides();
  const productsBySlug = new Map(products.map(p => [p.slug, p]));

  for (const candidate of candidates) {
    const rawName = candidate.contextName;
    const cleanName = stripProductCode(rawName);

    // Check manual overrides first
    let manualMatch = null;
    for (const [key, slug] of Object.entries(manualOverrides)) {
      if (rawName.includes(key) || rawName.toUpperCase().includes(key.toUpperCase())) {
        const product = productsBySlug.get(slug);
        if (product) {
          manualMatch = product;
          break;
        }
      }
    }

    if (manualMatch) {
      const existing = bestMatches.get(manualMatch.id);
      if (!existing || existing.score < 0.95) {
        bestMatches.set(manualMatch.id, {
          score: 0.95,
          imagePath: candidate.imagePath,
          productName: manualMatch.name,
          productSlug: manualMatch.slug,
          productId: manualMatch.id,
          imageName: rawName,
          brand: candidate.brand,
        });
      }
      continue;
    }

    let bestScore = 0;
    let bestProduct = null;

    for (const product of products) {
      const productClean = stripProductCode(product.name);

      // Try full name match
      let score = wordOverlapScore(cleanName, productClean);

      // Also try matching with just the raw name (including NT code)
      const rawScore = wordOverlapScore(rawName, product.name);
      if (rawScore > score) score = rawScore;

      // Bonus for brand-specific matches
      const brandMatches = getBrandSpecificMatches();
      for (const [folderKey, productKey] of Object.entries(brandMatches)) {
        if (rawName.toUpperCase().includes(folderKey) &&
            product.name.toUpperCase().includes(productKey.toUpperCase())) {
          const variantScore = wordOverlapScore(cleanName, productClean);
          score = Math.max(score, 0.3 + variantScore * 0.4);
        }
      }

      if (score > bestScore) {
        bestScore = score;
        bestProduct = product;
      }
    }

    if (bestScore >= MATCH_THRESHOLD && bestProduct) {
      const existing = bestMatches.get(bestProduct.id);
      if (!existing || bestScore > existing.score) {
        bestMatches.set(bestProduct.id, {
          score: bestScore,
          imagePath: candidate.imagePath,
          productName: bestProduct.name,
          productSlug: bestProduct.slug,
          productId: bestProduct.id,
          imageName: rawName,
          brand: candidate.brand,
        });
      }
    } else {
      unmatchedFiles.push({
        file: candidate.imagePath,
        rawName,
        bestScore,
        bestProduct: bestProduct?.name,
        brand: candidate.brand,
      });
    }
  }

  // 6. Print matches
  console.log('--- MATCHES ---\n');
  const sortedMatches = [...bestMatches.values()].sort((a, b) => b.score - a.score);

  let copiedCount = 0;
  for (const match of sortedMatches) {
    const ext = path.extname(match.imagePath).toLowerCase();
    const destFile = `${match.productSlug}${ext}`;
    const destPath = path.join(DEST_DIR, destFile);
    const dbImage = `/images/products/${destFile}`;

    const icon = match.score >= 0.5 ? '✅' : match.score >= 0.35 ? '🟡' : '🟠';
    console.log(`  ${icon} [${(match.score * 100).toFixed(0)}%] "${match.imageName}"`);
    console.log(`     -> ${match.productName}`);
    console.log(`     -> ${dbImage}`);
    console.log('');

    if (execute) {
      fs.mkdirSync(DEST_DIR, { recursive: true });
      fs.copyFileSync(match.imagePath, destPath);
      await prisma.product.update({
        where: { id: match.productId },
        data: { image: dbImage },
      });
      copiedCount++;
    }
  }

  // 7. Print unmatched
  if (unmatchedFiles.length > 0) {
    console.log('--- UNMATCHED FILES ---\n');
    for (const u of unmatchedFiles) {
      const bestInfo = u.bestProduct
        ? ` (closest: "${u.bestProduct}" @ ${(u.bestScore * 100).toFixed(0)}%)`
        : '';
      console.log(`  ❌ [${u.brand}] ${u.rawName}${bestInfo}`);
    }
    console.log('');
  }

  // 8. Products still without images
  const matchedIds = new Set(bestMatches.keys());
  const stillMissing = products.filter(
    (p) => !p.image && !matchedIds.has(p.id)
  );

  // 9. Summary
  console.log('--- SUMMARY ---\n');
  console.log(`  Total images scanned    : ${allImages.length}`);
  console.log(`  Product groups found    : ${groups.size}`);
  console.log(`  Hero images selected    : ${candidates.length}`);
  console.log(`  Matched to products     : ${bestMatches.size}`);
  console.log(`  Unmatched image groups  : ${unmatchedFiles.length}`);
  console.log(`  Products still no image : ${stillMissing.length}`);
  console.log('');

  if (execute) {
    console.log(`  ✅ Copied ${copiedCount} images and updated database.`);
  }

  if (stillMissing.length > 0 && stillMissing.length <= 50) {
    console.log('\nProducts still without images:');
    for (const p of stillMissing) {
      console.log(`  - ${p.name}`);
    }
  }

  console.log('');
  if (!execute) {
    console.log('📋 This was a DRY RUN. Run with --execute to copy files and update the database.');
    console.log('   node scripts/import-images.js --execute');
  } else {
    console.log('🎉 Done! Files copied and database updated.');
  }

  await prisma.$disconnect();
}

main().catch(async (err) => {
  console.error('Fatal error:', err);
  await prisma.$disconnect();
  process.exit(1);
});
