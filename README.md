# 🪙 Octra Wallet Generator

Generator wallet Octra berbasis **Node.js** menggunakan standar **Ed25519** + **BIP39**.
Wallet langsung dibuat saat program dijalankan dan disimpan dalam format `.txt` dengan informasi lengkap dan aman.

---

## 📦 Instalasi Lokal

### 1. Persiapan

Pastikan Anda telah menginstal **Node.js**.

#### ◾ Linux (Debian/Ubuntu)

```bash
sudo apt update
sudo apt install nodejs
```

#### ◾ Windows

1. Kunjungi: [https://nodejs.org](https://nodejs.org)
2. Unduh versi **LTS** (versi stabil)
3. Jalankan file `.msi`
4. Ikuti proses instalasi hingga selesai

#### ◾ Termux (Android)

```bash
pkg update
pkg install nodejs
```

---

### 2. Kloning Repositori

```bash
git clone https://github.com/cryptofinderid/octra-wallet-generator.git
cd octra-wallet-generator
```

---

### 3. Instalasi Dependensi

```bash
npm install tweetnacl bip39
```

---

## 🧪 Menjalankan Generator

```bash
node main.js
```

Setiap kali dijalankan, program akan:

* Membuat wallet Octra baru
* Menampilkan ringkasan wallet di terminal
* Menyimpan file `.txt` berisi data teknis lengkap

---
