import { ArrowRight, ShieldCheck, Smartphone, CheckCircle, Award } from 'lucide-react';

export default function Hero() {
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const nav = document.querySelector('.secondary-nav-wrapper');
      const offset = nav ? nav.offsetHeight : 52;
      const top = el.getBoundingClientRect().top + window.pageYOffset - offset - 16;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <section className="company-hero-section reveal">
      <div className="company-badge-pill">
        <span className="badge-dot"></span>
        <span>MDZZXITERS • OFFICIAL STORE</span>
      </div>

      <h1 className="company-hero-heading">
        Mdzz Official Store <br className="hero-break" />
        <span className="heading-accent">Tools Gaming Android Terpercaya</span>
      </h1>

      <p className="company-hero-description">
        <strong>ZetXiters Company</strong> mengembangkan produk konfigurasi sistem terstruktur yang dirancang
        untuk menghadirkan akurasi tinggi, respon sentuhan instan, dan kestabilan performa gaming tanpa
        mengubah sistem perangkat secara permanen.
      </p>

      <div className="company-hero-actions">
        <button
          type="button"
          className="btn-company-primary"
          onClick={() => scrollTo('products-catalog')}
        >
          <span>Lihat Katalog Produk Resmi</span>
          <ArrowRight size={16} />
        </button>

        <button
          type="button"
          className="btn-company-secondary"
          onClick={() => scrollTo('about-company')}
        >
          <span>Tentang ZetXiters</span>
        </button>
      </div>

      <div className="company-highlights-row">
        <div className="company-highlight-card">
          <div className="highlight-icon-wrap">
            <Award size={18} />
          </div>
          <div className="highlight-content">
            <span className="highlight-title">Pengembang Resmi</span>
            <span className="highlight-desc">Divisi resmi dari MDZZXITERS</span>
          </div>
        </div>

        <div className="company-highlight-card">
          <div className="highlight-icon-wrap">
            <ShieldCheck size={18} />
          </div>
          <div className="highlight-content">
            <span className="highlight-title">Non-Permanent Safe</span>
            <span className="highlight-desc">Tanpa root & aman partisi sistem</span>
          </div>
        </div>

        <div className="company-highlight-card">
          <div className="highlight-icon-wrap">
            <Smartphone size={18} />
          </div>
          <div className="highlight-content">
            <span className="highlight-title">Dukungan Versi OS</span>
            <span className="highlight-desc">ANDROID 11 - 17+ (NEW VERSION)</span>
          </div>
        </div>

        <div className="company-highlight-card">
          <div className="highlight-icon-wrap">
            <CheckCircle size={18} />
          </div>
          <div className="highlight-content">
            <span className="highlight-title">Aktivasi Instan</span>
            <span className="highlight-desc">Pengiriman file via WhatsApp resmi</span>
          </div>
        </div>
      </div>
    </section>
  );
}
