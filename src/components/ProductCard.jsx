import { useState } from 'react';
import { Check, ArrowRight, ShieldCheck, ChevronDown, Sparkles, Cpu, Crown } from 'lucide-react';
import { calculateSavings, PROMOTION_CONFIG } from '../data/products';

export default function ProductCard({ product, index, isPromo, onSelectProduct }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const features = Array.isArray(product.features) ? product.features : [];
  const hasFeatures = features.length > 0;
  const initialCount = 8;
  const canExpand = features.length > initialCount;
  const delayStyle = index !== undefined ? { transitionDelay: `${index * 80}ms` } : undefined;

  const initialFeatures = features.slice(0, initialCount);
  const extraFeatures = features.slice(initialCount);

  const hasActivePromo = Boolean(isPromo && product.promoPrice);
  const savings = hasActivePromo ? calculateSavings(product.price, product.promoPrice) : null;
  const isNexus = product.id === 'nexus-injector';

  return (
    <div className={`product-card reveal ${isNexus ? 'featured-card' : ''}`} style={delayStyle}>
      {isNexus && <div className="featured-card-border-glow"></div>}

      <div className="product-card-top">
        <div className="product-header">
          <div className="product-identity">
            <div className="product-title-row">
              {isNexus ? <Cpu size={18} className="product-icon cyan" /> : <Crown size={18} className="product-icon yellow" />}
              <h3 className="product-name">{product.name}</h3>
            </div>
            {product.version && <span className="product-version-pill">{product.version}</span>}
          </div>

          <div className="product-badges-stack">
            {hasActivePromo && (
              <span className="promo-badge">
                <Sparkles size={10} className="promo-badge-icon" />
                {PROMOTION_CONFIG.badgeText || 'TODAY ONLY'}
              </span>
            )}
            {product.badge && (
              <span className={`popular-badge ${isNexus ? 'cyan-badge' : 'gold-badge'}`}>
                {product.badge}
              </span>
            )}
            <span className="duration-badge">
              <ShieldCheck size={11} className="duration-badge-icon" />
              {product.license || 'PERMANEN'}
            </span>
          </div>
        </div>

        {product.description && (
          <p className="product-brief-desc">
            {product.description}
          </p>
        )}

        {hasActivePromo ? (
          <div className="product-pricing">
            <div className="product-price">{product.promoPrice}</div>
            <div className="product-price-sub">
              <span className="product-price-original">{product.price}</span>
              {savings && <span className="product-savings">{savings}</span>}
            </div>
          </div>
        ) : (
          <div className="product-pricing">
            <div className="product-price">{product.price}</div>
            <span className="product-license-note">Lisensi Permanen / Lifetime</span>
          </div>
        )}

        {product.slots && (
          <div className="product-slots">
            <span className="slot-dot"></span>
            <span>{product.slots}</span>
          </div>
        )}

        <hr className="card-divider" />

        {hasFeatures && (
          <div className="features-container">
            <span className="features-title">Fitur Termasuk:</span>
            <ul className="product-features">
              {initialFeatures.map((feature, idx) => (
                <li key={idx} className="product-feature-item">
                  <Check size={15} className="feature-check" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            {canExpand && (
              <>
                <div className={`extra-features-wrapper ${isExpanded ? 'is-expanded' : ''}`}>
                  <div className="extra-features-inner">
                    <ul className="product-features">
                      {extraFeatures.map((feature, idx) => (
                        <li key={idx + initialCount} className="product-feature-item">
                          <Check size={15} className="feature-check" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <button
                  type="button"
                  className="expand-toggle-btn"
                  onClick={() => setIsExpanded(!isExpanded)}
                  aria-expanded={isExpanded}
                >
                  <span>{isExpanded ? 'Tutup Fitur' : `+${extraFeatures.length} Fitur Lainnya`}</span>
                  <ChevronDown size={14} className={`chevron-icon ${isExpanded ? 'rotated' : ''}`} />
                </button>
              </>
            )}
          </div>
        )}
      </div>

      <button
        type="button"
        className={`btn-primary ${isNexus ? 'btn-nexus-glow' : ''}`}
        onClick={() => onSelectProduct(product)}
      >
        <span>Beli Sekarang</span>
        <ArrowRight size={16} />
      </button>
    </div>
  );
}
