import { MousePointerClick, FileText, MessageCircle, CheckCircle2 } from 'lucide-react';

const steps = [
  {
    step: '01',
    title: 'Pilih Produk',
    description: 'Pilih Nexus Injector v2.0 (Rp60.000) atau produk yang sesuai dengan perangkat dan kebutuhan kamu.',
    icon: MousePointerClick,
  },
  {
    step: '02',
    title: 'Lengkapi Data',
    description: 'Ketikkan nama lengkap dan nomor WhatsApp aktif pada formulir pemesanan cepat.',
    icon: FileText,
  },
  {
    step: '03',
    title: 'Teruskan ke WhatsApp',
    description: 'Pesan pemesanan otomatis terformat dan langsung dikirim ke WhatsApp resmi admin ZetXiters.',
    icon: MessageCircle,
  },
  {
    step: '04',
    title: 'Aktivasi Instan',
    description: 'Lakukan pembayaran dan admin akan langsung mengirimkan file injector beserta panduan instalasi lengkap.',
    icon: CheckCircle2,
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="how-it-works-section reveal">
      <div className="section-header-block">
        <span className="section-eyebrow">PANDUAN PEMBELIAN</span>
        <h2 className="section-title">Cara Order Cepat & Praktis</h2>
        <p className="section-subtitle">
          Proses pemesanan digital otomatis terintegrasi langsung dengan Customer Service via WhatsApp.
        </p>
      </div>

      <div className="steps-grid">
        {steps.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className="step-card reveal"
              style={{ transitionDelay: `${index * 80}ms` }}
            >
              <div className="step-card-header">
                <span className="step-number">{item.step}</span>
                <div className="step-icon-wrapper">
                  <Icon size={18} className="step-icon" />
                </div>
              </div>
              <h3 className="step-title">{item.title}</h3>
              <p className="step-description">{item.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
