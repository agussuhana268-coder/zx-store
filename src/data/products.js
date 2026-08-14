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

export const products = [
  {
    id: 'zx-core',
    name: 'ZX CORE',
    price: 'Rp45.000',
    promoPrice: 'Rp30.000',
    slots: 'Tersedia 15 slot',
    badge: 'BASIC',
    features: [
      "Sensi Legit Basic",
      "Boost Engine",
      "Faster Transition",
      "GPU Boost Mode",
      "Limit Background Apps",
      "Auto Clear Cache",
      "Crosshair Overlay",
    ]
  },
  {
    id: 'zx-apex',
    name: 'ZX APEX',
    price: 'Rp95.000',
    promoPrice: 'Rp50.000',
    slots: 'Tersedia 8 slot',
    badge: 'PLATINUM',
    features: [
      "Sensi Legit High",
      "Boost Engine",
      "Pointer Speed Matrix",
      "Sensitivity Optimizer",
      "Acceleration Touch",
      "Pointering Level",
      "Auto Clear Cache",
      "Crosshair Overlay",
      "Performance Monitoring",
    ]
  },
  {
    id: 'zx-exclusive',
    name: 'ZX EXCLUSIVE',
    price: 'Rp125.000',
    promoPrice: 'Rp99.000',
    slots: 'Tersedia 5 slot',
    badge: 'PRO',
    features: [
      "Sensi Legit Pro",
      "Boost Engine",
      "Pointer Speed Matrix",
      "Sensitivity Optimizer",
      "Acceleration Touch",
      "Pointering Level",
      "Auto Clear Cache",
      "Rendering Tuning",
      "Flow Sync",
      "Drag Configuration",
      "Crosshair Overlay",
      "Performance Monitoring",
      "FPS Monitoring",
    ]
  },
  {
    id: 'zx-vortex',
    name: 'ZX VORTEX',
    price: 'Rp170.000',
    promoPrice: 'Rp139.000',
    slots: 'Tersedia 10 slot',
    badge: 'VIP',
    features: [
      "Panel Injector Vortex Setting",
      "Aimlock Assist 30%",
      "Touch Tracking Boost",
      "Input Latency Reducer",
      "Quantum Sync",
      "DragShot Config",
      "Vector Glide",
      "Pulse Trigger",
      "Apex Tuning",
      "Snap Surge",
      "FPS Boost",
      "Rendering Tuning",
      "Thermal Stability Mode",
      "Surface Optimizer",
      "Vortex Mode",
      "Flux Motion",
      "Render Pulse",
      "Core Shield",
      "Hyper Refresh",
      "Phantom View",
      "Smart Switch Resolution & DPI",
      "Crosshair Aim Helper",
      "FPS Monitoring",
      "Performa Monitoring",
    ]
  }
];
