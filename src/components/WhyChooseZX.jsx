import { ShieldCheck, Smartphone, TrendingUp, CheckCircle, Key, Headphones } from 'lucide-react';

const companyBenefits = [
  {
    icon: ShieldCheck,
    title: 'Keamanan Sistem Terjamin',
    description: 'Seluruh konfigurasi ZetXiters dirancang berjalan tanpa memerlukan akses root/jailbreak dan tanpa mengubah partisi sistem perangkat secara permanen.',
    tag: 'Keamanan',
  },
  {
    icon: Smartphone,
    title: 'Kompatibilitas Android & iOS',
    description: 'Teruji dan kompatibel penuh pada perangkat Android (versi 11 - 17+) maupun iOS (iPhone iOS 15 - 27).',
    tag: 'Kompatibilitas',
  },
  {
    icon: TrendingUp,
    title: 'Optimalisasi Terkalibrasi',
    description: 'Fokus pada peningkatan respon sentuhan layar, pengurangan touch latency, dan stabilitas frame rate game yang konsisten.',
    tag: 'Performa',
  },
  {
    icon: CheckCircle,
    title: 'Pengiriman Digital Instan',
    description: 'File lisensi dan paket aplikasi dikirimkan secara instan dan aman langsung melalui WhatsApp resmi ZetXiters.',
    tag: 'Layanan Cepat',
  },
  {
    icon: Key,
    title: 'Pilihan Durasi & Permanen',
    description: 'Tersedia pilihan durasi fleksibel hingga lisensi permanen (lifetime) tanpa biaya langganan bulanan tersembunyi.',
    tag: 'Fleksibel',
  },
  {
    icon: Headphones,
    title: 'Pendampingan Teknis Resmi',
    description: 'Didukung panduan tutorial lengkap serta tim teknis ZetXiters yang siap membantu kendala pemasangan hingga berhasil.',
    tag: 'Support Resmi',
  },
];

export default function WhyChooseZX() {
  return (
    <section id="company-benefits" className="benefits-section reveal">
      <div className="section-head">
        <span className="section-pretitle">STANDAR KUALITAS KAMI</span>
        <h2 className="section-main-title">Keunggulan Layanan ZetXiters</h2>
        <p className="section-subtext">
          Alasan mengapa ribuan pengguna mempercayakan optimasi gaming perangkat mereka kepada ZetXiters Company.
        </p>
      </div>

      <div className="benefits-card-grid">
        {companyBenefits.map((item, index) => {
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
