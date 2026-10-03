import { ShieldCheck, Cpu, Zap, Headphones, Sparkles, Smartphone } from 'lucide-react';

const benefits = [
  {
    icon: ShieldCheck,
    title: 'Non-Permanent Injection',
    description: 'Konfigurasi diterapkan secara terkontrol tanpa mengubah partisi OS Android secara permanen sehingga perangkat tetap aman.',
    tag: 'Keamanan Sistem',
  },
  {
    icon: Smartphone,
    title: 'Support Versi Android Terbaru',
    description: 'Kompatibel penuh untuk perangkat ANDROID 11 - 16+ (NEW VERSION) tanpa perlu akses root atau Unlock Bootloader (UBL).',
    tag: 'Kompatibilitas',
  },
  {
    icon: Cpu,
    title: 'Nexus Engine Core',
    description: 'Semua instruksi game diproses terlebih dahulu melalui Nexus Engine guna menyeimbangkan alokasi CPU, GPU, dan frame pacing.',
    tag: 'Arsitektur',
  },
  {
    icon: Zap,
    title: 'Zero Latency & Anti Delay',
    description: 'Sampling rate layar dioptimasi agar respon input sentuhan jari bereaksi seketika tanpa ada jeda atau delay.',
    tag: 'Performa Sentuhan',
  },
  {
    icon: Sparkles,
    title: 'Lisensi Permanen / Sekali Bayar',
    description: 'Hanya Rp60.000 berlaku selamanya, termasuk dukungan pembaruan konfigurasi berkala saat ada update game.',
    tag: 'Biaya Terjangkau',
  },
  {
    icon: Headphones,
    title: 'Layanan Bantuan Resmi 24/7',
    description: 'Didukung panduan instalasi lengkap dan konsultasi teknis langsung dengan tim support via WhatsApp.',
    tag: 'Support Admin',
  },
];

export default function WhyChooseZX() {
  return (
    <section className="benefits-section reveal">
      <div className="section-head">
        <span className="section-pretitle">KEUNGGULAN SISTEM</span>
        <h2 className="section-main-title">Mengapa Memilih Nexus Injector & ZetXiters?</h2>
        <p className="section-subtext">
          Solusi terpercaya yang mengedepankan keamanan perangkat, performa kompetitif, dan kemudahan penggunaan.
        </p>
      </div>

      <div className="benefits-card-grid">
        {benefits.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className="benefit-item-card reveal"
              style={{ transitionDelay: `${index * 50}ms` }}
            >
              <div className="benefit-header">
                <div className="benefit-icon-container">
                  <Icon size={18} />
                </div>
                <span className="benefit-category-tag">{item.tag}</span>
              </div>
              <h3 className="benefit-card-title">{item.title}</h3>
              <p className="benefit-card-description">{item.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
