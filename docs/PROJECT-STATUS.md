# Proje Durumu — kulakliksatisfrontend

> Bu dosya frontend tarafının yaşayan durumunu tutar. AI bu dosyayı **otomatik okumaz**, sadece sen "duruma bak" dediğinde okur.  
> **Son güncelleme:** 16 Mayıs 2026  
> **Güncelleme sahibi:** Hüseyin (AI'ın onay alarak güncellediği durumlar dahil)

---

## Şu Anki Odak

**Aktif feature:** _(henüz başlanmadı — bir sonraki: ürün detay sayfası + sepet UI)_  
**Aktif teknik borç:** Roo Code'dan Claude Code'a geçiş, kalan `.agents/` ve `CONTEXT.md` temizliği

**Bu hafta yapılması beklenen:**
- CLAUDE.md altyapısının tamamlanması ✅ (devam ediyor — Faz 0+1)
- Roo Code mirası dosyaların silinmesi (`.agents/rules/general-rules.md`, `CONTEXT.md`)
- Prompt kütüphanesinin oluşturulması (Adım 4.7)
- Permission ayarları, secret hijyeni (Adım 5-6)
- claude.ai Projects kurulumu (Adım 7)

---

## Mevcut Olgunluk

### Tamamlanmış olanlar (kullanılabilir durumda)

- ✅ Angular 21 + TypeScript 5.9 strict mode proje iskelesi
- ✅ Angular Material 21.2 (indigo-pink theme)
- ✅ Routing yapısı (`/`, `/login`, `/admin`, `/**`)
- ✅ `core/` katmanı:
  - `AuthInterceptor` (Bearer token + 401 handling)
  - `AuthGuard`, `RoleGuard` (class-based, deprecated API)
  - `AuthService` (login, logout, JWT decode, rol kontrolü)
  - `SnackbarService`, `ErrorMessageService` (errorCode → TR mesaj)
- ✅ `shared/` katmanı: Header, Footer, NotFound component'leri
- ✅ Login feature (lazy-loaded module)
- ✅ Admin paneli:
  - Shell (sol nav: Ürünler / Kullanıcılar)
  - Ürünler tab: tümü + satıcıya göre, mat-table tabanlı
  - Dialog'lar: delete-item, change-password, update-user, delete-user
- ✅ Ana sayfa (`/`): "Editörün Seçimi" listesi + header/sol-menü iskeleti
- ✅ Environment yapısı (`environment.ts`, `environment.prod.ts`)
- ✅ Models katmanı (auth, user, item, error)
- ✅ JWT decode + localStorage persistence

### Kısmen var ama eksik/buglu

- 🟡 **Dosya adlandırma:** Kök app dosyaları Angular konvansiyonu dışında (`app.ts`, `app-module.ts`, `app-routing-module.ts`)
- 🟡 **Login çift hata gösterimi:** Hem snackbar hem form-altı errorMessage — düzeltilecek (sadece snackbar)
- 🟡 **`environment.prod.ts`:** `apiUrl: 'PRODUCTION_URL'` placeholder, gerçek değer yok
- 🟡 **`console.log` spam:** HomeComponent debug log'ları temizlenmemiş
- 🟡 **Deprecated guard API:** `AuthGuard`, `RoleGuard` class-based, `CanActivateFn` (functional) değil
- 🟡 **HomeComponent modülsüz:** Diğer feature'lar lazy-loaded module, home değil
- 🟡 **NgModule yaklaşımı:** Tüm proje. Yeni component'ler standalone, mevcutlar refactor planlı
- 🟡 **`UserResponse.userType` array sorunu:** Backend `Set<UserTypeResponse>` dönüyor, frontend `userType[0]` ile erişiyor
- 🟡 **Admin sekme routing kullanmıyor:** `selectedPage: string` state, URL değişmiyor
- 🟡 **`ChangeDetectorRef.detectChanges()`:** HomeComponent'te kullanılıyor (Zone-bypass kaynağı belirsiz)
- 🟡 **Subscription manuel yönetimi:** `takeUntilDestroyed()` / `async` pipe'a geçilmemiş

### Henüz başlanmamış

- ❌ Ürün detay sayfası
- ❌ Sepet UI
- ❌ AutoEQ test arayüzü (Web Audio API entegrasyonu)
- ❌ Kullanıcı kayıt sayfası (backend var, UI yok)
- ❌ Shopper profil sayfası
- ❌ Seller dashboard
- ❌ Sipariş geçmişi
- ❌ Test altyapısı (Vitest kurulu ama hiç test yazılmamış)
- ❌ Linter (Prettier var, ESLint yok)
- ❌ i18n (şu an monolingual Türkçe)
- ❌ Loading state'leri için global pattern (her component kendi `isLoading`'ini yönetiyor)
- ❌ Search bar (header'da placeholder)
- ❌ Kategori menüsü (ana sayfa sol nav placeholder)
- ❌ Footer içeriği (sadece "© 2025" yazısı)

---

## Roo Code'dan Claude Code'a Geçiş

**Durum:** Tamamlanmak üzere.

- ✅ Roo Code kuralları (`general-rules.md`) Claude CLAUDE.md'ye taşındı
- ✅ Roo Code `CONTEXT.md` bilgileri bu dosyaya (PROJECT-STATUS.md) taşındı
- ⏳ Silinmesi gerekenler (geçiş onaylandıktan sonra):
  - `.agents/rules/general-rules.md`
  - `.agents/` (tüm klasör)
  - `CONTEXT.md` (kök dizinde)

**Silme komutları** (kullanıcı her şeyi onayladıktan sonra):
```powershell
Remove-Item -Recurse "C:\Users\masaqwe\Desktop\projeklasor\git\kulakliksatisfrontend\.agents"
Remove-Item "C:\Users\masaqwe\Desktop\projeklasor\git\kulakliksatisfrontend\CONTEXT.md"
```

---

## Yakın Vade Roadmap (öncelik sırasıyla)

### 1. Ürün detay sayfası
**Hedef:** Kullanıcı bir ürüne tıklayınca tam detay görsün.

⚠️ **Önkoşul:** Backend `GET /api/items/{id}` şu an SELLER-only. Frontend ürün detay sayfası için bu kısıt kaldırılmalı (backend tarafında yapılacak).

- [ ] `features/product-detail/` feature klasörü (standalone)
- [ ] `ProductDetailComponent` — galeri, başlık, fiyat, marka, açıklama
- [ ] Routing: `/items/:id`
- [ ] Service: `ItemService.getItemById(id)` (yeni veya mevcut)
- [ ] Loading + error state

### 2. Sepet UI
**Önkoşul:** Backend Cart domain'i (öncelikli olarak yazılacak — backend PROJECT-STATUS'ta).

- [ ] `features/cart/` feature klasörü (standalone)
- [ ] `CartService`
- [ ] Header'a sepet ikonu (mevcut placeholder doldurulacak)
- [ ] Sepete ekleme butonu ürün detay sayfasında
- [ ] Sepet sayfası: adet artırma/azaltma, ürün silme, toplam tutar

### 3. AutoEQ test arayüzü
**Önkoşul:** Backend AutoEQ köprüsü (Seçenek A öne çıkıyor — Spring Boot → FastAPI proxy).

**Teknik gereksinimler:**
- `AudioContext` service (singleton, `NgZone.runOutsideAngular()` ile)
- `BiquadFilterNode` chain'i (10 band)
- Preset müzik dosyaları (bundle'da mı, S3'te mi? — karar verilmedi)
- AutoEQ veri formatı: 10-band PEQ (frequency, gain, Q, type)
- Kullanıcı kendi kulaklığını seçecek bir dropdown/search component

**Sıralı işler:**
- [ ] Audio service iskelesi
- [ ] EQ filter chain implementasyonu
- [ ] Preset müzik playback prototipi (EQ olmadan)
- [ ] EQ uygulama testi (sabit parametrelerle)
- [ ] AutoEQ veri çekme (backend endpoint hazır olduğunda)
- [ ] Kulaklık seçme UI

### 4. Yapılacak küçük temizlikler
- [ ] Kök app dosyalarını Angular konvansiyonuna uygun isimlendir
- [ ] Login çift hata gösterimini düzelt (sadece snackbar)
- [ ] HomeComponent'ten `console.log` debug'larını temizle
- [ ] `environment.prod.ts` apiUrl'i environment variable kullansın

---

## Uzun Vade Roadmap (öncelik henüz net değil)

- Kullanıcı kayıt sayfası (UI iskelesi)
- Shopper profil sayfası (kendi bilgilerini güncelleme)
- Seller dashboard (item ekleme, kendi ürünleri)
- Sipariş geçmişi
- Class-based guard'ların `CanActivateFn`'e refactor
- NgModule → Standalone tam geçiş
- HomeComponent için kendi feature module'u (veya standalone)
- Admin sekmelerini child route'larla yönetme
- Subscription'ları `takeUntilDestroyed()` / `async` pipe'a refactor
- Test altyapısı (en azından kritik component'ler için)
- ESLint kurulumu
- i18n (eğer İngilizce desteği gelirse)

---

## Teknik Borç Detay Listesi

CLAUDE.md §16'da kısa özetler var, bu daha takip edilebilir liste:

### Kritik
1. Kök app dosyaları Angular naming convention'ına aykırı
2. Login çift hata gösterimi
3. `environment.prod.ts` apiUrl placeholder
4. `console.log` debug spam (HomeComponent)

### Orta
5. Class-based guard API (deprecated)
6. HomeComponent modülsüz, AppModule'de declare
7. NgModule → Standalone refactor planı
8. `UserResponse.userType` array (backend'le birlikte düşünülecek)
9. Admin sekmeleri routing kullanmıyor

### Düşük
10. Subscription manuel yönetimi → `takeUntilDestroyed()` veya `async` pipe
11. `ChangeDetectorRef.detectChanges()` HomeComponent'te (Zone-bypass kaynağı belirsiz)
12. `shared/pipes/` ve `shared/directives/` boş — kullanılmıyorsa sil
13. Header placeholder alanlar (arama, profil, sepet)
14. Ana sayfa sol kategori menüsü placeholder

---

## Geçmiş Kilometre Taşları (kabaca, kronolojik)

- **2026-05-16** — Roo Code'dan Claude Code'a geçiş, CLAUDE.md altyapısı kuruldu (Faz 0+1)
- **(Roo Code dönemi — Mayıs 2026 öncesi)** — Angular 21 iskelesi, Auth + Login, Admin paneli (Ürünler + Kullanıcılar), Home page iskelesi, `core/` ve `shared/` katmanları, Models, AuthInterceptor, JWT decode, RoleGuard, SnackbarService, ErrorMessageService

---

## Bakım Notu

**Ne zaman güncellenir:**
- Bir feature tamamlandığında → "Geçmiş Kilometre Taşları"na ekle, "Tamamlanmış olanlar"a taşı
- Yeni bir feature başladığında → "Şu Anki Odak" güncelle
- Bir teknik borç çözüldüğünde → ilgili listeden sil
- Roadmap'te bir madde tamamlandığında → checkbox işaretle, sonra "Tamamlanmış"a taşı
- Backend'de bir değişiklik frontend'i etkiledi → yeni "Önkoşul"lar veya teknik borç eklenir

**AI'ın bu dosyaya etkisi:**
Frontend tarafında AI yazıyor. Bir feature tamamlandığında AI'a `prompts/frontend/feature-completion-review.md` (Adım 4.7'de yazılacak) ile sorulur:
- Hangi pattern'leri kullandık?
- CLAUDE.md güncellemeli mi?
- PROJECT-STATUS.md'de hangi bölümler değişmeli?

AI sana **diff sunar**, sen onaylarsan uygular.

**Şişme uyarısı:** Bu dosya 300 satırı geçerse:
- "Geçmiş Kilometre Taşları" son 3 ay ile sınırlandırılır (eski git history'de zaten var)
- Tamamlanmış olanların detayları azaltılır