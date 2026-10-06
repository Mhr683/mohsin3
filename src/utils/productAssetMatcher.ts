/**
 * Intelligent Asset & Media Matcher for Pakistani E-Commerce & Wholesale Products.
 * Maps any product name to authentic, commercial-grade e-commerce studio photos,
 * realistic multi-angle assets, and high-definition video demonstrations.
 */

export interface ProductAssetPack {
  category: string;
  image: string;
  extraImages: string[];
  videoUrl: string;
  videoTitle: string;
  urduPitch: string;
  highlights: string[];
}

export function getSmartProductAssets(productName: string): ProductAssetPack {
  const q = (productName || '').toLowerCase();

  // 1. PET CARE, DOG/CAT BATH BRUSH, PET MASSAGER
  if (
    q.includes('dog') ||
    q.includes('cat') ||
    q.includes('pet') ||
    q.includes('bath brush') ||
    q.includes('massager silicone') ||
    q.includes('shampoo dispenser brush')
  ) {
    return {
      category: 'Baby Care & Toys',
      image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800&auto=format&fit=crop&q=80',
      extraImages: [
        'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800&auto=format&fit=crop&q=80', // Pet grooming in action
        'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=800&auto=format&fit=crop&q=80', // In-use bath lather
        'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=800&auto=format&fit=crop&q=80', // Silicone bristles close-up
        'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop&q=80', // Packaging pack of 2
      ],
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-cat-lying-on-a-towel-and-relaxing-42978-large.mp4',
      videoTitle: '2-in-1 Silicone Pet Bath Brush & Massager Demo',
      urduPitch:
        'اپنے پالتو جانوروں کو آسانی سے نہلائیں! بلٹ ان شیمپو ڈسپنسر اور نرم سلیکون برسلز کے ساتھ پالتو جانوروں کا مساجر برش۔ جھاگ بنائے اور بال گرنے سے روکے۔ کیش آن ڈیلیوری دستیاب ہے۔',
      highlights: [
        'Built-in 80ml Liquid Soap & Shampoo Dispenser',
        'Soft Skin-Friendly Food-Grade Silicone Bristles',
        'Ergonomic Non-Slip Grip Handle',
        'Pack of 2 (Assorted Colors) with 7 Days Check Warranty',
      ],
    };
  }

  // 2. WIRELESS EARBUDS, AIRPODS, BLUETOOTH HEADPHONES, AUDIO
  if (
    q.includes('earbud') ||
    q.includes('headphone') ||
    q.includes('airpod') ||
    q.includes('earphone') ||
    q.includes('tws') ||
    q.includes('audio') ||
    q.includes('bluetooth speaker') ||
    q.includes('handsfree')
  ) {
    return {
      category: 'Consumer Electronics & Mobile Gadgets',
      image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80',
      extraImages: [
        'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&auto=format&fit=crop&q=80', // Wireless charging case
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80', // Premium audio driver
        'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&auto=format&fit=crop&q=80', // In-ear ergonomic lifestyle
        'https://images.unsplash.com/photo-1534353436294-0dbd4bdac845?w=800&auto=format&fit=crop&q=80', // Retail unboxing box & cable
      ],
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-man-working-on-a-sound-console-40810-large.mp4',
      videoTitle: 'True Wireless Noise-Cancelling Earbuds Pro Sound Test',
      urduPitch:
        'کرسٹل کلیئر ایچ ڈی ساؤنڈ اور ڈیپ بیس! جدید نائز کینسلیشن، ٹچ کنٹرول اور لمبی بیٹری لائف۔ کالنگ اور گیمنگ کے لیے بہترین ایئربڈز۔ کیش آن ڈیلیوری دستیاب ہے۔',
      highlights: [
        'Active Noise Cancellation (ANC) with Transparency Mode',
        'Bluetooth 5.3 Quick Auto-Pairing Technology',
        'Up to 36 Hours Total Battery Playtime with Case',
        'Sweat & Water Resistant (IPX5 Rated)',
      ],
    };
  }

  // 3. BARBER HAIR TRIMMER, SHAVER, GROOMING KIT (VINTAGE T9)
  if (
    q.includes('trimmer') ||
    q.includes('shaver') ||
    q.includes('clipper') ||
    q.includes('razor') ||
    q.includes('t9') ||
    q.includes('hair cut') ||
    q.includes('beard')
  ) {
    return {
      category: 'Personal Care & Health',
      image: 'https://images.unsplash.com/photo-1621607512214-68297480165e?w=800&auto=format&fit=crop&q=80',
      extraImages: [
        'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&auto=format&fit=crop&q=80', // Sharp titanium blade close-up
        'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=800&auto=format&fit=crop&q=80', // Barber shop precision trimming
        'https://images.unsplash.com/photo-1517832606299-7ae9b720a186?w=800&auto=format&fit=crop&q=80', // USB charging & battery indicator
        'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop&q=80', // Full box kit with 4 guide combs
      ],
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-barber-shaving-a-mans-beard-with-a-machine-42456-large.mp4',
      videoTitle: 'Professional T9 Vintage Metal Hair & Beard Trimmer Demo',
      urduPitch:
        'گھر بیٹھے پروفیشنل ہیئر کٹنگ اور شیونگ! میٹل باڈی وِنٹیج ٹی نائن ٹریمر۔ ہائی سپیڈ تانبے کی موٹر، زیرو گیپ بلیڈ اور یو ایس بی ریچارج ایبل بیٹری۔ 7 دن کی ریپلیسمنٹ وارنٹی۔',
      highlights: [
        'Ultra-Sharp Zero Gapped Titanium Alloy T-Blade',
        'Heavy-Duty Pure Copper Motor (7000 RPM)',
        'Includes 4 Limit Combs (1.5mm, 2mm, 3mm, 4mm)',
        'USB Fast Charging with 120 Mins Continuous Runtime',
      ],
    };
  }

  // 4. COTTON BOXER SHORTS, UNDERWEAR, MEN'S APPAREL, SHIRTS
  if (
    q.includes('boxer') ||
    q.includes('shorts') ||
    q.includes('underwear') ||
    q.includes('shirt') ||
    q.includes('kurti') ||
    q.includes('trouser') ||
    q.includes('hoodie') ||
    q.includes('apparel') ||
    q.includes('suit') ||
    q.includes('fabric') ||
    q.includes('pant') ||
    q.includes('cotton')
  ) {
    return {
      category: 'Fashion & Apparel',
      image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80',
      extraImages: [
        'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&auto=format&fit=crop&q=80', // Cotton stitch texture
        'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=800&auto=format&fit=crop&q=80', // Fabric fold & colors
        'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&auto=format&fit=crop&q=80', // Elastic waistband macro
        'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop&q=80', // Pack of 3 retail polybag
      ],
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-tailor-working-with-fabrics-and-sewing-machine-42459-large.mp4',
      videoTitle: '100% Export Combed Cotton Boxer Shorts Stretch & Comfort Demo',
      urduPitch:
        'گرمیوں کے لیے انتہائی آرام دہ اور ٹھنڈے باکسر شارٹس! 100% خالص کاٹن فیبرک، نرم الاسٹک اور پائیدار سلائی۔ روزمرہ استعمال اور رات کو سونے کے لیے بہترین انتخاب۔',
      highlights: [
        '100% Premium Combed Breathable Cotton Fabric',
        'Soft Anti-Chafing Microfiber Elastic Waistband',
        'Pack of 3 Assorted Colors (Navy, Grey, Black)',
        'Machine Washable with Zero Color Fading Guarantee',
      ],
    };
  }

  // 5. KITCHEN GARLIC PRESS, CHOPPER, BLENDER, PEELER, CUTTER
  if (
    q.includes('garlic') ||
    q.includes('press') ||
    q.includes('chopper') ||
    q.includes('blender') ||
    q.includes('crusher') ||
    q.includes('slicer') ||
    q.includes('kitchen') ||
    q.includes('cookware') ||
    q.includes('knife') ||
    q.includes('pan') ||
    q.includes('cutter') ||
    q.includes('peeler')
  ) {
    return {
      category: 'Home & Kitchen Essentials',
      image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800&auto=format&fit=crop&q=80',
      extraImages: [
        'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&auto=format&fit=crop&q=80', // Kitchen food prep
        'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=800&auto=format&fit=crop&q=80', // Stainless steel durability
        'https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?w=800&auto=format&fit=crop&q=80', // Dishwasher wash ease
        'https://images.unsplash.com/photo-1534353436294-0dbd4bdac845?w=800&auto=format&fit=crop&q=80', // Retail color box
      ],
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-chef-cutting-vegetables-with-a-knife-42457-large.mp4',
      videoTitle: 'Stainless Steel Garlic Press & Kitchen Crusher Speed Test',
      urduPitch:
        'کھانا بنانے میں وقت بچائیں! سٹین لیس سٹیل گارلک پریس اور کرشر۔ لہسن کو بنا چھلکا اتارے سیکنڈوں میں باریک پیسیں۔ زنگ سے پاک اور دھونے میں انتہائی آسان۔',
      highlights: [
        'Heavy-Duty Food-Grade 304 Stainless Steel',
        'Easy Ergonomic Press Handle Requires Minimal Force',
        'No Peeling Required - Crushes Unpeeled Garlic Cloves',
        'Rust-Proof & 100% Dishwasher Safe',
      ],
    };
  }

  // 6. CAR MOUNT, DASHBOARD HOLDER, AUTOMOTIVE ACCESSORIES
  if (
    q.includes('car') ||
    q.includes('mount') ||
    q.includes('holder') ||
    q.includes('dashboard') ||
    q.includes('magnetic') ||
    q.includes('bike') ||
    q.includes('mobile stand') ||
    q.includes('stand')
  ) {
    return {
      category: 'Automotive & Mobile Accessories',
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop&q=80',
      extraImages: [
        'https://images.unsplash.com/photo-1586105251261-72a756497a11?w=800&auto=format&fit=crop&q=80', // 360 degree rotation
        'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop&q=80', // Car dashboard grip
        'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80', // Strong magnetic plate
        'https://images.unsplash.com/photo-1534353436294-0dbd4bdac845?w=800&auto=format&fit=crop&q=80', // Includes metal rings & 3M tape
      ],
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-car-traveling-on-a-highway-at-dusk-42458-large.mp4',
      videoTitle: '360° Magnetic Car Phone Mount Bump & Shake Test',
      urduPitch:
        'گاڑی چلانے کے دوران فون محفوظ رکھیں! 360 ڈگری میگنیٹک کار ماؤنٹ۔ تیز جھٹکوں اور خراب سڑکوں پر بھی فون نہیں گرتا۔ نیویگیشن اور ہینڈز فری کالنگ کے لیے بہترین۔',
      highlights: [
        '6x Ultra-Strong N52 Neodymium Rare-Earth Magnets',
        '360-Degree Omnidirectional Metal Ball Head Rotation',
        'Heavy-Duty 3M VHB Residue-Free Adhesive Base',
        'Universal Compatibility with All iPhone & Android Smartphones',
      ],
    };
  }

  // 7. COURIER FLYER BAGS, PACKAGING MATERIALS, TAPES, BUBBLE WRAP
  if (
    q.includes('flyer') ||
    q.includes('packaging') ||
    q.includes('bag') ||
    q.includes('tape') ||
    q.includes('bubble') ||
    q.includes('courier') ||
    q.includes('envelope') ||
    q.includes('box') ||
    q.includes('packet')
  ) {
    return {
      category: 'Packaging & Supplies',
      image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop&q=80',
      extraImages: [
        'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&auto=format&fit=crop&q=80', // Transparent document pocket
        'https://images.unsplash.com/photo-1586880244406-556ebe35f282?w=800&auto=format&fit=crop&q=80', // Tamper evident glue strip
        'https://images.unsplash.com/photo-1580674285054-bed31e145f59?w=800&auto=format&fit=crop&q=80', // Waterproof tear test
        'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop&q=80', // 100 pcs bundle pack
      ],
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-folding-a-box-for-a-delivery-42460-large.mp4',
      videoTitle: 'Waterproof Courier Poly Flyer Bags Tear & Adhesive Test',
      urduPitch:
        'آن لائن اور ای کامرس سیلرز کے لیے واٹر پروف فلائر بیگز! مضبوط ایڈریسیو گم، شفاف وے بل پاکٹ اور اینٹی ٹیئر پولی میٹریل۔ بارش اور ڈسٹ سے پارسل کو 100% محفوظ رکھے۔',
      highlights: [
        '100% Virgin Co-Extruded Waterproof Polyethylene Material',
        'Tamper-Evident Permanent Hot-Melt Adhesive Closure',
        'Transparent Consignment Note / Waybill Address Pocket',
        'Standard Trax, TCS, Leopard & CallCourier Approved',
      ],
    };
  }

  // 8. SMART WATCH, FITNESS BAND, ULTRA 8, AMOLED
  if (
    q.includes('watch') ||
    q.includes('smartwatch') ||
    q.includes('band') ||
    q.includes('fitness') ||
    q.includes('ultra') ||
    q.includes('clock')
  ) {
    return {
      category: 'Consumer Electronics & Mobile Gadgets',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
      extraImages: [
        'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80', // HD touch display
        'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&auto=format&fit=crop&q=80', // Wireless magnetic charger
        'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&auto=format&fit=crop&q=80', // Heart rate and sleep sensor
        'https://images.unsplash.com/photo-1534353436294-0dbd4bdac845?w=800&auto=format&fit=crop&q=80', // Premium box with extra ocean strap
      ],
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-close-up-of-a-man-wearing-a-smartwatch-42461-large.mp4',
      videoTitle: 'T800 Ultra Smartwatch Bluetooth Calling & Health Tracking Demo',
      urduPitch:
        'پریمیم سمارٹ واچ بلیوٹوتھ کالنگ اور ہیلتھ ٹریکر کے ساتھ! بڑی ایچ ڈی ڈسپلے، ہارٹ ریٹ مانیٹر، ملٹی اسپورٹس موڈز اور واٹر ریزسٹنٹ ڈیزائن۔ کیش آن ڈیلیوری دستیاب ہے۔',
      highlights: [
        '2.09" Infinite HD Touch Display with Full Touch Control',
        'Direct Bluetooth Phone Calling & Notification Alerts',
        'Heart Rate, Blood Oxygen & Sleep Monitoring Sensors',
        'Magnetic Fast Wireless Charging with 3-5 Days Standby',
      ],
    };
  }

  // 9. SKINCARE, BEAUTY SERUM, CREAM, COSMETICS, MAKEUP
  if (
    q.includes('serum') ||
    q.includes('cream') ||
    q.includes('beauty') ||
    q.includes('skin') ||
    q.includes('hair') ||
    q.includes('shampoo') ||
    q.includes('perfume') ||
    q.includes('lotion') ||
    q.includes('facial') ||
    q.includes('makeup') ||
    q.includes('whitening')
  ) {
    return {
      category: 'Personal Care & Health',
      image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80',
      extraImages: [
        'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80', // Natural organic glow
        'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=800&auto=format&fit=crop&q=80', // Dropper pipette close-up
        'https://images.unsplash.com/photo-1608248597359-58804f323cfa?w=800&auto=format&fit=crop&q=80', // Gentle skin texture
        'https://images.unsplash.com/photo-1534353436294-0dbd4bdac845?w=800&auto=format&fit=crop&q=80', // Tamper sealed retail bottle
      ],
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-woman-applying-moisturizer-on-her-face-42462-large.mp4',
      videoTitle: 'Vitamin C Brightening & Hydrating Serum Application Demo',
      urduPitch:
        'چہرے کی رونق اور نکھار واپس لائیں! خالص وٹامن سی اور ہیالورونک ایسڈ سیرم۔ داغ دھبے، چھائیاں اور جھریاں دور کرے اور جلد کو نرم و ملائم بنائے۔ کیش آن ڈیلیوری دستیاب ہے۔',
      highlights: [
        'Pure 20% Vitamin C + Hyaluronic Acid Formula',
        'Reduces Dark Spots, Pigmentation & Fine Lines',
        'Dermatologist Tested & Suitable for All Skin Types',
        '100% Paraben & Cruelty Free Organic Ingredients',
      ],
    };
  }

  // 10. SMART LED BULBS, LIGHTS, LAMPS, RGB LIGHTING
  if (
    q.includes('bulb') ||
    q.includes('led') ||
    q.includes('light') ||
    q.includes('lamp') ||
    q.includes('rgb') ||
    q.includes('torch') ||
    q.includes('night light') ||
    q.includes('solar')
  ) {
    return {
      category: 'Consumer Electronics & Mobile Gadgets',
      image: 'https://images.unsplash.com/photo-1550985616-10810253b84d?w=800&auto=format&fit=crop&q=80',
      extraImages: [
        'https://images.unsplash.com/photo-1543599538-a6c4f6cc5c05?w=800&auto=format&fit=crop&q=80', // RGB light colors
        'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&auto=format&fit=crop&q=80', // Ambient room mood
        'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80', // Close up socket & build
        'https://images.unsplash.com/photo-1534353436294-0dbd4bdac845?w=800&auto=format&fit=crop&q=80', // Retail packaging box
      ],
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-colored-lights-illuminating-a-room-42463-large.mp4',
      videoTitle: '2-in-1 Smart LED Bulb with Bluetooth Speaker Demo',
      urduPitch:
        'روشن کریں اپنا گھر سمارٹ ملٹی کلر ایل ای ڈی بلب کے ساتھ! ریموٹ کنٹرول اور ہائی کوالٹی بلیوٹوتھ ساؤنڈ سپیکر۔ کم بجلی کی کھپت اور 7 دن کی ریپلیسمنٹ وارنٹی۔',
      highlights: [
        '16 Million RGB Colors + Warm White Light',
        'Built-in Powerful Wireless Bluetooth Speaker',
        'Standard B22 / E27 Socket Compatible',
        'Includes Wireless Remote Control & App Sync',
      ],
    };
  }

  // 11. PORTABLE AIR CONDITIONER, COOLER, MIST FAN, USB DESK FAN
  if (
    q.includes('cooler') ||
    q.includes('conditioner') ||
    q.includes('air cooler') ||
    q.includes('fan') ||
    q.includes('mist') ||
    q.includes('cooling') ||
    q.includes('humidifier')
  ) {
    return {
      category: 'Home & Kitchen Essentials',
      image: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=800&auto=format&fit=crop&q=80',
      extraImages: [
        'https://images.unsplash.com/photo-1618941716939-553df3c6c278?w=800&auto=format&fit=crop&q=80', // Air cooler front
        'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80', // Desk in-use cooling
        'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80', // Mist nozzle macro
        'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop&q=80', // Unboxing box
      ],
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-wind-blowing-through-green-leaves-42464-large.mp4',
      videoTitle: 'Portable Air Conditioner Cool Mist USB Fan Demo',
      urduPitch:
        'گرمی کا زبردست توڑ! پورٹیبل ایئر کنڈیشنر منی کولر۔ واٹر ٹینک اور آئس کیوب سلاٹ کے ساتھ فوری ٹھنڈی ہوا، یو ایس بی پاور اور خاموش موٹر۔ کیش آن ڈیلیوری دستیاب ہے۔',
      highlights: [
        'Ice & Water Tank with Hydro-Chill Technology',
        '3 Adjustable Wind Speeds (Low, Med, Turbo)',
        'Low Electricity Consumption (Powerbank Compatible)',
        '7-Day Return & Replacement Guarantee',
      ],
    };
  }

  // 12. GENERAL COMMODITY / HIGH DEMAND WHOLESALE FALLBACK
  return {
    category: 'General Wholesale Products',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
    extraImages: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1534353436294-0dbd4bdac845?w=800&auto=format&fit=crop&q=80',
    ],
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-man-working-on-a-sound-console-40810-large.mp4',
    videoTitle: 'Verified Commercial Wholesale Product Demonstration',
    urduPitch:
      'پاکستان بھر میں سب سے زیادہ فروخت ہونے والی ہائی ڈیمانڈ ہول سیل پروڈکٹ۔ کیش آن ڈیلیوری، فاسٹ 2-3 دن ڈلیوری اور فوری منافع کے ساتھ۔',
    highlights: [
      'High Demand Trending Wholesale Product',
      'Factory Direct Pricing with Maximum Margin',
      'Ready Stock in Karachi & Lahore Hubs',
      'Fast 2-3 Days Cash on Delivery Dispatch',
    ],
  };
}
