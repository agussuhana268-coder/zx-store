import { useState, useEffect } from 'react';
import { Check, ArrowRight, ShieldCheck, ChevronDown, Info } from 'lucide-react';
import { calculateSavings } from '../data/products';
import PlatformIcon from './PlatformIcon';

export default function ProductCard({ product, index, isPromo, onSelectProduct }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showFullDesc, setShowFullDesc] = useState(false);

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
  const activeLicense = selectedDuration
    ? (selectedDuration.label.toLowerCase().includes('permanen')
        ? (product.license || 'Lisensi Permanen / Sekali Bayar')
        : `Lisensi Aktif ${selectedDuration.label}`)
    : (product.license || 'Lisensi Permanen / Sekali Bayar');

  const handleOrder = () => {
    onSelectProduct({
      ...product,
      selectedDuration,
      price: activePrice,
      promoPrice: activePromoPrice,
      license: selectedDuration?.label.toLowerCase().includes('permanen')
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
        {product.durations && product.durations.length > 0 && (
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

        <div className="card-price-block">
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
        </div>

        <div className="card-availability-line">
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
                <span>{feat}</span>
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
                      <span>{feat}</span>
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
      </div>

      <button
        type="button"
        className="btn-card-order primary"
        onClick={handleOrder}
      >
        <span>Pesan {product.name}</span>
        <ArrowRight size={15} />
      </button>
    </div>
  );
}
