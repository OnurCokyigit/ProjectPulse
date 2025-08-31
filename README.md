# 🌍 ProjectPulse (React + Node.js + PostgreSQL)

Bu proje, **yer bilimleri alanındaki projelerin ve operasyonların yönetimini** kolaylaştırmak için geliştirilmiş hafif bir **ERP-benzeri yönetim panelidir**.  
Projeler, iş paketleri, aktiviteler, bütçe–gerçekleşen maliyetler, departmanlar ve envanter bileşenlerini tek bir ekranda takip etmeye olanak sağlar.  

---

## ✨ Özellikler

* **React + Vite + Tailwind** tabanlı modern frontend
* **Node.js + Express REST API** ile backend
* **PostgreSQL** veritabanı bağlantısı (`pg.Pool`)
* **Proxy** üzerinden frontend–backend entegrasyonu
* **Dashboard ekranı** ile özet metrikler
* **Proje & İş Paketi yönetimi**
* **Bütçe / Gerçekleşen maliyet raporlamaları**
* **Departman & Personel görüntüleme**
* **Envanter yönetimi**: varlıklar, hareketler, bakım kayıtları
* **Lookup tabloları**: status, currency, org-unit-types, domains

---

## 🧭 İçindekiler

* [Proje Yapısı](#proje-yapısı)
* [Gereksinimler](#gereksinimler)
* [Hızlı Başlangıç](#hızlı-başlangıç)
* [API Uçları](#api-uçları)
* [Sistem Nasıl Çalışır](#sistem-nasıl-çalışır)
* [Arayüz Kılavuzu](#arayüz-kılavuzu)
* [Konfigürasyon](#konfigürasyon)

---

## Proje Yapısı
├─ my-admin/ # Frontend (React + Vite + Tailwind)
│ ├─ src/pages/ # Dashboard, Projects, WorkPackages, OrgUnits
│ ├─ src/api/axios.js # API client
│ └─ vite.config.js # Proxy ayarları
│
├─ app-api/ # Backend (Node.js + Express)
│ ├─ src/routes/ # /projects, /work-packages, /org-units ...
│ ├─ src/controllers/ # Generic controller factory
│ ├─ db.js # PostgreSQL bağlantısı
│ └─ server.js # Express app
│
└─ .env.example # DB bağlantısı için örnek config

---

## Gereksinimler

* **Node.js 18+**
* **PostgreSQL 14+**
* `npm install` komutu hem frontend hem backend için çalıştırılmalı

---

## Hızlı Başlangıç

### 1. Veritabanı Kurulumu
PostgreSQL’de `core` şeması ve tabloları oluşturun:  

```sql
CREATE SCHEMA core;
```
-- project, work_package, activity, budget_item, actual_cost vb. tabloları oluşturun

### 2. Backend
cd app-api
cp .env.example .env   # PostgreSQL bağlantı bilgilerini doldurun
npm install
npm run dev            # http://localhost:3000

### 3. Frontend
cd my-admin
npm install
npm run dev            # http://localhost:5173

---

## API Uçları

* /projects, /projects/:id, /projects/:id/finance
* /projects/:id/activities, /projects/:id/budget-items, /projects/:id/actual-costs
* /work-packages?project_id=...
* /org-units, /persons?org_unit_id=...
* /budget-items, /budget-version
* /actual-costs
* /lookups/status|currencies|org-unit-types
* /metrics
* /health

---

## 🛠️ Sistem Nasıl Çalışır

1. **Frontend**: React + Vite → axios ile `/api/*` çağrısı yapar.  
2. **Proxy**: Vite, çağrıyı `http://localhost:3000`’e yönlendirir.  
3. **Backend**: Express.js, PostgreSQL’e bağlanır, core.* tablolarına sorgu gönderir.  
4. **Database**: Project–WorkPackage–Activity zinciri, bütçe & maliyet tabloları, org unit ve asset yönetimi saklanır.  
5. **View’lar** (`v_project_finance`, `v_wp_finance`) üzerinden finansal özetler alınır.

---

## 🖥️ Arayüz Kılavuzu

1. **📊 Dashboard**: Proje, iş paketi, aktivite, bütçe kalemi ve varlık sayıları  
2. **📂 Projeler**: Proje listesi, detay, aktiviteler, bütçe ve maliyetler  
3. **📝 İş Paketleri**: Filtrelenebilir iş paketleri listesi (status, project)  
4. **🏢 Departmanlar**: Org units ve personel listeleri  
5. **💰 Bütçe & Maliyet**: Plan–gerçekleşen farkını raporlama  
6. **📦 Envanter**: Varlıklar, hareketler, bakım kayıtları

---

## ⚙️ Konfigürasyon

- `app-api/.env` içine veritabanı bilgilerini girin:

```env
PGHOST=localhost
PGPORT=5432
PGUSER=postgres
PGPASSWORD=yourpassword
PGDATABASE=projectpulse
```
### Frontend proxy vite.config.js içinde ayarlanmıştır:
```
server: {
  proxy: {
    '/api': 'http://localhost:3000'
  }
}
```
