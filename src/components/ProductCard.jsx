import { Check, ArrowRight } from 'lucide-react';

export default function ProductCard({ product, index, onSelectProduct }) {
  const hasFeatures = Array.isArray(product.features) && product.features.length > 0;
  const delayStyle = index !== undefined ? { transitionDelay: `${index * 80}ms` } : undefined;

  return (
    <div className="product-card reveal" style={delayStyle}>
      <div className="product-card-top">
        <div className="product-header">
          <h3 className="product-name">{product.name}</h3>
          {product.badge && (
            <span className="popular-badge">{product.badge}</span>
          )}
        </div>

        <div className="product-price">{product.price}</div>

        {product.slots && (
          <div className="product-slots">
            <span className="slot-dot"></span>
            <span>{product.slots}</span>
          </div>
        )}

        <hr className="card-divider" />

        {hasFeatures && (
          <ul className="product-features">
            {product.features.map((feature, index) => (
              <li key={index} className="product-feature-item">
                <Check size={16} className="feature-check" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
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
