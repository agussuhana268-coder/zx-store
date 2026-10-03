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
  Check, 
  ArrowRight,
  Terminal,
  Cpu as EngineIcon,
  Shield,
  Smartphone
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
  const [hoveredFeature, setHoveredFeature] = useState(null);

  const filteredFeatures = selectedCategory === 'Semua Fitur'
    ? NEXUS_INFO.features
    : NEXUS_INFO.features.filter((f) => f.category === selectedCategory);

  return (
    <section id="nexus-info" className="nexus-showcase-section reveal">
      {/* Nexus Engine Architecture Banner */}
      <div className="nexus-hero-card">
        <div className="nexus-glow-blob"></div>
        <div className="nexus-card-header">
          <div className="nexus-badge-pill">
            <span className="pulsing-dot"></span>
            <span>NEXUS ENGINE v2.0 • OFFICIAL ARCHITECTURE</span>
          </div>
          <span className="nexus-license-tag">LIFETIME / PERMANEN</span>
        </div>

        <h2 className="nexus-headline">
          Sistem Optimasi Android Generasi Baru
        </h2>

        <div className="nexus-description-box">
          <div className="nexus-quote-bar"></div>
          <p className="nexus-official-description">
            &ldquo;{NEXUS_INFO.description}&rdquo;
          </p>
        </div>

        {/* 3 Pillars Architecture */}
        <div className="nexus-pillars-grid">
          <div className="nexus-pillar-card">
            <div className="pillar-icon-box cyan">
              <EngineIcon size={22} />
            </div>
            <div className="pillar-content">
              <h4>1. Nexus Engine Processing</h4>
              <p>Setiap konfigurasi diolah dan distrukturisasi secara real-time sebelum proses injection ke game.</p>
            </div>
          </div>

          <div className="nexus-pillar-card">
            <div className="pillar-icon-box purple">
              <Smartphone size={22} />
            </div>
            <div className="pillar-content">
              <h4>2. Structured System Injection</h4>
              <p>Menerapkan setting sensitivitas, frame rate & resolusi secara presisi ke environment perangkat.</p>
            </div>
          </div>

          <div className="nexus-pillar-card">
            <div className="pillar-icon-box green">
              <Shield size={22} />
            </div>
            <div className="pillar-content">
              <h4>3. Zero Permanent Modification</h4>
              <p>Sistem tetap aman dan terkontrol tanpa mengubah file sistem OS Android secara permanen.</p>
            </div>
          </div>
        </div>

        {/* Quick Spec Tags */}
        <div className="nexus-meta-tags">
          <div className="meta-tag">
            <ShieldCheck size={14} className="meta-icon" />
            <span>Non-Permanent Injection</span>
          </div>
          <div className="meta-tag">
            <Terminal size={14} className="meta-icon" />
            <span>Plug & Play (No Root Required)</span>
          </div>
          <div className="meta-tag">
            <Zap size={14} className="meta-icon" />
            <span>0ms Input Latency</span>
          </div>
          <div className="meta-tag">
            <Check size={14} className="meta-icon" />
            <span>Support Android 9 - 14+</span>
          </div>
        </div>

        {/* Price & Order Action Bar */}
        <div className="nexus-cta-strip">
          <div className="nexus-pricing-info">
            <span className="pricing-label">Harga Lisensi Penuh:</span>
            <div className="pricing-val-wrap">
              <span className="pricing-amount">{NEXUS_INFO.price}</span>
              <span className="pricing-duration">/ Permanen (Lifetime)</span>
            </div>
          </div>
          <button
            type="button"
            className="nexus-order-btn"
            onClick={onSelectNexus}
          >
            <span>Dapatkan Nexus Injector v2.0</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>

      {/* Feature Showcase Grid (16 Features) */}
      <div id="nexus-features" className="nexus-features-module">
        <div className="module-header">
          <div className="module-title-wrap">
            <span className="module-kicker">FITUR LENGKAP NEXUS INJECTOR v2.0</span>
            <h3 className="module-title">16 Modul Optimasi Terintegrasi</h3>
          </div>
          <p className="module-desc">
            Dilengkapi konfigurasi sensitivitas, kontrol resolusi kustom, hingga N-CORE AI dan Kernel Matrix.
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="feature-category-tabs">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`cat-tab-btn ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              <span>{cat}</span>
              {cat === 'Semua Fitur' && <span className="cat-count">16</span>}
            </button>
          ))}
        </div>

        {/* Features Grid */}
        <div className="features-showcase-grid">
          {filteredFeatures.map((feat) => {
            const Icon = iconMap[feat.name] || Zap;
            const isHovered = hoveredFeature === feat.name;
            return (
              <div
                key={feat.name}
                className={`feature-box ${isHovered ? 'hovered' : ''}`}
                onMouseEnter={() => setHoveredFeature(feat.name)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                <div className="feature-box-top">
                  <div className="feature-icon-bubble">
                    <Icon size={18} />
                  </div>
                  <span className="feature-category-pill">{feat.tag || feat.category}</span>
                </div>
                <h4 className="feature-box-title">{feat.name}</h4>
                <p className="feature-box-desc">{feat.desc}</p>
                <div className="feature-status-line">
                  <span className="feature-active-dot"></span>
                  <span className="feature-status-text">Active Module</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
