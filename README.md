# 🪙 Octra Wallet Generator

Generator wallet Octra berbasis Node.js (Ed25519 + BIP39).  
Wallet langsung dibuat saat program dijalankan dan disimpan dalam format `.txt` dengan informasi lengkap dan aman.

---

## 📦 Instalasi Lokal

### 1. Persiapan

Pastikan Anda telah menginstal NodeJS:

#### ◾ Linux (Debian/Ubuntu)
```bash
sudo apt update
sudo apt install nodejs
```

#### ◾ Windows
1. Kunjungi [https://nodejs.org](https://nodejs.org)
2. Klik tombol **LTS** (versi stabil)
3. Unduh file `.msi` dan jalankan
4. Ikuti langkah instalasi hingga selesai

#### ◾ Termux
```bash
pkg update
pkg install nodejs
```
---

### 2. Clone Repositori

```bash
git clone https://github.com/cryptofinderid/octra-wallet-generator.git
cd octra-wallet-generator
````

### 3. Instalasi Dependensi

```bash
npm install tweetnacl bip39
```

---

## 🧪 Menjalankan Generator

```bash
node main.js
```

Setiap kali dijalankan, akan:

* Membuat wallet baru
* Menampilkan ringkasan di terminal
* Menyimpan file `.txt` berisi semua data teknis

---
