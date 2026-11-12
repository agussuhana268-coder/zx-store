import { useState, useEffect } from 'react';
import { Check, ArrowRight, ShieldCheck, ChevronDown, Info } from 'lucide-react';
import { calculateSavings } from '../data/products';
import PlatformIcon from './PlatformIcon';

export default function ProductCard({ product, index, isPromo, onSelectProduct }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const isUnavailable = product.availability === 'coming-soon';

  const defaultDuration =
    product?.durations?.find((d) => d.isDefault) ||
    product?.durations?.[0] ||
    null;

  const [selectedDuration, setSelectedDuration] = useState(defaultDuration);

  // Synchronize duration if product changes
  useEffect(() => {
    const nextDefault =
      product?.durations?.find((d) => d.isDefault) ||
      product?.durations?.[0] ||
      null;
    setSelectedDuration(nextDefault);
  }, [product]);

  const features = Array.isArray(product.features) ? product.features : [];
  const initialCount = 8;
  const canExpand = features.length > initialCount;
  const delayStyle = index !== undefined ? { transitionDelay: `${index * 60}ms` } : undefined;

  const initialFeatures = features.slice(0, initialCount);
  const extraFeatures = features.slice(initialCount);

  // Current active pricing & license based on selected duration
  const activePrice = selectedDuration ? selectedDuration.price : product.price;
  const activePromoPrice = selectedDuration?.promoPrice || null;
  const hasActivePromo = Boolean(isPromo && activePromoPrice);
  const savings = hasActivePromo ? calculateSavings(activePrice, activePromoPrice) : null;
  const isLifetimeDuration = /permanen|lifetime/i.test(selectedDuration?.label || '');
  const activeLicense = selectedDuration
    ? (isLifetimeDuration
        ? (product.license || 'Lisensi Permanen / Sekali Bayar')
        : `Lisensi Aktif ${selectedDuration.label}`)
    : (product.license || 'Lisensi Permanen / Sekali Bayar');

  const handleOrder = () => {
    onSelectProduct({
      ...product,
      selectedDuration,
      price: activePrice,
      promoPrice: activePromoPrice,
      license: isLifetimeDuration
        ? (product.license || 'PERMANEN / LIFETIME')
        : `DURASI ${selectedDuration ? selectedDuration.label.toUpperCase() : ''}`,
    });
  };

  const isIos = product.platform?.toLowerCase().includes('ios');

  return (
    <div className="pricing-card reveal" style={delayStyle}>
      <div className="card-top-content">
        <div className="card-header-row">
          <div>
            <h3 className="card-product-title">{product.name}</h3>
            <div className="card-tags-row">
              {product.platform && (
                <span className={`card-platform-pill ${isIos ? 'ios' : 'android'}`}>
                  <PlatformIcon platform={product.platform} size={12} className="platform-icon" />
                  <span>{product.platform}</span>
                </span>
              )}
              {product.compatibility && (
                <div className="card-compat-pill">
                  <span>{product.compatibility}</span>
                </div>
              )}
            </div>
          </div>
          {product.badge && (
            <div className="card-badge-container">
              <span className={`badge-standard ${isIos ? 'badge-ios' : ''}`}>{product.badge}</span>
            </div>
          )}
        </div>

        {product.videoPreviewId && (
          <div className="product-video-preview">
            <button
              type="button"
              className="btn-video-preview"
              onClick={() => setShowVideo((current) => !current)}
              aria-expanded={showVideo}
            >
              <span className="video-play-icon">▶</span>
              <span>{showVideo ? 'Tutup Video Preview' : 'Tonton Video Preview'}</span>
            </button>
            {showVideo && (
              <div className="product-video-frame">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${product.videoPreviewId}?autoplay=1&rel=0`}
                  title={`Video preview ${product.name}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>
            )}
          </div>
        )}

        {product.description && (
          <div className="card-description-box">
            <p className={`card-description-text ${showFullDesc ? 'expanded' : ''}`}>
              {product.description}
            </p>
            {product.description.length > 150 && (
              <button
                type="button"
                className="btn-toggle-desc"
                onClick={() => setShowFullDesc(!showFullDesc)}
              >
                <Info size={12} />
                <span>{showFullDesc ? 'Sembunyikan deskripsi' : 'Selengkapnya'}</span>
              </button>
            )}
          </div>
        )}

        {/* Duration Selector */}
        {!isUnavailable && product.durations && product.durations.length > 0 && (
          <div className="card-duration-selector">
            <span className="duration-selector-label">Pilihan Durasi Lisensi:</span>
            <div className="duration-options-grid">
              {product.durations.map((dur) => {
                const isSelected = selectedDuration?.id === dur.id;
                return (
                  <button
                    key={dur.id}
                    type="button"
                    className={`btn-duration-option ${isSelected ? 'active' : ''}`}
                    onClick={() => setSelectedDuration(dur)}
                    aria-pressed={isSelected}
                  >
                    <span className="duration-btn-label">{dur.label}</span>
                    <span className="duration-btn-price">{dur.price}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {!isUnavailable ? <div className="card-price-block">
          {hasActivePromo ? (
            <div>
              <div className="card-price-val">{activePromoPrice}</div>
              <div className="card-price-sub">
                <span className="price-strikethrough">{activePrice}</span>
                {savings && <span className="price-savings-tag">{savings}</span>}
              </div>
            </div>
          ) : (
            <div>
              <div className="card-price-val">{activePrice}</div>
              <div className="card-price-note">
                <ShieldCheck size={13} className="note-shield" />
                <span>{activeLicense}</span>
              </div>
            </div>
          )}
        </div> : (
          <div className="card-price-block coming-soon-price">
            <div className="coming-soon-title">COMING SOON</div>
            <div className="card-price-note">Produk sementara belum tersedia untuk dipesan.</div>
          </div>
        )}

        <div className={`card-availability-line ${isUnavailable ? 'unavailable' : ''}`}>
          <span className="avail-dot"></span>
          <span>{product.slots || 'Aktivasi Instan via WhatsApp'}</span>
        </div>

        <hr className="card-separator" />

        <div className="card-features-block">
          <span className="features-label">Fitur yang disertakan ({features.length}):</span>
          <ul className="features-list">
            {initialFeatures.map((feat, i) => (
              <li key={i} className="feature-line">
                <Check size={15} className="feature-check-icon" />
                <span>{typeof feat === 'string' ? feat : feat.name}</span>
                {typeof feat !== 'string' && feat.isNew && <span className="feature-new-badge">NEW</span>}
              </li>
            ))}
          </ul>

          {canExpand && (
            <>
              <div className={`features-accordion ${isExpanded ? 'open' : ''}`}>
                <ul className="features-list extra-list">
                  {extraFeatures.map((feat, i) => (
                    <li key={i + initialCount} className="feature-line">
                      <Check size={15} className="feature-check-icon" />
                      <span>{typeof feat === 'string' ? feat : feat.name}</span>
                      {typeof feat !== 'string' && feat.isNew && <span className="feature-new-badge">NEW</span>}
                    </li>
                  ))}
                </ul>
              </div>

              <button
                type="button"
                className="features-toggle-btn"
                onClick={() => setIsExpanded(!isExpanded)}
                aria-expanded={isExpanded}
              >
                <span>{isExpanded ? 'Tutup Fitur' : `+${extraFeatures.length} Fitur Lainnya`}</span>
                <ChevronDown size={14} className={`toggle-icon ${isExpanded ? 'rotate' : ''}`} />
              </button>
            </>
          )}
        </div>

        {Array.isArray(product.advantages) && product.advantages.length > 0 && (
          <div className="card-features-block card-advantages-block">
            <span className="features-label">Keunggulan:</span>
            <ul className="features-list">
              {product.advantages.map((item, i) => (
                <li key={i} className="feature-line">
                  <Check size={15} className="feature-check-icon" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <button
        type="button"
        className={`btn-card-order primary ${isUnavailable ? 'disabled' : ''}`}
        onClick={handleOrder}
        disabled={isUnavailable}
        aria-disabled={isUnavailable}
      >
        <span>{isUnavailable ? 'Belum Tersedia' : `Pesan ${product.name}`}</span>
        {!isUnavailable && <ArrowRight size={15} />}
      </button>
    </div>
  );
}
