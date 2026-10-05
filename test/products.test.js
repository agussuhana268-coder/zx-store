/**
 * Unit test for src/data/products.js
 * Validates product catalog data, duration options, platform labels,
 * compatibility ranges, and exact pricing specifications.
 */
import { products, NEXUS_INFO } from '../src/data/products.js';

function runProductTests() {
  console.log('--- Running Product Catalog & Duration Tests ---');
  let passed = 0;
  let failed = 0;

  function testAssert(condition, name) {
    if (condition) {
      console.log(`✓ ${name}`);
      passed++;
    } else {
      console.error(`✗ FAILED: ${name}`);
      failed++;
    }
  }

  // 1. Verify 3 products exist
  testAssert(Array.isArray(products) && products.length === 3, 'Catalog contains exactly 3 products');

  const nexus = products.find((p) => p.id === 'nexus-injector');
  const vortex = products.find((p) => p.id === 'zx-vortex');
  const insanity = products.find((p) => p.id === 'insanity-max');

  testAssert(Boolean(nexus), 'NEXUS INJECTOR exists in catalog');
  testAssert(Boolean(vortex), 'ZX VORTEX exists in catalog');
  testAssert(Boolean(insanity), 'INSANITY MAX exists in catalog');

  // 2. Platform checks
  testAssert(nexus.platform === 'Android', 'NEXUS platform is Android');
  testAssert(vortex.platform === 'Android', 'VORTEX platform is Android');
  testAssert(insanity.platform === 'iOS / iPhone', 'INSANITY MAX platform is iOS / iPhone');

  // 3. Compatibility checks
  testAssert(nexus.compatibility.includes('Android 11 - 17+'), 'NEXUS compatibility is Android 11 - 17+');
  testAssert(vortex.compatibility.toUpperCase().includes('ANDROID 11 - 17+'), 'VORTEX compatibility is Android 11 - 17+');
  testAssert(insanity.compatibility === 'iOS 15 - iOS 27', 'INSANITY MAX compatibility is iOS 15 - iOS 27');

  // 4. NEXUS durations & prices
  testAssert(Array.isArray(nexus.durations) && nexus.durations.length === 3, 'NEXUS has 3 duration options');
  const nexus10 = nexus.durations.find((d) => d.label === '10 Hari');
  const nexus18 = nexus.durations.find((d) => d.label === '18 Hari');
  const nexusPerm = nexus.durations.find((d) => d.label === 'Permanen');
  testAssert(nexus10?.price === 'Rp20.000', 'NEXUS 10 Hari is Rp20.000');
  testAssert(nexus18?.price === 'Rp30.000', 'NEXUS 18 Hari is Rp30.000');
  testAssert(nexusPerm?.price === 'Rp60.000', 'NEXUS Permanen is Rp60.000');

  // 5. VORTEX durations & prices
  testAssert(Array.isArray(vortex.durations) && vortex.durations.length === 3, 'VORTEX has 3 duration options');
  const vortex10 = vortex.durations.find((d) => d.label === '10 Hari');
  const vortex18 = vortex.durations.find((d) => d.label === '18 Hari');
  const vortexPerm = vortex.durations.find((d) => d.label === 'Permanen');
  testAssert(vortex10?.price === 'Rp59.000', 'VORTEX 10 Hari is Rp59.000');
  testAssert(vortex18?.price === 'Rp79.000', 'VORTEX 18 Hari is Rp79.000');
  testAssert(vortexPerm?.price === 'Rp149.000', 'VORTEX Permanen is Rp149.000');

  // 6. INSANITY MAX durations & prices
  testAssert(Array.isArray(insanity.durations) && insanity.durations.length === 4, 'INSANITY MAX has 4 duration options');
  const ins5 = insanity.durations.find((d) => d.label === '5 Hari');
  const ins15 = insanity.durations.find((d) => d.label === '15 Hari');
  const ins20 = insanity.durations.find((d) => d.label === '20 Hari');
  const insPerm = insanity.durations.find((d) => d.label === 'Permanen');
  testAssert(ins5?.price === 'Rp40.000', 'INSANITY MAX 5 Hari is Rp40.000');
  testAssert(ins15?.price === 'Rp70.000', 'INSANITY MAX 15 Hari is Rp70.000');
  testAssert(ins20?.price === 'Rp150.000', 'INSANITY MAX 20 Hari is Rp150.000');
  testAssert(insPerm?.price === 'Rp250.000', 'INSANITY MAX Permanen is Rp250.000');

  // 7. INSANITY MAX features
  const expectedInsFeatures = [
    'Dragshot Config',
    'Assist Head',
    'Tweak Config',
    'FPS Booster',
    'Smooth Aim',
    'AImHead Settings',
    'Optimize Recoil',
    'Headlock 45%',
    'Bypass Protection',
    'Cache Cleaner',
  ];
  testAssert(
    insanity.features.length === expectedInsFeatures.length &&
      expectedInsFeatures.every((f) => insanity.features.includes(f)),
    'INSANITY MAX features match all 10 required features'
  );

  // 8. INSANITY MAX description
  const expectedDesc =
    'Insanity Max adalah tools app khusus iOS/iPhone yang menggunakan sistem injector dan mekanisme konfigurasi terstruktur untuk mengoptimalkan berbagai parameter pada lingkungan perangkat dan game. Setiap konfigurasi diproses melalui sistem internal sebelum diterapkan, sehingga pengaturan dapat disesuaikan secara fleksibel dengan karakteristik perangkat dan kebutuhan pengguna. Dirancang dengan pendekatan optimasi yang terintegrasi untuk menghasilkan pengalaman gaming yang lebih stabil, responsif, smooth, dan konsisten tanpa mengubah sistem iOS secara permanen.';
  testAssert(insanity.description === expectedDesc, 'INSANITY MAX description matches required text exactly');

  // 9. Duration independence (no shared arrays/objects)
  testAssert(nexus.durations !== vortex.durations, 'NEXUS and VORTEX durations are distinct instances');
  testAssert(nexus.durations !== insanity.durations, 'NEXUS and INSANITY MAX durations are distinct instances');

  // 10. NEXUS_INFO backwards compatibility
  testAssert(Boolean(NEXUS_INFO?.name), 'NEXUS_INFO continues to be exported correctly');

  console.log(`Product Tests finished: ${passed} passed, ${failed} failed.`);

  if (failed > 0) {
    process.exit(1);
  }
}

runProductTests();
