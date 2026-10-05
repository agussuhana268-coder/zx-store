import { MousePointerClick, FileText, QrCode, CheckCircle2 } from 'lucide-react';

const steps = [
  {
    step: '01',
    title: 'Pilih Produk di Katalog',
    description: 'Tentukan produk yang sesuai dengan spesifikasi perangkat dan kebutuhan Anda dari katalog resmi ZetXiters.',
    icon: MousePointerClick,
  },
  {
    step: '02',
    title: 'Lengkapi Data Pemesanan',
    description: 'Klik tombol pesan dan masukkan nama lengkap serta nomor WhatsApp aktif Anda pada formulir.',
    icon: FileText,
  },
  {
    step: '03',
    title: 'Pembayaran via QRIS',
    description: 'Scan kode QRIS DANA secara instan menggunakan aplikasi e-wallet atau mobile banking Anda.',
    icon: QrCode,
  },
  {
    step: '04',
    title: 'Aktivasi & Panduan Lengkap',
    description: 'Setelah pembayaran diverifikasi, unduh paket file produk beserta panduan instalasi lengkap.',
    icon: CheckCircle2,
  },
];

export default function HowItWorks() {
  return (
    <section id="order-guide" className="steps-section reveal">
      <div className="section-head">
        <span className="section-pretitle">ALUR TRANSAKSI</span>
        <h2 className="section-main-title">Cara Pemesanan di ZetXiters</h2>
        <p className="section-subtext">
          Alur mudah, transparan, dan terhubung langsung dengan Customer Service resmi kami.
        </p>
      </div>

      <div className="steps-row-grid">
        {steps.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className="step-item-card reveal"
              style={{ transitionDelay: `${index * 50}ms` }}
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
