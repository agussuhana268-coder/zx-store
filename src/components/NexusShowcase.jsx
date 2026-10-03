import { useState } from 'react';
import { 
  Zap, 
  Crosshair, 
  Eye, 
  Flame, 
  Target, 
  Sliders, 
  Timer, 
  FastForward, 
  MousePointer, 
  Maximize2, 
  Monitor, 
  Layers, 
  Cpu, 
  Sparkles, 
  Activity, 
  ShieldCheck, 
  Compass, 
  ArrowRight,
  Smartphone,
  CheckCircle2
} from 'lucide-react';
import { NEXUS_INFO } from '../data/products';

const iconMap = {
  Performance: Zap,
  Aim: Crosshair,
  Graphics: Eye,
  Boost: Flame,
  'Smart Tracking': Target,
  Tracking: Compass,
  'Sensi High': Sliders,
  'Anti Delay': Timer,
  'Flicking Pro': FastForward,
  'Drag Precision': MousePointer,
  'Preset Resolusi R-1 R-2 R-3': Maximize2,
  'Custom Resolusi': Monitor,
  'Kustom DPI': Layers,
  'N-CORE AI': Cpu,
  'System Clean': Sparkles,
  'Kernel Matrix': Activity,
};

const categories = ['Semua Fitur', 'Aim & Precision', 'Display & Tuning', 'Engine & System'];

export default function NexusShowcase({ onSelectNexus }) {
  const [selectedCategory, setSelectedCategory] = useState('Semua Fitur');

  const filteredFeatures = selectedCategory === 'Semua Fitur'
    ? NEXUS_INFO.features
    : NEXUS_INFO.features.filter((f) => f.category === selectedCategory);

  return (
    <section id="nexus-info" className="nexus-showcase-section reveal">
      {/* Product Overview Card */}
      <div className="nexus-overview-card">
        <div className="overview-header">
          <div className="overview-title-group">
            <span className="overview-kicker">INFORMASI RESMI SISTEM</span>
            <h2 className="overview-title">Nexus Injector v2.0</h2>
          </div>
          <div className="overview-badge-group">
            <span className="badge-os-compat">ANDROID 11 - 16+ (NEW VERSION)</span>
            <span className="badge-license">LISENSI PERMANEN</span>
          </div>
        </div>

        {/* Official Description */}
        <div className="nexus-quote-container">
          <p className="nexus-quote-text">
            &ldquo;{NEXUS_INFO.description}&rdquo;
          </p>
        </div>

        {/* Architecture Breakdown */}
        <div className="architecture-grid">
          <div className="arch-card">
            <div className="arch-num">01</div>
            <div className="arch-body">
              <h3 className="arch-title">Nexus Engine Processing</h3>
              <p className="arch-desc">
                Setiap konfigurasi diolah dan distrukturisasi secara real-time sebelum proses injection ke game.
              </p>
            </div>
          </div>

          <div className="arch-card">
            <div className="arch-num">02</div>
            <div className="arch-body">
              <h3 className="arch-title">Structured System Injection</h3>
              <p className="arch-desc">
                Menerapkan parameter resolusi, DPI, dan sensitivitas secara presisi ke lingkungan game tanpa mengubah OS permanen.
              </p>
            </div>
          </div>

          <div className="arch-card">
            <div className="arch-num">03</div>
            <div className="arch-body">
              <h3 className="arch-title">Zero Permanent Modification</h3>
              <p className="arch-desc">
                Sistem perangkat Android tetap murni dan aman (Non-Root), bebas risiko kerusakan partisi OS.
              </p>
            </div>
          </div>
        </div>

        {/* System Highlights Strip */}
        <div className="overview-footer-bar">
          <div className="system-pill-list">
            <div className="system-pill">
              <CheckCircle2 size={15} className="pill-check-icon" />
              <span>Kompatibel: <strong>ANDROID 11 - 16+ (NEW VERSION)</strong></span>
            </div>
            <div className="system-pill">
              <ShieldCheck size={15} className="pill-check-icon" />
              <span>Keamanan: <strong>100% Non-Root Safe</strong></span>
            </div>
            <div className="system-pill">
              <Smartphone size={15} className="pill-check-icon" />
              <span>Format: <strong>Lisensi Lifetime (Rp60.000)</strong></span>
            </div>
          </div>

          <button
            type="button"
            className="btn-overview-order"
            onClick={onSelectNexus}
          >
            <span>Order Lisensi Nexus (Rp60.000)</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* 16 Features Spec Sheet */}
      <div id="nexus-features" className="nexus-features-section">
        <div className="features-section-header">
          <div className="section-title-wrap">
            <span className="section-kicker">SPESIFIKASI & KAPABILITAS</span>
            <h3 className="section-heading">16 Modul Optimasi Terintegrasi</h3>
          </div>
          <p className="section-subheading">
            Daftar lengkap modul yang aktif secara terstruktur saat Nexus Injector diterapkan pada perangkat Anda.
          </p>
        </div>

        {/* Category Filter */}
        <div className="category-filter-bar">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`filter-btn ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              <span>{cat}</span>
              {cat === 'Semua Fitur' && <span className="filter-count">16</span>}
            </button>
          ))}
        </div>

        {/* Feature Grid */}
        <div className="feature-spec-grid">
          {filteredFeatures.map((feat) => {
            const Icon = iconMap[feat.name] || Zap;
            return (
              <div key={feat.name} className="feature-spec-card">
                <div className="feature-card-header">
                  <div className="feature-icon-wrapper">
                    <Icon size={18} />
                  </div>
                  <span className="feature-tag">{feat.tag || feat.category}</span>
                </div>
                <h4 className="feature-title">{feat.name}</h4>
                <p className="feature-desc">{feat.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
