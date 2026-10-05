import { useState, useEffect } from 'react';
import { X, ShieldCheck, QrCode, ArrowRight } from 'lucide-react';
import { createOrder } from '../utils/api';
import PlatformIcon from './PlatformIcon';

export default function OrderModal({ product, onCloseModal, isPromo: _isPromo, onProceedToQris }) {
  const [customerName, setCustomerName] = useState('');
  const [customerContact, setCustomerContact] = useState('');
  const [errors, setErrors] = useState({ name: '', contact: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const defaultDuration =
    product?.selectedDuration ||
    product?.durations?.find((d) => d.isDefault) ||
    product?.durations?.[0] ||
    null;

  const [activeDuration, setActiveDuration] = useState(defaultDuration);

  // Sync activeDuration when product prop changes
  useEffect(() => {
    setActiveDuration(
      product?.selectedDuration ||
      product?.durations?.find((d) => d.isDefault) ||
      product?.durations?.[0] ||
      null
    );
  }, [product]);

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

  const activePrice = activeDuration ? activeDuration.price : product.price;
  const activeLicense = activeDuration
    ? (activeDuration.label.toLowerCase().includes('permanen')
        ? (product.license || 'Permanen / Lifetime')
        : `Durasi ${activeDuration.label}`)
    : (product.license || 'Permanen / Lifetime');

  const durationLabel = activeDuration?.label || 'Permanen';
  const isIos = product.platform?.toLowerCase().includes('ios');

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
        newErrors.contact = 'Nomor WhatsApp tidak valid (contoh: 081234567890).';
        hasError = true;
      }
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    const normalizedPhone = normalizePhone(contactTrimmed);
    const orderProductName = `${product.name} — ${durationLabel}`;

    if (isSubmitting) return;

    setIsSubmitting(true);
    setSubmitError('');

    createOrder({
      product: {
        id: product.id,
        name: orderProductName,
        baseName: product.name,
        duration: durationLabel,
        license: activeLicense,
        platform: product.platform || '',
        compatibility: product.compatibility || '',
      },
      total: activePrice,
      customerName: nameTrimmed,
      customerContact: normalizedPhone,
      paymentMethod: 'QRIS_DANA',
    })
      .then((newOrder) => {
        if (onProceedToQris) {
          onProceedToQris(newOrder);
        }
      })
      .catch((err) => {
        console.error('Gagal membuat pesanan via API:', err);
        setSubmitError(
          err.message || 'Gagal memproses pesanan ke server. Periksa koneksi internet Anda dan coba lagi.'
        );
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <div className="modal-backdrop" onClick={onCloseModal}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="dialog-header">
          <div>
            <h3 className="dialog-title">Formulir Pemesanan Lisensi</h3>
            <p className="dialog-subtitle">
              Lengkapi data kontak Anda untuk pembayaran via QRIS.
            </p>
          </div>
          <button
            type="button"
            className="dialog-close-btn"
            onClick={onCloseModal}
            aria-label="Tutup form pemesanan"
          >
            <X size={18} />
          </button>
        </div>

        {/* Selected Product Summary Box */}
        <div className="order-summary-box">
          <div className="summary-main">
            <span className="summary-title">
              {product.name} — {durationLabel}
            </span>
            <div className="summary-meta-line">
              {product.platform && (
                <span className={`summary-platform-pill ${isIos ? 'ios' : 'android'}`}>
                  <PlatformIcon platform={product.platform} size={12} className="platform-icon" />
                  <span>{product.platform}</span>
                </span>
              )}
              <span className="summary-license-pill">
                <ShieldCheck size={12} />
                <span>{activeLicense}</span>
              </span>
              {product.compatibility && (
                <span className="summary-compat-pill">
                  <span>{product.compatibility}</span>
                </span>
              )}
            </div>
          </div>
          <div className="summary-price-area">
            <span className="summary-price-active">{activePrice}</span>
          </div>
        </div>

        {/* Duration selector inside modal */}
        {product.durations && product.durations.length > 1 && (
          <div className="dialog-duration-group">
            <label className="input-label">Pilih Durasi Lisensi</label>
            <div className="modal-duration-grid">
              {product.durations.map((dur) => {
                const isSelected = activeDuration?.id === dur.id;
                return (
                  <button
                    key={dur.id}
                    type="button"
                    className={`modal-duration-pill ${isSelected ? 'active' : ''}`}
                    onClick={() => setActiveDuration(dur)}
                  >
                    <span className="modal-dur-label">{dur.label}</span>
                    <span className="modal-dur-price">{dur.price}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <form onSubmit={handleOrderSubmit} noValidate className="dialog-form">
          {/* Payment Method Selector */}
          <div className="payment-select-group">
            <label className="input-label">Metode Transaksi</label>
            <div className="payment-method-grid">
              <div className="payment-method-card active" style={{ cursor: 'default' }}>
                <div className="method-card-head">
                  <div className="method-icon-wrap">
                    <QrCode size={16} />
                  </div>
                  <span className="method-pill-badge">QRIS</span>
                </div>
                <div className="method-info">
                  <span className="method-title">QRIS (Semua E-Wallet)</span>
                  <span className="method-sub">Scan QR DANA, GoPay, OVO, ShopeePay, BCA, dll</span>
                </div>
              </div>
            </div>
          </div>

          <div className="input-group">
            <label className="input-label" htmlFor="customer-name">
              Nama Lengkap
            </label>
            <input
              id="customer-name"
              type="text"
              className="text-input"
              placeholder="Contoh: Pratama Wijaya"
              value={customerName}
              onChange={(e) => {
                setCustomerName(e.target.value);
                if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
                if (submitError) setSubmitError('');
              }}
            />
            {errors.name && <span className="field-error">{errors.name}</span>}
          </div>

          <div className="input-group">
            <label className="input-label" htmlFor="customer-contact">
              Nomor WhatsApp
            </label>
            <input
              id="customer-contact"
              type="tel"
              className="text-input"
              placeholder="Contoh: 081234567890"
              value={customerContact}
              onChange={(e) => {
                setCustomerContact(e.target.value);
                if (errors.contact) setErrors((prev) => ({ ...prev, contact: '' }));
                if (submitError) setSubmitError('');
              }}
            />
            {errors.contact && <span className="field-error">{errors.contact}</span>}
          </div>

          <div className="dialog-security-note">
            <ShieldCheck size={14} className="note-icon" />
            <span>
              Transaksi diproses melalui sistem QRIS ZetXiters Official.
            </span>
          </div>

          {submitError && (
            <div className="field-error" style={{ marginBottom: '14px', textAlign: 'center', fontSize: '12px' }}>
              {submitError}
            </div>
          )}

          <div className="dialog-actions">
            <button
              type="submit"
              className="btn-dialog-submit"
              disabled={isSubmitting}
            >
              <span>{isSubmitting ? 'Memproses Pesanan...' : 'Lanjut ke Pembayaran QRIS'}</span>
              {!isSubmitting && <ArrowRight size={15} />}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
