import { Zap, ShieldCheck, Headphones, Sparkles } from 'lucide-react';

const benefits = [
  {
    icon: Zap,
    title: 'Digital Delivery',
    description: 'Proses aktivasi produk secara digital.',
  },
  {
    icon: ShieldCheck,
    title: 'Secure Access',
    description: 'Setiap produk menggunakan akses yang terkontrol.',
  },
  {
    icon: Headphones,
    title: 'Dedicated Support',
    description: 'Bantuan tersedia melalui WhatsApp.',
  },
  {
    icon: Sparkles,
    title: 'Premium Experience',
    description: 'Produk dan layanan dirancang dengan pengalaman yang sederhana.',
  },
];

export default function WhyChooseZX() {
  return (
    <section className="why-choose-section">
      <h2 className="section-title reveal">Why Choose ZX</h2>
      <div className="benefits-grid">
        {benefits.map((benefit, index) => {
          const Icon = benefit.icon;
          return (
            <div
              key={index}
              className="benefit-card reveal"
              style={{ transitionDelay: `${index * 60}ms` }}
            >
              <div className="benefit-icon-wrapper">
                <Icon size={20} className="benefit-icon" />
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
