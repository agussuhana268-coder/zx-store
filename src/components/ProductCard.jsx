import { useState } from 'react';
import { Check, ArrowRight, ShieldCheck, ChevronDown, Sparkles } from 'lucide-react';
import { calculateSavings, PROMOTION_CONFIG } from '../data/products';

export default function ProductCard({ product, index, isPromo, onSelectProduct }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const features = Array.isArray(product.features) ? product.features : [];
  const hasFeatures = features.length > 0;
  const canExpand = features.length > 7;
  const delayStyle = index !== undefined ? { transitionDelay: `${index * 80}ms` } : undefined;

  const initialFeatures = features.slice(0, 7);
  const extraFeatures = features.slice(7);

  const hasActivePromo = Boolean(isPromo && product.promoPrice);
  const savings = hasActivePromo ? calculateSavings(product.price, product.promoPrice) : null;

  return (
    <div className="product-card reveal" style={delayStyle}>
      <div className="product-card-top">
        <div className="product-header">
          <h3 className="product-name">{product.name}</h3>
          <div className="product-badges-stack">
            {hasActivePromo && (
              <span className="promo-badge">
                <Sparkles size={10} className="promo-badge-icon" />
                {PROMOTION_CONFIG.badgeText || 'TODAY ONLY'}
              </span>
            )}
            {product.badge && (
              <span className="popular-badge">{product.badge}</span>
            )}
            <span className="duration-badge">
              <ShieldCheck size={11} className="duration-badge-icon" />
              PERMANEN
            </span>
          </div>
        </div>

        {hasActivePromo ? (
          <div className="product-pricing">
            <div className="product-price-row">
              <span className="product-price-original">{product.price}</span>
              <span className="product-price">{product.promoPrice}</span>
            </div>
            {savings && <div className="product-savings">{savings}</div>}
          </div>
        ) : (
          <div className="product-price">{product.price}</div>
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
            <ul className="product-features">
              {initialFeatures.map((feature, idx) => (
                <li key={idx} className="product-feature-item">
                  <Check size={16} className="feature-check" />
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
                        <li key={idx + 7} className="product-feature-item">
                          <Check size={16} className="feature-check" />
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
                  <span>{isExpanded ? 'Sembunyikan' : 'Lihat selengkapnya'}</span>
                  <ChevronDown size={14} className={`chevron-icon ${isExpanded ? 'rotated' : ''}`} />
                </button>
              </>
            )}
          </div>
        )}
      </div>

      <button
        type="button"
        className="btn-primary"
        onClick={() => onSelectProduct(product)}
      >
        <span>Beli Sekarang</span>
        <ArrowRight size={16} />
      </button>
    </div>
  );
}
