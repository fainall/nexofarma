/**
 * Descarga imágenes de productos desde Bing Images
 * Uso: node scripts/download-images.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PRODUCTS_DIR = path.join(__dirname, '..', 'public', 'images', 'products');

// Mapeo marca → término de búsqueda expandido
const brandMap = {
  'NCL': 'NeoCell',
  'NV': 'Natural Vitality',
  'QNT': 'QNT sport nutrition',
  'METAPURE': 'QNT Metapure',
};

// Lista completa de productos sin imagen con queries de búsqueda optimizadas
const products = [
  // Accesorios Deportivos
  { slug: "pulsera-led-running-color-fucsia", search: "pulsera LED running deportiva fucsia pink sport bracelet" },
  { slug: "pulsera-led-running-color-verde", search: "pulsera LED running deportiva verde green sport bracelet" },
  { slug: "pulsera-led-running-color-amarillo", search: "pulsera LED running deportiva amarillo yellow sport bracelet" },
  { slug: "pulsera-led-running-color-rojo", search: "pulsera LED running deportiva rojo red sport bracelet" },

  // NeoCell (NCL)
  { slug: "ncl-collagen-peptides-20-oz-en-polvo-teal-567-gr", search: "NeoCell Super Collagen Peptides powder 20oz 567g" },
  { slug: "ncl-collagen-peptides-10-oz-en-polvo-teal-283-gr", search: "NeoCell Super Collagen Peptides powder 10oz 283g" },
  { slug: "ncl-collagen-liquid-pomegranate-16oz-liquid-473-ml", search: "NeoCell Collagen +C Pomegranate Liquid 16oz" },
  { slug: "ncl-super-collagen-peptides-stick-packs-20-stick-packs-en-polvo", search: "NeoCell Super Collagen Peptides Stick Packs 20" },

  // Natural Vitality (NV)
  { slug: "nv-calm-original-sin-sabor-en-polvo-227-gr", search: "Natural Vitality Calm Original unflavored powder 8oz" },
  { slug: "nv-calm-magnesium-en-capsulas-120-veggie-caps", search: "Natural Vitality Calm capsules 120 veggie caps" },
  { slug: "nv-calm-raspberry-lemon-en-polvo-227-gr", search: "Natural Vitality Calm Raspberry Lemon powder 8oz" },

  // Cuidado Personal - Aceites esenciales
  { slug: "wood-look-difusor", search: "wood look essential oil diffuser aromatherapy" },
  { slug: "pure-peace-aceite-esencial-15ml", search: "GuruNanda peace essential oil blend 15ml" },
  { slug: "pure-breathe-easy-aceite-esencial-15ml", search: "GuruNanda breathe easy essential oil 15ml" },
  { slug: "pure-good-nite-aceite-esencial-15ml", search: "GuruNanda good night essential oil 15ml" },
  { slug: "pure-calming-aceite-esencial-15ml", search: "GuruNanda calming essential oil lavender 15ml" },

  // Vitaminas y Suplementos sueltos
  { slug: "complejo-triple-magnesio-100-capsulas", search: "triple magnesium complex 100 capsules Nature's Truth" },
  { slug: "colageno-biotina-liquido-237ml", search: "liquid collagen biotin supplement bottle" },
  { slug: "omega-3-fish-oil-2000mg-250-capsulas-blandas", search: "Nature's Truth omega 3 fish oil 2000mg 250 softgels" },
  { slug: "calcio-magnesio-zinc-90-tabletas", search: "Nature's Truth calcium magnesium zinc 90 tablets" },
  { slug: "gomitas-de-vinagre-de-manzana-75-gomitas", search: "Nature's Truth apple cider vinegar gummies 75" },
  { slug: "magnesio-zinc", search: "magnesium zinc supplement capsules bottle" },
  { slug: "omega-3-fish-oil", search: "omega 3 fish oil supplement softgels bottle" },
  { slug: "vitamina-c-1000mg", search: "vitamin C 1000mg supplement tablets bottle" },

  // QNT Proteínas - Vegan
  { slug: "vegan-protein-zero-sugar-vainilla-macaroon-500g", search: "QNT Vegan Protein Zero Sugar Vanilla Macaroon 500g" },
  { slug: "vegan-protein-zero-sugar-chocolate-muffin-500g", search: "QNT Vegan Protein Zero Sugar Chocolate Muffin 500g" },

  // QNT Protein Pancake
  { slug: "protein-pancake-37-protein-apple-cinnamon-500g-16-servicios", search: "QNT Protein Pancake Apple Cinnamon 500g" },
  { slug: "protein-pancake-37-protein-banana-500g-16-servicios", search: "QNT Protein Pancake Banana 500g" },
  { slug: "protein-pancake-37-protein-blueberry-500g-16-servicios", search: "QNT Protein Pancake Blueberry 500g" },
  { slug: "protein-pancake-37-protein-chocolate-500g-16-servicios", search: "QNT Protein Pancake Chocolate 500g" },
  { slug: "protein-pancake-37-protein-sin-sabor-500g-16-servicios", search: "QNT Protein Pancake Unflavored 500g" },

  // QNT Whey Protein Light Digest sabores
  { slug: "whey-protein-light-digest-vainilla-500g", search: "QNT Whey Protein Light Digest Vanilla 500g" },
  { slug: "whey-protein-light-digest-chocolate-blanco-500g", search: "QNT Whey Protein Light Digest White Chocolate 500g" },
  { slug: "whey-protein-light-digest-pistacho-500g", search: "QNT Whey Protein Light Digest Pistachio 500g" },
  { slug: "whey-protein-light-digest-creme-brulee-500g", search: "QNT Whey Protein Light Digest Creme Brulee 500g" },
  { slug: "whey-protein-light-digest-coco-500g", search: "QNT Whey Protein Light Digest Coconut 500g" },
  { slug: "whey-protein-light-digest-chocolate-belga-500g", search: "QNT Whey Protein Light Digest Belgian Chocolate 500g" },

  // QNT Snacks
  { slug: "protein-snack-bar-caramel-peanut-nuevo-12-x-60g", search: "QNT protein snack bar caramel peanut 60g" },
  { slug: "36-protein-joy-bar-vainilla-12-x-60g", search: "QNT Protein Joy Bar Vanilla 60g" },
  { slug: "36-protein-joy-bar-chocolate-cookie-12-x-60g", search: "QNT Protein Joy Bar Chocolate Cookie 60g" },
  { slug: "36-protein-joy-bar-caramelo-12-x-60g", search: "QNT Protein Joy Bar Caramel 60g" },
  { slug: "28-protein-milkii-bar-coco-12-x-60g", search: "QNT Protein Milkii Bar Coconut 60g" },
  { slug: "oblea-32-protein-wafer-bar-vainilla-yoghurt-12-x-35g", search: "QNT Protein Wafer Bar Vanilla Yoghurt 35g" },
  { slug: "oblea-32-protein-wafer-bar-chocolate-belga-12-x-35g", search: "QNT Protein Wafer Bar Belgian Chocolate 35g" },
  { slug: "40-26g-protein-crunchy-bar-frutilla-12-x-65g", search: "QNT Protein Crunchy Bar Strawberry 65g" },
  { slug: "40-26g-protein-crunchy-bar-chocolate-12-x-65g", search: "QNT Protein Crunchy Bar Chocolate 65g" },

  // QNT Nutrición Deportiva - Bebidas
  { slug: "protein-water-raspberry-peach-330ml-nuevo-12-x-330ml", search: "QNT Protein Water Raspberry Peach 330ml" },
  { slug: "protein-water-lemon-ginger-330ml-nuevo-12-x-330ml", search: "QNT Protein Water Lemon Ginger 330ml" },
  { slug: "protein-shake-tetra-25g-vainilla-12-x-330ml", search: "QNT Protein Shake Tetra Vanilla 330ml" },
  { slug: "protein-shake-tetra-25g-frutilla-12-x-330ml", search: "QNT Protein Shake Tetra Strawberry 330ml" },
  { slug: "sport-water-12-x-500ml", search: "QNT Sport Water 500ml" },
  { slug: "bcaa-8000-zero-calories-frutos-del-bosque-12-x-700ml", search: "QNT BCAA 8000 Zero Calories Forest Fruits 700ml" },

  // QNT Nutrición Deportiva - Shots y Geles
  { slug: "shot-magnesio-sport-12-x-80ml", search: "QNT Shot Magnesium Sport 80ml" },
  { slug: "shot-guarana-kick-2000mg-12-x-80ml", search: "QNT Shot Guarana Kick 2000mg 80ml" },
  { slug: "energel-frutos-rojos-25-x-55ml", search: "QNT Energel Red Fruits 55ml" },

  // QNT Nutrición Deportiva - Suplementos polvo/tabletas
  { slug: "l-carnitina-liquida-frutos-rojos-500ml", search: "QNT L-Carnitine Liquid Red Fruits 500ml" },
  { slug: "l-glutamina-6000-350g", search: "QNT L-Glutamine 6000 350g" },
  { slug: "creatina-monohidratada-100-pure-300g", search: "QNT Creatine Monohydrate 100% Pure 300g" },
  { slug: "creatina-monohidratada-100-pure-200-tabletas", search: "QNT Creatine Monohydrate 200 tablets" },
  { slug: "shaker-qnt-negro-600ml", search: "QNT Shaker bottle black 600ml" },
  { slug: "bcaa-matrix-4800-200-tabletas", search: "QNT BCAA Matrix 4800 200 tablets" },
  { slug: "bcaa-8500-powder-limon-350g", search: "QNT BCAA 8500 Powder Lemon 350g" },
  { slug: "bcaa-8500-powder-naranja-350g", search: "QNT BCAA 8500 Powder Orange 350g" },
  { slug: "pre-workout-pump-rx-sin-cafeina-300g", search: "QNT Pump RX pre workout caffeine free 300g" },
  { slug: "pre-workout-overdrive-mango-390g", search: "QNT Overdrive pre workout Mango 390g" },

  // QNT Prime Whey grandes
  { slug: "prime-whey-100-whey-isolate-concentrate-vainilla-2kg", search: "QNT Prime Whey Isolate Concentrate Vanilla 2kg" },
  { slug: "prime-whey-100-whey-isolate-concentrate-chocolate-brownie-2-kg-2kg", search: "QNT Prime Whey Isolate Concentrate Chocolate Brownie 2kg" },
  { slug: "prime-whey-100-whey-isolate-concentrate-banana-2kg", search: "QNT Prime Whey Isolate Concentrate Banana 2kg" },
  { slug: "prime-whey-100-whey-isolate-concentrate-frutilla-908g", search: "QNT Prime Whey Isolate Concentrate Strawberry 908g" },

  // QNT METAPURE sachets (30g)
  { slug: "metapure-whey-isolate-zero-frambuesa-30g", search: "QNT Metapure Whey Isolate Zero Raspberry sachet 30g" },
  { slug: "metapure-whey-isolate-zero-pistacho-30g", search: "QNT Metapure Whey Isolate Zero Pistachio sachet 30g" },
  { slug: "metapure-whey-isolate-zero-mango-30g", search: "QNT Metapure Whey Isolate Zero Mango sachet 30g" },
  { slug: "metapure-whey-isolate-zero-chocolate-avellana-30g", search: "QNT Metapure Whey Isolate Zero Chocolate Hazelnut sachet 30g" },
  { slug: "metapure-whey-isolate-zero-banana-30g", search: "QNT Metapure Whey Isolate Zero Banana sachet 30g" },
  { slug: "metapure-whey-isolate-zero-vainilla-30g", search: "QNT Metapure Whey Isolate Zero Vanilla sachet 30g" },
  { slug: "metapure-whey-isolate-zero-chocolate-belga-30g", search: "QNT Metapure Whey Isolate Zero Belgian Chocolate sachet 30g" },

  // QNT METAPURE grandes (2kg)
  { slug: "metapure-whey-isolate-zero-chocolate-avellana-2kg", search: "QNT Metapure Whey Isolate Zero Chocolate Hazelnut 2kg" },
  { slug: "metapure-whey-isolate-zero-banana-2kg", search: "QNT Metapure Whey Isolate Zero Banana 2kg" },
  { slug: "metapure-whey-isolate-zero-chocolate-belga-2kg", search: "QNT Metapure Whey Isolate Zero Belgian Chocolate 2kg" },
  { slug: "metapure-whey-isolate-zero-vainilla-2kg", search: "QNT Metapure Whey Isolate Zero Vanilla 2kg" },

  // QNT METAPURE medianos (908g)
  { slug: "metapure-whey-isolate-zero-frambuesa-908g", search: "QNT Metapure Whey Isolate Zero Raspberry 908g" },
  { slug: "metapure-whey-isolate-zero-chocolate-avellana-908g", search: "QNT Metapure Whey Isolate Zero Chocolate Hazelnut 908g" },
  { slug: "metapure-whey-isolate-zero-banana-908g", search: "QNT Metapure Whey Isolate Zero Banana 908g" },
  { slug: "metapure-whey-isolate-zero-chocolate-belga-908g", search: "QNT Metapure Whey Isolate Zero Belgian Chocolate 908g" },

  // Cuidado Personal extras
  { slug: "protector-solar-spf50-200ml", search: "protector solar SPF50 200ml crema" },
  { slug: "shampoo-anticaida-400ml", search: "shampoo anticaida 400ml" },

  // Dermocosmética
  { slug: "agua-micelar-400ml", search: "agua micelar limpiadora 400ml" },
  { slug: "crema-hidratante-facial-spf30", search: "crema hidratante facial SPF30" },
  { slug: "serum-vitamina-c-30ml", search: "serum vitamina C 30ml facial antioxidante" },

  // Medicamentos
  { slug: "omeprazol-20mg", search: "omeprazol 20mg capsulas caja medicamento" },
  { slug: "loratadina-10mg", search: "loratadina 10mg comprimidos caja medicamento" },
  { slug: "paracetamol-500mg", search: "paracetamol 500mg comprimidos caja" },
  { slug: "ibuprofeno-400mg", search: "ibuprofeno 400mg comprimidos caja" },
];

console.log(`Total products to download: ${products.length}`);

// Buscar imagen en Bing Images
async function searchBingImage(query) {
  const url = `https://www.bing.com/images/search?q=${encodeURIComponent(query)}&form=HDRSC2&first=1`;

  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'en-US,en;q=0.9',
      }
    });

    const html = await res.text();

    // Bing stores image URLs in murl attribute
    const pattern = /murl&quot;:&quot;(https?:\/\/[^&]+?)&quot;/gi;
    const matches = [...html.matchAll(pattern)].map(m => m[1]);

    // Filter out tiny thumbnails and unwanted domains
    return matches.filter(u =>
      !u.includes('bing.com') &&
      !u.includes('microsoft.com') &&
      !u.includes('.svg') &&
      !u.includes('logo') &&
      !u.includes('icon')
    ).slice(0, 8);
  } catch (err) {
    console.error(`  Search error: ${err.message}`);
    return [];
  }
}

// Descargar imagen
async function downloadImage(url, filepath) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'image/*,*/*',
        'Referer': 'https://www.bing.com/',
      },
      redirect: 'follow',
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('image') && !contentType.includes('octet')) {
      throw new Error(`Not image: ${contentType}`);
    }

    const buffer = Buffer.from(await res.arrayBuffer());
    if (buffer.length < 3000) throw new Error(`Too small: ${buffer.length}b`);

    // Determine extension from content type
    let ext = '.jpg';
    if (contentType.includes('png')) ext = '.png';
    else if (contentType.includes('webp')) ext = '.webp';

    const finalPath = filepath.replace(/\.[^.]+$/, ext);
    fs.writeFileSync(finalPath, buffer);
    return { success: true, path: finalPath, size: buffer.length };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

// Main
async function main() {
  if (!fs.existsSync(PRODUCTS_DIR)) {
    fs.mkdirSync(PRODUCTS_DIR, { recursive: true });
  }

  let success = 0;
  let failed = 0;
  const failedProducts = [];
  const downloaded = [];

  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    const baseFilepath = path.join(PRODUCTS_DIR, product.slug + '.jpg');

    // Skip if already exists (any extension)
    const existing = fs.readdirSync(PRODUCTS_DIR).filter(f =>
      f.startsWith(product.slug + '.') && /\.(jpg|jpeg|png|webp)$/i.test(f)
    );
    if (existing.length > 0) {
      console.log(`[${i + 1}/${products.length}] ✓ Exists: ${product.slug}`);
      success++;
      continue;
    }

    console.log(`[${i + 1}/${products.length}] 🔍 ${product.search}`);

    const imageUrls = await searchBingImage(product.search);

    if (imageUrls.length === 0) {
      console.log(`  ✗ No results`);
      failed++;
      failedProducts.push(product.slug);
      continue;
    }

    let done = false;
    for (let j = 0; j < Math.min(imageUrls.length, 5); j++) {
      const imgUrl = imageUrls[j];
      process.stdout.write(`  [${j + 1}] Downloading...`);

      const result = await downloadImage(imgUrl, baseFilepath);
      if (result.success) {
        console.log(` ✓ ${(result.size / 1024).toFixed(0)}KB`);
        downloaded.push({ slug: product.slug, file: path.basename(result.path) });
        done = true;
        success++;
        break;
      } else {
        console.log(` ✗ ${result.error}`);
      }
    }

    if (!done) {
      failed++;
      failedProducts.push(product.slug);
      console.log(`  ✗ All failed: ${product.slug}`);
    }

    // Rate limiting
    await new Promise(r => setTimeout(r, 1200));
  }

  console.log(`\n${'='.repeat(50)}`);
  console.log(`✓ Success: ${success}/${products.length}`);
  console.log(`✗ Failed:  ${failed}/${products.length}`);

  if (downloaded.length > 0) {
    console.log(`\nDownloaded files:`);
    downloaded.forEach(d => console.log(`  ${d.file}`));
  }

  if (failedProducts.length > 0) {
    console.log(`\nFailed products:`);
    failedProducts.forEach(p => console.log(`  ${p}`));
  }

  // Save results
  fs.writeFileSync(
    path.join(__dirname, 'download-results.json'),
    JSON.stringify({ success, failed, downloaded, failedProducts }, null, 2)
  );
}

main().catch(console.error);
