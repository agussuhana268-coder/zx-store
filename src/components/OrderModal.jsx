import { useState, useEffect } from 'react';
import { X, Send } from 'lucide-react';

export default function OrderModal({ product, onCloseModal }) {
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

  const normalizePhone = (phone) => {
    let cleaned = phone.replace(/[\s\-\(\)]/g, '');
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
      `Halo Admin Zet Xiters, saya ingin melakukan pemesanan produk ${product.name}.`,
      '',
      'Berikut detail pemesanan saya:',
      '',
      `Nama Lengkap: ${nameTrimmed}`,
      `No. WhatsApp: ${normalizedPhone}`,
      `Produk: ${product.name}`,
      `Harga: ${product.price}`,
      '',
      'Mohon informasi mengenai proses pembayaran dan aktivasi produk.',
      '',
      'Terima kasih.'
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
          <h2 className="modal-title">Order Produk</h2>
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
          <div>
            <div className="summary-name">{product.name}</div>
            {product.slots && (
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{product.slots}</div>
            )}
          </div>
          <div className="summary-price">{product.price}</div>
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
              placeholder="Masukkan nama lengkap"
              value={customerName}
              onChange={(e) => {
                setCustomerName(e.target.value);
                if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
              }}
            />
            {errors.name && (
              <span className="error-message" style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', display: 'block' }}>
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
              <span className="error-message" style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                {errors.contact}
              </span>
            )}
          </div>

          <div className="modal-actions">
            <button type="submit" className="btn-primary">
              <span>Order via WhatsApp</span>
              <Send size={15} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
