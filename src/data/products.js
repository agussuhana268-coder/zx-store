export const PROMOTION_CONFIG = {
  enabled: true,
  startDate: '2026-08-14T00:00:00+07:00',
  endDate: '2026-08-14T23:59:59.999+07:00',
  badgeText: 'TODAY ONLY',
};

export const isPromotionActive = () => {
  if (!PROMOTION_CONFIG.enabled) return false;
  const now = Date.now();
  const start = new Date(PROMOTION_CONFIG.startDate).getTime();
  const end = new Date(PROMOTION_CONFIG.endDate).getTime();
  return now >= start && now <= end;
};

export const calculateSavings = (price, promoPrice) => {
  if (!price || !promoPrice) return null;
  const normal = parseInt(price.replace(/\D/g, ''), 10);
  const promo = parseInt(promoPrice.replace(/\D/g, ''), 10);
  if (isNaN(normal) || isNaN(promo) || normal <= promo) return null;
  const diff = normal - promo;
  return `Hemat Rp${diff.toLocaleString('id-ID')}`;
};

export const NEXUS_INFO = {
  name: 'Nexus Injector v2.0',
  version: 'v2.0',
  price: 'Rp60.000',
  license: 'Permanen / Lifetime',
  compatibility: 'Android 11 - 17+ (NEW VERSION)',
  tagline: 'Android System Injection & Performance Optimizer',
  description: 'Nexus Injector adalah sistem optimasi Android yang menggunakan mekanisme system injection untuk menerapkan konfigurasi secara terstruktur ke lingkungan perangkat dan game. Setiap konfigurasi diproses melalui Nexus Engine sebelum di-inject, sehingga pengaturan dapat diterapkan secara terkontrol tanpa mengubah sistem secara permanen. Dirancang untuk memberikan pengalaman gaming yang lebih stabil, responsif, dan optimal sesuai konfigurasi pengguna.',
  features: [
    { name: 'Performance', category: 'Engine & System', tag: 'Core', desc: 'Optimasi performa CPU & alokasi resource game tanpa bottleneck.' },
    { name: 'Aim', category: 'Aim & Precision', tag: 'Aim', desc: 'Bidikan lebih konsisten dengan kalibrasi touch assist presisi.' },
    { name: 'Graphics', category: 'Display & Tuning', tag: 'Visual', desc: 'Peningkatan ketajaman visual dan stabilitas render game.' },
    { name: 'Boost', category: 'Engine & System', tag: 'Core', desc: 'Fast clock boost dan pembebasan RAM secara real-time.' },
    { name: 'Smart Tracking', category: 'Aim & Precision', tag: 'AI', desc: 'Tracking target adaptif mengikuti pergerakan sentuhan jari.' },
    { name: 'Tracking', category: 'Aim & Precision', tag: 'Aim', desc: 'Stabilisasi tracking saat aiming jarak dekat maupun jauh.' },
    { name: 'Sensi High', category: 'Aim & Precision', tag: 'Sensi', desc: 'Peningkatan rasio sensitivitas layar untuk respon kilat.' },
    { name: 'Anti Delay', category: 'Aim & Precision', tag: 'Speed', desc: 'Mengurangi touch sampling delay ke tingkat serendah mungkin.' },
    { name: 'Flicking Pro', category: 'Aim & Precision', tag: 'Pro', desc: 'Kemudahan kontrol snap flicking tanpa overshooting.' },
    { name: 'Drag Precision', category: 'Aim & Precision', tag: 'Pro', desc: 'Kontrol tarikan drag shot akurat dan stabil di segala situasi.' },
    { name: 'Preset Resolusi R-1 R-2 R-3', category: 'Display & Tuning', tag: 'Preset', desc: 'Pilihan profil resolusi terkalibrasi siap pakai (R-1, R-2, R-3).' },
    { name: 'Kustom Resolusi', category: 'Display & Tuning', tag: 'Custom', desc: 'Kustomisasi resolusi layar sesuai spesifikasi perangkat.' },
    { name: 'Kustom DPI', category: 'Display & Tuning', tag: 'Density', desc: 'Pengaturan densitas DPI layar terkontrol untuk kerapatan pixel ideal.' },
    { name: 'N-CORE AI', category: 'Engine & System', tag: 'AI Engine', desc: 'AI Nexus yang menyeimbangkan fitur sistem secara otomatis.' },
    { name: 'System Clean', category: 'Engine & System', tag: 'Utility', desc: 'Pembersihan cache, residu background & service tak penting otomatis.' },
    { name: 'Kernel Matrix', category: 'Engine & System', tag: 'Kernel', desc: 'Optimasi performa tinggi berbasis Linux Kernel System Calls (procfs/sysfs), Android ART DEX Compiler, dan Low-Level Process Memory Control untuk layar lebih licin, respons cepat, dan FPS stabil.'},
  ],
};

export const products = [
  {
    id: 'nexus-injector',
    name: 'NEXUS INJECTOR',
    version: 'v2.0',
    price: 'Rp60.000',
    promoPrice: null,
    slots: 'Tersedia • Instant Delivery',
    badge: 'FLAGSHIP',
    license: 'PERMANEN / LIFETIME',
    compatibility: 'Android 11 - 17+ (NEW VERSION)',
    description: 'Nexus Injector adalah sistem optimasi Android yang menggunakan mekanisme system injection untuk menerapkan konfigurasi secara terstruktur ke lingkungan perangkat dan game. Setiap konfigurasi diproses melalui Nexus Engine sebelum di-inject, sehingga pengaturan dapat diterapkan secara terkontrol tanpa mengubah sistem secara permanen. Dirancang untuk memberikan pengalaman gaming yang lebih stabil, responsif, dan optimal sesuai konfigurasi pengguna.',
    features: [
      'Performance',
      'Aim',
      'Graphics',
      'Boost',
      'Smart Tracking',
      'Tracking',
      'Sensi High',
      'Anti Delay',
      'Flicking Pro',
      'Drag Precision',
      'Preset Resolusi R-1 R-2 R-3',
      'Kustom Resolusi',
      'Kustom DPI',
      'N-CORE AI',
      'System Clean',
      'Kernel Matrix',
    ]
  },
  {
    id: 'zx-vortex',
    name: 'ZX VORTEX',
    version: 'v3.5',
    price: 'Rp149.000',
    promoPrice: 'Rp139.000',
    slots: 'Tersedia • Instant Delivery',
    badge: 'VIP EDITION',
    license: 'PERMANEN / LIFETIME',
    compatibility: 'ANDROID 11 - 17+ (NEW VERSION)',
    description: 'VORTEX adalah tools kelas atas dengan Vortex Injector Panel yang dirancang untuk menerapkan konfigurasi gaming secara terstruktur dan terkontrol. Dilengkapi Thermal Stability untuk membantu menjaga kestabilan performa perangkat serta Aimlock Assist terintegrasi untuk mendukung kontrol permainan. Setiap konfigurasi diproses melalui Vortex Engine untuk menghadirkan pengalaman gaming yang lebih stabil, responsif, dan konsisten.',
    features: [
      'Panel Injector Vortex Setting',
      'Aimlock Assist 30%',
      'Touch Tracking Boost',
      'Input Latency Reducer',
      'Quantum Sync',
      'DragShot Config',
      'Vector Glide',
      'Pulse Trigger',
      'Apex Tuning',
      'Snap Surge',
      'FPS Boost',
      'Rendering Tuning',
      'Thermal Stability Mode',
      'Surface Optimizer',
      'Vortex Mode',
      'Flux Motion',
      'Render Pulse',
      'Core Shield',
      'Hyper Refresh',
      'Phantom View',
      'Smart Switch Resolution & DPI',
      'Crosshair Aim Helper',
      'FPS Monitoring',
      'Performa Monitoring',
    ]
  }
];
