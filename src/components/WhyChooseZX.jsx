import { ShieldCheck, Cpu, Zap, Headphones, Sparkles, Smartphone } from 'lucide-react';

const benefits = [
  {
    icon: ShieldCheck,
    title: 'Non-Permanent Injection',
    description: 'Konfigurasi diterapkan terkontrol tanpa mengubah partisi OS Android secara permanen sehingga perangkat tetap aman.',
    tag: 'Safe Architecture',
  },
  {
    icon: Cpu,
    title: 'Nexus Engine Core',
    description: 'Instruksi gaming diproses terlebih dahulu melalui Nexus Engine guna menyeimbangkan alokasi CPU dan GPU.',
    tag: 'Smart Engine',
  },
  {
    icon: Zap,
    title: 'Zero Latency & Anti Delay',
    description: 'Touch sampling rate ditingkatkan sehingga input layar merespons sentuhan jari secara instan tanpa jeda.',
    tag: 'Extreme Speed',
  },
  {
    icon: Smartphone,
    title: 'Plug & Play (No Root)',
    description: 'Bisa langsung digunakan di perangkat Android 9 hingga 14+ tanpa perlu membongkar root atau UBL.',
    tag: 'Easy Setup',
  },
  {
    icon: Sparkles,
    title: 'Lisensi Permanen / Lifetime',
    description: 'Sekali beli Rp60.000 berlaku selamanya, termasuk update konfigurasi adaptif saat ada patch game baru.',
    tag: 'One-Time Pay',
  },
  {
    icon: Headphones,
    title: 'Support WhatsApp 24/7',
    description: 'Didukung panduan video, langkah setting step-by-step, dan customer support siap memandu hingga aktif.',
    tag: 'Direct Assist',
  },
];

export default function WhyChooseZX() {
  return (
    <section className="why-choose-section reveal">
      <div className="section-header-block">
        <span className="section-eyebrow">KEUNGGULAN SISTEM</span>
        <h2 className="section-title">Mengapa Memilih Nexus & ZetXiters?</h2>
        <p className="section-subtitle">
          Solusi optimasi modern yang mengedepankan keamanan sistem perangkat, stabilitas performa, dan kemudahan instalasi.
        </p>
      </div>

      <div className="benefits-grid">
        {benefits.map((benefit, index) => {
          const Icon = benefit.icon;
          return (
            <div
              key={index}
              className="benefit-card reveal"
              style={{ transitionDelay: `${index * 60}ms` }}
            >
              <div className="benefit-card-top">
                <div className="benefit-icon-wrapper">
                  <Icon size={20} className="benefit-icon" />
                </div>
                <span className="benefit-badge">{benefit.tag}</span>
              </div>
              <h3 className="benefit-title">{benefit.title}</h3>
              <p className="benefit-description">{benefit.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
