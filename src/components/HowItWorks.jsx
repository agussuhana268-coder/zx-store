import { MousePointerClick, FileText, MessageCircle, CheckCircle2 } from 'lucide-react';

const steps = [
  {
    step: '01',
    title: 'Pilih Lisensi',
    description: 'Pilih produk Nexus Injector v2.0 (Rp60.000) atau produk sesuai kebutuhan perangkat kamu.',
    icon: MousePointerClick,
  },
  {
    step: '02',
    title: 'Isi Data Pemesan',
    description: 'Masukkan nama lengkap dan nomor WhatsApp aktif pada formulir pemesanan cepat.',
    icon: FileText,
  },
  {
    step: '03',
    title: 'Konfirmasi via WhatsApp',
    description: 'Pesan pemesanan terformat otomatis akan langsung diteruskan ke WhatsApp Admin resmi.',
    icon: MessageCircle,
  },
  {
    step: '04',
    title: 'Aktivasi & Panduan',
    description: 'Setelah pembayaran selesai, Admin langsung mengirimkan file injector beserta tutorial instalasi.',
    icon: CheckCircle2,
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="steps-section reveal">
      <div className="section-head">
        <span className="section-pretitle">PANDUAN PEMBELIAN</span>
        <h2 className="section-main-title">4 Langkah Mudah Pemesanan</h2>
        <p className="section-subtext">
          Alur pemesanan digital langsung terintegrasi dengan Customer Service resmi kami.
        </p>
      </div>

      <div className="steps-row-grid">
        {steps.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className="step-item-card reveal"
              style={{ transitionDelay: `${index * 60}ms` }}
            >
              <div className="step-card-top-line">
                <span className="step-badge-num">{item.step}</span>
                <div className="step-icon-box">
                  <Icon size={16} />
                </div>
              </div>
              <h3 className="step-item-title">{item.title}</h3>
              <p className="step-item-desc">{item.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
