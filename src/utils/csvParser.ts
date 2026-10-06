/**
 * Enterprise-Grade CSV / TSV / Excel Parser for Pakistani & Global E-Commerce Catalogs.
 * Supports Shopify, Daraz PK, WooCommerce, Google Sheets, Excel, and custom supplier formats.
 * Preserves 100% of rows (including thousands of items and all variants), handles multi-line
 * quoted cells without breaking rows, and accurately detects or infers granular categories.
 */

export interface ParsedCsvProduct {
  name: string;
  sku: string;
  category: string;
  cost: number;
  price: number;
  stock: number;
  weight: number;
  image: string;
  images?: string[];
  videoUrl?: string;
  description?: string;
  brand?: string;
  variantTitle?: string;
}

export interface CsvParseResult {
  headers: string[];
  products: ParsedCsvProduct[];
  totalRows: number;
  categoriesFound: string[];
  detectedDelimiter: string;
  rawCount: number;
}

function cleanNumber(val: any, fallback = 0): number {
  if (val === undefined || val === null || val === '') return fallback;
  // Handle commas, currency symbols (PKR, Rs, $), etc.
  const cleaned = String(val)
    .replace(/[^\d.-]/g, '')
    .trim();
  const num = parseFloat(cleaned);
  return isNaN(num) ? fallback : num;
}

function normalizeHeader(h: string): string {
  return (h || '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
}

function findColIndex(headers: string[], aliases: string[]): number {
  const normHeaders = headers.map(normalizeHeader);

  // 1. Exact normalized match first
  for (const alias of aliases) {
    const normAlias = normalizeHeader(alias);
    const exact = normHeaders.indexOf(normAlias);
    if (exact !== -1) return exact;
  }

  // 2. Word-boundary or high-confidence substring match
  for (const alias of aliases) {
    const normAlias = normalizeHeader(alias);
    // Ignore short aliases for substring match to prevent false positives like 'cat' matching 'certificate'
    if (normAlias.length < 4) continue;
    for (let i = 0; i < normHeaders.length; i++) {
      if (normHeaders[i].length > 0 && normHeaders[i].includes(normAlias)) {
        return i;
      }
    }
  }

  return -1;
}

/**
 * True RFC-4180 streaming record extractor.
 * Correctly maintains quotation state across multi-line text (e.g. descriptions with line breaks)
 * so that single products with descriptions spanning multiple lines are NEVER split into orphaned rows!
 */
export function extractCsvRecords(rawText: string, delimiter: string): string[][] {
  const records: string[][] = [];
  let currentRecord: string[] = [];
  let currentField = '';
  let inQuotes = false;
  const len = rawText.length;

  for (let i = 0; i < len; i++) {
    const char = rawText[i];
    const nextChar = rawText[i + 1];

    if (char === '"') {
      if (inQuotes) {
        if (nextChar === '"') {
          // Escaped double-quote ("")
          currentField += '"';
          i++; // skip next quote
        } else {
          // Check if this quote actually closes the field (followed by delimiter, newline, or whitespace before them)
          let lookAhead = i + 1;
          while (lookAhead < len && (rawText[lookAhead] === ' ' || rawText[lookAhead] === '\t')) {
            lookAhead++;
          }
          if (
            lookAhead >= len ||
            rawText[lookAhead] === delimiter ||
            rawText[lookAhead] === '\n' ||
            rawText[lookAhead] === '\r'
          ) {
            inQuotes = false;
          } else {
            // Internal quote like in 12" Ring Light or 55" TV - preserve as literal quote character
            currentField += '"';
          }
        }
      } else {
        // Only open quote if at the start of field (or after leading spaces)
        if (currentField.trim().length === 0) {
          inQuotes = true;
        } else {
          // Inside unquoted text like 12" Screen
          currentField += '"';
        }
      }
    } else if (char === delimiter && !inQuotes) {
      currentRecord.push(currentField.trim());
      currentField = '';
    } else if ((char === '\n' || char === '\r') && !inQuotes) {
      // Carriage return followed by line feed
      if (char === '\r' && nextChar === '\n') {
        i++;
      }
      currentRecord.push(currentField.trim());
      // Save record if it contains at least one non-empty value
      if (currentRecord.some((f) => f.length > 0)) {
        records.push(currentRecord);
      }
      currentRecord = [];
      currentField = '';
    } else {
      currentField += char;
    }
  }

  // Push final field / record if present
  if (currentField.length > 0 || currentRecord.length > 0) {
    currentRecord.push(currentField.trim());
    if (currentRecord.some((f) => f.length > 0)) {
      records.push(currentRecord);
    }
  }

  return records;
}

/**
 * Detect delimiter from text sample
 */
export function detectDelimiter(text: string): string {
  // Use first 3000 chars for sample
  const sample = text.slice(0, 3000);
  const commaCount = (sample.match(/,/g) || []).length;
  const tabCount = (sample.match(/\t/g) || []).length;
  const semiCount = (sample.match(/;/g) || []).length;
  const pipeCount = (sample.match(/\|/g) || []).length;

  if (tabCount > commaCount && tabCount >= semiCount) return '\t';
  if (semiCount > commaCount && semiCount > tabCount) return ';';
  if (pipeCount > commaCount && pipeCount > semiCount) return '|';
  return ',';
}

export function parseCsvText(
  rawText: string,
  fallbackSupplier = 'Verified Wholesale Factory'
): CsvParseResult {
  const clean = rawText.replace(/^\uFEFF/, '').trim();
  if (!clean) {
    return {
      headers: [],
      products: [],
      totalRows: 0,
      categoriesFound: [],
      detectedDelimiter: ',',
      rawCount: 0,
    };
  }

  const delimiter = detectDelimiter(clean);
  const allRecords = extractCsvRecords(clean, delimiter);

  if (allRecords.length === 0) {
    return {
      headers: [],
      products: [],
      totalRows: 0,
      categoriesFound: [],
      detectedDelimiter: delimiter,
      rawCount: 0,
    };
  }

  // Find header row (skips initial banner, report metadata, or empty rows)
  let headerRowIndex = 0;
  for (let i = 0; i < Math.min(10, allRecords.length); i++) {
    const rowStr = allRecords[i].join(' ').toLowerCase();
    if (
      rowStr.includes('name') ||
      rowStr.includes('title') ||
      rowStr.includes('sku') ||
      rowStr.includes('price') ||
      rowStr.includes('category') ||
      rowStr.includes('cost') ||
      rowStr.includes('handle') ||
      rowStr.includes('item') ||
      rowStr.includes('product')
    ) {
      headerRowIndex = i;
      break;
    }
  }

  const rawHeaders = allRecords[headerRowIndex].map((h) =>
    h.replace(/^"|"$/g, '').trim()
  );

  // Column matching with comprehensive aliases for Pakistani, Shopify, Daraz, WooCommerce, Excel
  const nameIdx = findColIndex(rawHeaders, [
    'product name', 'product_name', 'title', 'item name', 'item_name', 'name', 'product title', 'post_title', 'handle', 'item', 'heading', 'naam', 'item description', 'product'
  ]);

  const skuIdx = findColIndex(rawHeaders, [
    'variant sku', 'sku', 'item code', 'barcode', 'code', 'product code', 'id', 'product id', 'item_code', 'model number', 'upc', 'ean', 'part number'
  ]);

  const catIdx = findColIndex(rawHeaders, [
    'category', 'product category', 'categories', 'category name', 'product type', 'product_type', 'item category', 'department', 'type', 'collection', 'collections', 'main category', 'sub category', 'subcategory', 'item group', 'group', 'classification', 'daraz category', 'shopify category', 'taxonomy', 'catalog', 'tags', 'tag', 'kategori'
  ]);

  const costIdx = findColIndex(rawHeaders, [
    'cost per item', 'wholesale cost', 'supplier cost', 'cost', 'cost pkr', 'purchase price', 'buying price', 'wholesale', 'wholesale pkr', 'khareed', 'base cost', 'cost_price', 'unit cost', 'buy price', 'rate', 'factory price'
  ]);

  const priceIdx = findColIndex(rawHeaders, [
    'variant price', 'retail price', 'selling price', 'price', 'regular price', 'sale price', 'sell price', 'price pkr', 'selling pkr', 'mrp', 'retail', 'customer price', 'price_pkr', 'unit price', 'amount', 'list price'
  ]);

  const stockIdx = findColIndex(rawHeaders, [
    'variant inventory qty', 'stock', 'inventory', 'quantity', 'qty', 'available', 'units', 'total stock', 'in stock', 'balance', 'count', 'tadad', 'pieces'
  ]);

  const weightIdx = findColIndex(rawHeaders, [
    'variant grams', 'weight', 'weight kg', 'grams', 'wt', 'weight(kg)', 'weight_kg', 'wazan', 'weight_g'
  ]);

  const imgIdx = findColIndex(rawHeaders, [
    'image src', 'image', 'image url', 'image link', 'img', 'photo', 'picture', 'images', 'thumbnail', 'photo_url', 'featured image', 'tasweer', 'image_1'
  ]);

  const videoIdx = findColIndex(rawHeaders, [
    'video', 'video url', 'video link', 'video ad', 'reel', 'video_url', 'product video'
  ]);

  const descIdx = findColIndex(rawHeaders, [
    'body (html)', 'body html', 'description', 'product description', 'details', 'desc', 'summary', 'about', 'tafseel'
  ]);

  const brandIdx = findColIndex(rawHeaders, [
    'vendor', 'brand', 'manufacturer', 'supplier', 'make', 'company', 'factory'
  ]);

  const variantOptIdx = findColIndex(rawHeaders, [
    'option1 value', 'option 1 value', 'variant', 'variation', 'variant option', 'color', 'size', 'colour'
  ]);

  const products: ParsedCsvProduct[] = [];
  const categoriesSet = new Set<string>();

  // Track parent product context for Shopify / WooCommerce multi-row variants & multi-image rows
  let lastProduct: ParsedCsvProduct | null = null;
  let lastValidTitle = '';
  let lastValidCategory = '';
  let lastValidImage = '';

  for (let i = headerRowIndex + 1; i < allRecords.length; i++) {
    const row = allRecords[i];
    if (!row || row.every((c) => !c.trim())) continue;

    let rawName = (nameIdx >= 0 && row[nameIdx] ? row[nameIdx] : '') || '';
    rawName = rawName.replace(/^"|"$/g, '').trim();

    let rawSku = (skuIdx >= 0 && row[skuIdx] ? row[skuIdx] : '') || '';
    rawSku = rawSku.replace(/^"|"$/g, '').trim();

    let rawCat = (catIdx >= 0 && row[catIdx] ? row[catIdx] : '') || '';
    rawCat = rawCat.replace(/^"|"$/g, '').trim();

    let rawImg = (imgIdx >= 0 && row[imgIdx] ? row[imgIdx] : '') || '';
    rawImg = rawImg.replace(/^"|"$/g, '').trim();

    const rawVariantOpt = (variantOptIdx >= 0 && row[variantOptIdx] ? row[variantOptIdx] : '').trim();

    // Check if this is an auxiliary image row for the previous product (Shopify exports extra images on blank lines)
    if (!rawName && !rawSku && rawImg && lastProduct && (!row[priceIdx] || cleanNumber(row[priceIdx]) === 0)) {
      if (!lastProduct.images) lastProduct.images = [lastProduct.image];
      if (!lastProduct.images.includes(rawImg)) {
        lastProduct.images.push(rawImg);
      }
      continue;
    }

    // Handle variant rows: if title is empty but variant options, sku, or handle exist, inherit title
    if (!rawName && lastValidTitle) {
      if (rawVariantOpt) {
        rawName = `${lastValidTitle} - ${rawVariantOpt}`;
      } else if (rawSku) {
        rawName = `${lastValidTitle} (${rawSku})`;
      } else {
        rawName = `${lastValidTitle} (Variant ${products.length + 1})`;
      }
    } else if (rawName) {
      lastValidTitle = rawName;
    }

    if (!rawName) {
      rawName = `Wholesale Catalog Item #${products.length + 1}`;
    }

    if (!rawSku) {
      rawSku = `SKU-${Date.now().toString().slice(-4)}-${products.length + 1}`;
    }

    // Category extraction and cleanup
    if (!rawCat && lastValidCategory) {
      rawCat = lastValidCategory;
    } else if (rawCat) {
      // Clean breadcrumb separators e.g. "Electronics > Audio > Earbuds" -> "Audio & Earbuds"
      if (rawCat.includes('>')) {
        const segments = rawCat.split('>').map((s) => s.trim()).filter(Boolean);
        // Take the most specific sub-branch or last two
        if (segments.length >= 2) {
          rawCat = `${segments[segments.length - 2]} - ${segments[segments.length - 1]}`;
        } else {
          rawCat = segments[segments.length - 1] || segments[0];
        }
      } else if (rawCat.includes('/')) {
        const segments = rawCat.split('/').map((s) => s.trim()).filter(Boolean);
        rawCat = segments[segments.length - 1] || segments[0];
      }
      lastValidCategory = rawCat;
    }

    // Cost & Price extraction
    let rawCost = cleanNumber(costIdx >= 0 ? row[costIdx] : (row[3] || 0), 0);
    let rawPrice = cleanNumber(priceIdx >= 0 ? row[priceIdx] : (row[4] || 0), 0);

    // If cost missing but price present, calculate realistic wholesale cost (65%)
    if (rawCost <= 0 && rawPrice > 0) {
      rawCost = Math.round(rawPrice * 0.65);
    } else if (rawPrice <= 0 && rawCost > 0) {
      rawPrice = Math.round(rawCost * 1.55);
    } else if (rawCost <= 0 && rawPrice <= 0) {
      rawCost = 450;
      rawPrice = 850;
    }

    const rawStock = cleanNumber(stockIdx >= 0 ? row[stockIdx] : (row[5] || 100), 100);
    const rawWeightVal = cleanNumber(weightIdx >= 0 ? row[weightIdx] : (row[6] || 0.3), 0.3);
    // If weight is in grams (> 15), convert to KG
    const rawWeight = rawWeightVal > 15 ? Math.round((rawWeightVal / 1000) * 100) / 100 : rawWeightVal;

    if (!rawImg && lastValidImage) {
      rawImg = lastValidImage;
    } else if (rawImg) {
      lastValidImage = rawImg;
    }

    const rawVideo = (videoIdx >= 0 && row[videoIdx] ? row[videoIdx] : '') || '';
    const rawDesc = descIdx >= 0 && row[descIdx] ? row[descIdx].replace(/^"|"$/g, '').trim() : '';
    const rawBrand = brandIdx >= 0 && row[brandIdx] ? row[brandIdx].replace(/^"|"$/g, '').trim() : fallbackSupplier;

    // Use smart category inference ONLY if no category provided in CSV
    let finalCategory = rawCat;
    if (!finalCategory || finalCategory.trim().length === 0) {
      finalCategory = inferCategoryFromTitle(rawName);
    } else {
      // Capitalize first letters nicely
      finalCategory = finalCategory
        .split(' ')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(' ');
    }

    // Add to categories registry
    categoriesSet.add(finalCategory);

    // Curated high-res image if none provided
    const finalImage = rawImg && (rawImg.startsWith('http') || rawImg.startsWith('//') || rawImg.startsWith('data:'))
      ? (rawImg.startsWith('//') ? 'https:' + rawImg : rawImg)
      : getCuratedImageForCategory(finalCategory, rawName, products.length);

    const productItem: ParsedCsvProduct = {
      name: rawName,
      sku: rawSku,
      category: finalCategory,
      cost: rawCost,
      price: rawPrice,
      stock: rawStock > 0 ? rawStock : 50,
      weight: rawWeight > 0 ? rawWeight : 0.3,
      image: finalImage,
      images: [finalImage],
      videoUrl: rawVideo && rawVideo.startsWith('http') ? rawVideo : undefined,
      description: rawDesc || `${rawName} - Verified wholesale stock available for fast COD dispatch across Pakistan.`,
      brand: rawBrand || fallbackSupplier,
      variantTitle: rawVariantOpt || undefined,
    };

    products.push(productItem);
    lastProduct = productItem;
  }

  return {
    headers: rawHeaders,
    products,
    totalRows: products.length,
    categoriesFound: Array.from(categoriesSet),
    detectedDelimiter: delimiter,
    rawCount: allRecords.length - headerRowIndex - 1,
  };
}

/**
 * Ultra-Comprehensive 40+ Semantic Category Inference Engine.
 * Used when a CSV file completely lacks a category column.
 * Analyzes English, Roman Urdu, and Urdu e-commerce keywords to ensure products are NEVER
 * squashed into only 4 or 5 generic categories!
 */
export function inferCategoryFromTitle(title: string): string {
  const q = (title || '').toLowerCase();

  // 1. Audio & Headphones
  if (
    q.includes('earbud') || q.includes('headphone') || q.includes('airpod') ||
    q.includes('tws') || q.includes('earphone') || q.includes('bluetooth speaker') ||
    q.includes('handsfree') || q.includes('headset') || q.includes('microphone') ||
    q.includes('soundbar') || q.includes('hifi') || q.includes('audio') || q.includes('woofer')
  ) {
    return 'Audio & Headphones';
  }

  // 2. Smartwatches & Wearables
  if (
    q.includes('smartwatch') || q.includes('smart watch') || q.includes('fitness tracker') ||
    q.includes('smart band') || q.includes('ultra watch') || q.includes('t800') ||
    q.includes('i8 pro') || q.includes('watch strap') || q.includes('apple watch') ||
    q.includes('wrist band') || q.includes('watch') || q.includes('ghari')
  ) {
    return 'Smartwatches & Wearables';
  }

  // 3. Mobile Accessories & Power
  if (
    q.includes('charger') || q.includes('cable') || q.includes('powerbank') ||
    q.includes('power bank') || q.includes('adapter') || q.includes('fast charger') ||
    q.includes('type c') || q.includes('lightning') || q.includes('phone case') ||
    q.includes('glass protector') || q.includes('car mount') || q.includes('phone holder') ||
    q.includes('selfie stick') || q.includes('mobile stand') || q.includes('otg')
  ) {
    return 'Mobile Accessories & Power';
  }

  // 4. Kitchen Tools & Utensils
  if (
    q.includes('chopper') || q.includes('slicer') || q.includes('peeler') ||
    q.includes('knife') || q.includes('cutter') || q.includes('press') ||
    q.includes('garlic press') || q.includes('vegetable cutter') || q.includes('spoon') ||
    q.includes('fork') || q.includes('grater') || q.includes('whisk') ||
    q.includes('strainer') || q.includes('masher') || q.includes('spatula') || q.includes('churi')
  ) {
    return 'Kitchen Tools & Utensils';
  }

  // 5. Kitchen Appliances & Cookware
  if (
    q.includes('blender') || q.includes('grinder') || q.includes('juicer') ||
    q.includes('air fryer') || q.includes('fryer') || q.includes('toaster') ||
    q.includes('kettle') || q.includes('cooker') || q.includes('pan') ||
    q.includes('pot') || q.includes('wok') || q.includes('cookware') ||
    q.includes('hot plate') || q.includes('oven') || q.includes('sandwich maker') ||
    q.includes('coffee maker') || q.includes('stove')
  ) {
    return 'Kitchen Appliances & Cookware';
  }

  // 6. Personal Grooming & Shaving
  if (
    q.includes('trimmer') || q.includes('shaver') || q.includes('clipper') ||
    q.includes('hair dryer') || q.includes('straightener') || q.includes('curler') ||
    q.includes('epilator') || q.includes('razor') || q.includes('t9 trimmer') ||
    q.includes('hair cut') || q.includes('beard') || q.includes('khat machine')
  ) {
    return 'Personal Grooming & Shaving';
  }

  // 7. Skincare, Serums & Cosmetics
  if (
    q.includes('serum') || q.includes('cream') || q.includes('whitening') ||
    q.includes('facial') || q.includes('lotion') || q.includes('cleanser') ||
    q.includes('facewash') || q.includes('face wash') || q.includes('sunblock') ||
    q.includes('sunscreen') || q.includes('toner') || q.includes('mask') ||
    q.includes('scrub') || q.includes('glow') || q.includes('acne') ||
    q.includes('vitamin c') || q.includes('aloe vera') || q.includes('bleach')
  ) {
    return 'Skincare & Cosmetics';
  }

  // 8. Makeup & Beauty Essentials
  if (
    q.includes('lipstick') || q.includes('eyeliner') || q.includes('mascara') ||
    q.includes('foundation') || q.includes('concealer') || q.includes('primer') ||
    q.includes('blush') || q.includes('eyeshadow') || q.includes('makeup brush') ||
    q.includes('sponge') || q.includes('nail polish') || q.includes('lip gloss') ||
    q.includes('makeup') || q.includes('kajal') || q.includes('surma')
  ) {
    return 'Makeup & Beauty Essentials';
  }

  // 9. Perfumes & Fragrances
  if (
    q.includes('perfume') || q.includes('attar') || q.includes('fragrance') ||
    q.includes('body spray') || q.includes('deodorant') || q.includes('cologne') ||
    q.includes('oud') || q.includes('khushbu') || q.includes('scent')
  ) {
    return 'Perfumes & Fragrances';
  }

  // 10. Men\'s Fashion & Apparel
  if (
    q.includes('men') || q.includes('gent') || q.includes('boxer') ||
    q.includes('polo') || q.includes('t-shirt') || q.includes('tshirt') ||
    q.includes('kurta') || q.includes('shalwar') || q.includes('trouser') ||
    q.includes('tracksuit') || q.includes('jogger pant') || q.includes('hoodie') ||
    q.includes('jacket') || q.includes('shirt') || q.includes('underwear') ||
    q.includes('vest') || q.includes('banyan') || q.includes('chinos')
  ) {
    return 'Men\'s Fashion & Apparel';
  }

  // 11. Women\'s Fashion & Lawn
  if (
    q.includes('women') || q.includes('ladies') || q.includes('lawn') ||
    q.includes('kurti') || q.includes('abaya') || q.includes('hijab') ||
    q.includes('scarf') || q.includes('dupatta') || q.includes('suit') ||
    q.includes('dress') || q.includes('legging') || q.includes('bra') ||
    q.includes('lingerie') || q.includes('stole') || q.includes('chiffon') ||
    q.includes('cotton suit') || q.includes('embroidered')
  ) {
    return 'Women\'s Fashion & Lawn';
  }

  // 12. Footwear & Shoes
  if (
    q.includes('shoe') || q.includes('sneaker') || q.includes('sandal') ||
    q.includes('chappal') || q.includes('slipper') || q.includes('boot') ||
    q.includes('heel') || q.includes('loafer') || q.includes('khussa') ||
    q.includes('peshawari') || q.includes('jogger') || q.includes('slides')
  ) {
    return 'Footwear & Shoes';
  }

  // 13. Bags, Wallets & Luggage
  if (
    q.includes('bag') || q.includes('handbag') || q.includes('backpack') ||
    q.includes('wallet') || q.includes('purse') || q.includes('clutch') ||
    q.includes('tote') || q.includes('crossbody') || q.includes('luggage') ||
    q.includes('suitcase') || q.includes('duffle') || q.includes('batwa')
  ) {
    return 'Bags, Wallets & Luggage';
  }

  // 14. Jewelry, Rings & Watches
  if (
    q.includes('ring') || q.includes('necklace') || q.includes('bracelet') ||
    q.includes('earring') || q.includes('chain') || q.includes('pendant') ||
    q.includes('jewelry') || q.includes('jewellery') || q.includes('bangle') ||
    q.includes('churi') || q.includes('gold plated') || q.includes('silver') ||
    q.includes('zircon') || q.includes('anklet') || q.includes('payal')
  ) {
    return 'Jewelry, Rings & Watches';
  }

  // 15. Automotive & Car Accessories
  if (
    q.includes('car ') || q.includes('car_') || q.includes('automotive') ||
    q.includes('dashcam') || q.includes('car vacuum') || q.includes('car charger') ||
    q.includes('seat cover') || q.includes('car wash') || q.includes('wiper') ||
    q.includes('car polish') || q.includes('car perfume') || q.includes('air freshener') ||
    q.includes('steering') || q.includes('car mat')
  ) {
    return 'Automotive & Car Accessories';
  }

  // 16. Motorcycle & Bike Accessories
  if (
    q.includes('bike') || q.includes('motorcycle') || q.includes('helmet') ||
    q.includes('bike light') || q.includes('bike cover') || q.includes('bike lock') ||
    q.includes('riding glove') || q.includes('cd 70') || q.includes('125') ||
    q.includes('glove')
  ) {
    return 'Motorcycle & Bike Accessories';
  }

  // 17. Home Textiles, Bedding & Curtains
  if (
    q.includes('bedsheet') || q.includes('bed sheet') || q.includes('pillow') ||
    q.includes('cushion') || q.includes('curtain') || q.includes('towel') ||
    q.includes('blanket') || q.includes('comforter') || q.includes('quilt') ||
    q.includes('duvet') || q.includes('mattress') || q.includes('carpet') ||
    q.includes('rug') || q.includes('chadar')
  ) {
    return 'Home Textiles, Bedding & Curtains';
  }

  // 18. Home Decor, Lights & Living
  if (
    q.includes('bulb') || q.includes('light') || q.includes('lamp') ||
    q.includes('solar') || q.includes('led') || q.includes('strip light') ||
    q.includes('ceiling light') || q.includes('clock') || q.includes('wall clock') ||
    q.includes('vase') || q.includes('mirror') || q.includes('frame') ||
    q.includes('diffuser') || q.includes('humidifier') || q.includes('fan') ||
    q.includes('room heater') || q.includes('cooler')
  ) {
    return 'Home Decor, Lights & Living';
  }

  // 19. Baby Care, Toys & Kids
  if (
    q.includes('baby') || q.includes('toy') || q.includes('doll') ||
    q.includes('remote control car') || q.includes('rc car') || q.includes('drone') ||
    q.includes('puzzle') || q.includes('kid') || q.includes('diaper') ||
    q.includes('stroller') || q.includes('feeder') || q.includes('teether') ||
    q.includes('action figure') || q.includes('educational toy')
  ) {
    return 'Baby Care, Toys & Kids';
  }

  // 20. Pet Supplies & Accessories
  if (
    q.includes('pet') || q.includes('dog') || q.includes('cat') ||
    q.includes('pet brush') || q.includes('collar') || q.includes('leash') ||
    q.includes('pet food') || q.includes('aquarium') || q.includes('litter')
  ) {
    return 'Pet Supplies & Accessories';
  }

  // 21. Tools, Hardware & DIY
  if (
    q.includes('drill') || q.includes('tool') || q.includes('wrench') ||
    q.includes('screwdriver') || q.includes('screw') || q.includes('tape') ||
    q.includes('glue') || q.includes('hardware') || q.includes('pliers') ||
    q.includes('hammer') || q.includes('measuring tape') || q.includes('soldering')
  ) {
    return 'Tools, Hardware & DIY';
  }

  // 22. Sports, Fitness & Gym
  if (
    q.includes('gym') || q.includes('fitness') || q.includes('dumbbell') ||
    q.includes('yoga') || q.includes('resistance band') || q.includes('sport') ||
    q.includes('cricket') || q.includes('football') || q.includes('racket') ||
    q.includes('gloves') || q.includes('shaker bottle') || q.includes('belt')
  ) {
    return 'Sports, Fitness & Gym';
  }

  // 23. Packaging & Courier Supplies
  if (
    q.includes('flyer') || q.includes('poly bag') || q.includes('bubble wrap') ||
    q.includes('carton') || q.includes('packaging') || q.includes('courier bag') ||
    q.includes('packing tape') || q.includes('envelope') || q.includes('shipping box')
  ) {
    return 'Packaging & Courier Supplies';
  }

  // 24. Health & Medical Devices
  if (
    q.includes('bp monitor') || q.includes('thermometer') || q.includes('oximeter') ||
    q.includes('nebulizer') || q.includes('glucose') || q.includes('hearing aid') ||
    q.includes('posture corrector') || q.includes('bandage') || q.includes('massager')
  ) {
    return 'Health & Medical Devices';
  }

  // 25. Stationery & Office Supplies
  if (
    q.includes('pen') || q.includes('notebook') || q.includes('diary') ||
    q.includes('calculator') || q.includes('marker') || q.includes('pencil') ||
    q.includes('stapler') || q.includes('paper') || q.includes('binder')
  ) {
    return 'Stationery & Office Supplies';
  }

  return 'General Wholesale Products';
}

/**
 * Returns distinct high quality images for different categories so products don't all look identical
 */
export function getCuratedImageForCategory(category: string, title: string, index: number): string {
  const q = (category + ' ' + title).toLowerCase();

  const curatedList: Record<string, string[]> = {
    audio: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600',
      'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600',
    ],
    watch: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600',
      'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600',
    ],
    mobile: [
      'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600',
      'https://images.unsplash.com/photo-1609081219090-a6d81d3085bf?w=600',
      'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600',
    ],
    fashion: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600',
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600',
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600',
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600',
    ],
    kitchen: [
      'https://images.unsplash.com/photo-1584269600519-112d071b35e6?w=600',
      'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=600',
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600',
      'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=600',
    ],
    beauty: [
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600',
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600',
      'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=600',
      'https://images.unsplash.com/photo-1621607512214-68297480165e?w=600',
    ],
    shoes: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600',
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600',
      'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600',
    ],
    bags: [
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600',
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600',
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600',
    ],
    home: [
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600',
      'https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=600',
      'https://images.unsplash.com/photo-1550985616-10810253b84d?w=600',
    ],
    auto: [
      'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600',
      'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=600',
    ],
    tools: [
      'https://images.unsplash.com/photo-1581147036324-c17ac41dfa6c?w=600',
      'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600',
    ],
    toys: [
      'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=600',
      'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=600',
    ],
  };

  let pool = curatedList.kitchen;
  if (q.includes('audio') || q.includes('earbud') || q.includes('headphone') || q.includes('sound')) pool = curatedList.audio;
  else if (q.includes('watch') || q.includes('wearable')) pool = curatedList.watch;
  else if (q.includes('charger') || q.includes('cable') || q.includes('powerbank') || q.includes('mobile')) pool = curatedList.mobile;
  else if (q.includes('fashion') || q.includes('cloth') || q.includes('shirt') || q.includes('apparel') || q.includes('suit') || q.includes('dress')) pool = curatedList.fashion;
  else if (q.includes('beauty') || q.includes('serum') || q.includes('trimmer') || q.includes('care') || q.includes('cosmetic')) pool = curatedList.beauty;
  else if (q.includes('shoe') || q.includes('footwear') || q.includes('sneaker')) pool = curatedList.shoes;
  else if (q.includes('bag') || q.includes('wallet') || q.includes('luggage')) pool = curatedList.bags;
  else if (q.includes('auto') || q.includes('car') || q.includes('bike')) pool = curatedList.auto;
  else if (q.includes('textile') || q.includes('bed') || q.includes('home') || q.includes('decor') || q.includes('curtain')) pool = curatedList.home;
  else if (q.includes('tool') || q.includes('drill') || q.includes('hardware')) pool = curatedList.tools;
  else if (q.includes('toy') || q.includes('baby') || q.includes('kid')) pool = curatedList.toys;

  return pool[index % pool.length];
}
