# mdzz-store-api (Cloudflare Worker)

Backend API untuk pemrosesan order pelanggan ZetXiters / MDZZ Official Store, menggunakan Cloudflare Worker dan Cloudflare D1 Database (`mdzz-store-db`).

## D1 Binding & Database Configuration

- **Database Name:** `mdzz-store-db`
- **Binding Name:** `DB` (`env.DB`)

### Skema Tabel `orders`

```sql
CREATE TABLE IF NOT EXISTS orders (
  order_id TEXT PRIMARY KEY,
  product TEXT NOT NULL,
  total TEXT NOT NULL,
  status TEXT NOT NULL,
  customer_name TEXT,
  customer_contact TEXT,
  payment_method TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
```

## Endpoint Pelanggan

### 1. `POST /api/orders`
Membuat pesanan baru di Cloudflare D1.

- **Status Awal:** `PENDING_PAYMENT`
- **Request Body (JSON):**
  ```json
  {
    "product": { "name": "Varian 1 - Sensitivitas" },
    "total": "Rp 75.000",
    "customer_name": "Budi Santoso",
    "customer_contact": "08123456789",
    "payment_method": "QRIS_DANA"
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "success": true,
    "order": {
      "order_id": "ZX-261005-4819",
      "product": { "name": "Varian 1 - Sensitivitas" },
      "total": "Rp 75.000",
      "status": "PENDING_PAYMENT",
      "customer_name": "Budi Santoso",
      "customer_contact": "08123456789",
      "payment_method": "QRIS_DANA",
      "created_at": "2026-10-05T10:00:00.000Z",
      "updated_at": "2026-10-05T10:00:00.000Z"
    }
  }
  ```

### 2. `GET /api/orders/:orderId`
Mendapatkan detail pesanan berdasarkan `order_id`.

- **Response (200 OK):**
  ```json
  {
    "success": true,
    "order": { ... }
  }
  ```
- **Response (404 Not Found):**
  ```json
  {
    "success": false,
    "error": "Order with ID \"ZX-261005-4819\" not found."
  }
  ```

### 3. `POST /api/orders/:orderId/paid`
Mengubah status order dari `PENDING_PAYMENT` menjadi `WAITING_VERIFICATION` saat pelanggan menekan tombol "Saya Sudah Membayar".

- **Aturan Transisi:** Hanya mengizinkan status dari `PENDING_PAYMENT` ke `WAITING_VERIFICATION`. Transisi status lainnya akan ditolak (400 Bad Request).
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "order": {
      "order_id": "ZX-261005-4819",
      "status": "WAITING_VERIFICATION",
      "updated_at": "2026-10-05T10:05:00.000Z"
    }
  }
  ```

## Endpoint Admin (Protected)

Semua endpoint admin di bawah rute `/api/admin/*` diproteksi menggunakan token rahasia Cloudflare Worker `ADMIN_API_KEY`.
Setiap request wajib menyertakan header:
```http
Authorization: Bearer <ADMIN_API_KEY>
```
Jika header tidak ada, tidak valid, atau secret tidak sesuai, API mengembalikan HTTP **401 Unauthorized**.

### 1. `GET /api/admin/orders`
Mengambil seluruh daftar pesanan pelanggan dari D1 database secara berurutan (`ORDER BY created_at DESC`).

- **Query Parameter (Opsional):**
  - `?status=WAITING_VERIFICATION` (atau `PENDING_PAYMENT`, `SUCCESS`, `CANCELLED`)
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "count": 1,
    "total": 1,
    "orders": [
      {
        "order_id": "ZX-261005-4819",
        "orderId": "ZX-261005-4819",
        "product": { "name": "Varian 1 - Sensitivitas" },
        "total": "Rp 75.000",
        "status": "WAITING_VERIFICATION",
        "customer_name": "Budi Santoso",
        "customer_contact": "08123456789",
        "payment_method": "QRIS_DANA",
        "created_at": "2026-10-05T10:00:00.000Z",
        "updated_at": "2026-10-05T10:05:00.000Z"
      }
    ]
  }
  ```

### 2. `POST /api/admin/orders/:orderId/complete`
Admin menyetujui dan menyelesaikan pesanan yang telah dibayar.

- **Aturan Transisi:** Hanya mengizinkan perubahan dari status `WAITING_VERIFICATION` ke `SUCCESS`.
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Order completed successfully.",
    "order": {
      "order_id": "ZX-261005-4819",
      "status": "SUCCESS",
      "updated_at": "2026-10-05T10:10:00.000Z"
    }
  }
  ```

### 3. `POST /api/admin/orders/:orderId/cancel`
Admin membatalkan pesanan yang belum valid atau bermasalah.

- **Aturan Transisi:** Hanya mengizinkan perubahan dari status `WAITING_VERIFICATION` ke `CANCELLED` (pembatalan langsung dari `PENDING_PAYMENT` tidak diizinkan).
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Order cancelled successfully.",
    "order": {
      "order_id": "ZX-261005-4819",
      "status": "CANCELLED",
      "updated_at": "2026-10-05T10:10:00.000Z"
    }
  }
  ```

## CORS & Security
- Diizinkan untuk origin `https://mdzzofficialstore.biz.id` (serta development `localhost` / `127.0.0.1`).
- Mendukung preflight `OPTIONS` request (204 No Content) termasuk header `Authorization`.
- Proteksi brute-force/timing attack menggunakan timing-safe string comparison.

## Konfigurasi Secret Cloudflare Worker
Untuk mengatur secret `ADMIN_API_KEY` di Cloudflare:
```bash
# Set secret di production Cloudflare Worker
npx wrangler secret put ADMIN_API_KEY

# Untuk development lokal (buat berkas .dev.vars di mdzz-store-api):
# ADMIN_API_KEY=rahasia-admin-anda
```

## Perintah Pengembangan, Pengujian & Deploy
```bash
# Menjalankan unit test
npm test

# Pengecekan sintaksis file
npm run check

# Menjalankan worker secara lokal
npx wrangler dev

# Menerapkan skema tabel ke D1 lokal untuk pengujian
npx wrangler d1 execute mdzz-store-db --local --file=schema.sql

# Deploy ke Cloudflare Workers
npx wrangler deploy
```
