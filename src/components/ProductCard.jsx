import { useState } from 'react';
import { Check, ArrowRight, ShieldCheck, ChevronDown, Smartphone } from 'lucide-react';
import { calculateSavings } from '../data/products';

export default function ProductCard({ product, index, isPromo, onSelectProduct }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const features = Array.isArray(product.features) ? product.features : [];
  const initialCount = 8;
  const canExpand = features.length > initialCount;
  const delayStyle = index !== undefined ? { transitionDelay: `${index * 60}ms` } : undefined;

  const initialFeatures = features.slice(0, initialCount);
  const extraFeatures = features.slice(initialCount);

  const hasActivePromo = Boolean(isPromo && product.promoPrice);
  const savings = hasActivePromo ? calculateSavings(product.price, product.promoPrice) : null;
  const isNexus = product.id === 'nexus-injector';

  return (
    <div className={`pricing-card reveal ${isNexus ? 'featured-pricing-card' : ''}`} style={delayStyle}>
      <div className="card-top-content">
        <div className="card-header-row">
          <div>
            <h3 className="card-product-title">{product.name}</h3>
            {product.compatibility ? (
              <div className="card-compat-pill">
                <Smartphone size={12} />
                <span>{product.compatibility}</span>
              </div>
            ) : (
              <span className="card-version-text">{product.version || 'v1.0'}</span>
            )}
          </div>
          <div className="card-badge-container">
            {isNexus && <span className="badge-featured">REKOMENDASI</span>}
            {product.badge && !isNexus && <span className="badge-standard">{product.badge}</span>}
          </div>
        </div>

        {product.description && (
          <p className="card-description-text">
            {product.description}
          </p>
        )}

        <div className="card-price-block">
          {hasActivePromo ? (
            <div>
              <div className="card-price-val">{product.promoPrice}</div>
              <div className="card-price-sub">
                <span className="price-strikethrough">{product.price}</span>
                {savings && <span className="price-savings-tag">{savings}</span>}
              </div>
            </div>
          ) : (
            <div>
              <div className="card-price-val">{product.price}</div>
              <div className="card-price-note">
                <ShieldCheck size={13} className="note-shield" />
                <span>{product.license || 'Lisensi Permanen / Sekali Bayar'}</span>
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
          <span className="features-label">Fitur yang disertakan:</span>
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
                <span>{isExpanded ? 'Sembunyikan' : `+${extraFeatures.length} Fitur Tambahan`}</span>
                <ChevronDown size={14} className={`toggle-icon ${isExpanded ? 'rotate' : ''}`} />
              </button>
            </>
          )}
        </div>
      </div>

      <button
        type="button"
        className={`btn-card-order ${isNexus ? 'primary' : 'secondary'}`}
        onClick={() => onSelectProduct(product)}
      >
        <span>Beli Lisensi Sekarang</span>
        <ArrowRight size={15} />
      </button>
    </div>
  );
}
