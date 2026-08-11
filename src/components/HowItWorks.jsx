import { MousePointerClick, FileText, MessageCircle, CheckCircle2 } from 'lucide-react';

const steps = [
  {
    step: '01',
    title: 'Pilih Produk',
    description: 'Pilih produk yang sesuai dengan kebutuhan kamu.',
    icon: MousePointerClick,
  },
  {
    step: '02',
    title: 'Isi Data',
    description: 'Masukkan nama dan nomor WhatsApp.',
    icon: FileText,
  },
  {
    step: '03',
    title: 'Hubungi Admin',
    description: 'Detail pesanan otomatis dikirim ke WhatsApp admin.',
    icon: MessageCircle,
  },
  {
    step: '04',
    title: 'Aktivasi',
    description: 'Ikuti proses pembayaran dan aktivasi yang diberikan admin.',
    icon: CheckCircle2,
  },
];

export default function HowItWorks() {
  return (
    <section className="how-it-works-section">
      <h2 className="section-title reveal">Cara Order</h2>
      <p className="section-subtitle reveal">
        Langkah mudah dan praktis untuk pemesanan produk digital.
      </p>

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
                  <Icon size={16} className="step-icon" />
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
