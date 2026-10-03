import { useState, useEffect } from 'react';
import { X, Send, ShieldCheck, Cpu } from 'lucide-react';

export default function OrderModal({ product, onCloseModal, isPromo }) {
  const [customerName, setCustomerName] = useState('');
  const [customerContact, setCustomerContact] = useState('');
  const [errors, setErrors] = useState({ name: '', contact: '' });

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onCloseModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onCloseModal]);

  if (!product) return null;

  const hasActivePromo = Boolean(isPromo && product.promoPrice);
  const effectivePrice = hasActivePromo ? product.promoPrice : product.price;

  const normalizePhone = (phone) => {
    let cleaned = phone.replace(/[\s\-()]/g, '');
    if (cleaned.startsWith('+62')) {
      cleaned = '0' + cleaned.slice(3);
    } else if (cleaned.startsWith('62')) {
      cleaned = '0' + cleaned.slice(2);
    }
    return cleaned;
  };

  const handleOrderSubmit = (e) => {
    e.preventDefault();

    const nameTrimmed = customerName.trim();
    const contactTrimmed = customerContact.trim();
    const newErrors = { name: '', contact: '' };
    let hasError = false;

    if (!nameTrimmed) {
      newErrors.name = 'Nama lengkap wajib diisi.';
      hasError = true;
    }

    if (!contactTrimmed) {
      newErrors.contact = 'Nomor WhatsApp wajib diisi.';
      hasError = true;
    } else {
      const normalized = normalizePhone(contactTrimmed);
      if (!/^\d{9,15}$/.test(normalized)) {
        newErrors.contact = 'Nomor WhatsApp tidak valid.';
        hasError = true;
      }
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    const normalizedPhone = normalizePhone(contactTrimmed);

    const messageLines = [
      `Halo Admin Zet Xiters, saya ingin melakukan pemesanan produk:`,
      `📦 *${product.name}*`,
      '',
      'Berikut detail pemesanan saya:',
      `👤 *Nama Lengkap:* ${nameTrimmed}`,
      `📱 *No. WhatsApp:* ${normalizedPhone}`,
      `💰 *Harga:* ${effectivePrice} (${product.license || 'Permanen / Lifetime'})`,
      '',
      'Mohon petunjuk untuk proses pembayaran dan panduan aktivasi sistem.',
      '',
      'Terima kasih!'
    ];

    const orderMessage = messageLines.join('\n');
    const whatsappUrl = `https://wa.me/6287833947151?text=${encodeURIComponent(orderMessage)}`;

    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    onCloseModal();
  };

  return (
    <div className="modal-overlay" onClick={onCloseModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrap">
            <span className="modal-kicker">KONFIRMASI ORDER</span>
            <h2 className="modal-title">Formulir Pemesanan</h2>
          </div>
          <button
            type="button"
            className="close-btn"
            onClick={onCloseModal}
            aria-label="Tutup order modal"
          >
            <X size={20} />
          </button>
        </div>

        <div className="selected-product-summary">
          <div className="summary-left">
            <div className="summary-icon-box">
              <Cpu size={20} className="summary-icon" />
            </div>
            <div>
              <div className="summary-name">{product.name}</div>
              <div className="summary-sub-badge">
                <ShieldCheck size={12} />
                <span>{product.license || 'Permanen / Lifetime'}</span>
              </div>
            </div>
          </div>
          <div className="summary-price-container">
            {hasActivePromo ? (
              <>
                <span className="summary-price">{product.promoPrice}</span>
                <span className="summary-price-original">{product.price}</span>
              </>
            ) : (
              <div className="summary-price">{product.price}</div>
            )}
          </div>
        </div>

        <form onSubmit={handleOrderSubmit} noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="customer-name">
              Nama Lengkap
            </label>
            <input
              id="customer-name"
              type="text"
              className="form-input"
              placeholder="Contoh: Alex Pratama"
              value={customerName}
              onChange={(e) => {
                setCustomerName(e.target.value);
                if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
              }}
            />
            {errors.name && (
              <span className="error-message">
                {errors.name}
              </span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="customer-contact">
              Nomor WhatsApp
            </label>
            <input
              id="customer-contact"
              type="tel"
              className="form-input"
              placeholder="Contoh: 087812345678"
              value={customerContact}
              onChange={(e) => {
                setCustomerContact(e.target.value);
                if (errors.contact) setErrors((prev) => ({ ...prev, contact: '' }));
              }}
            />
            {errors.contact && (
              <span className="error-message">
                {errors.contact}
              </span>
            )}
          </div>

          <div className="order-security-note">
            <ShieldCheck size={14} className="sec-icon" />
            <span>Pesanan langsung diarahkan ke Admin WhatsApp resmi tanpa perantara pihak ketiga.</span>
          </div>

          <div className="modal-actions">
            <button type="submit" className="btn-modal-submit">
              <span>Lanjut ke WhatsApp</span>
              <Send size={15} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
