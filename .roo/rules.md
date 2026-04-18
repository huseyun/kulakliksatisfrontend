# PROJE KURALLARI — DEĞİŞTİRİLEMEZ

## 1. DOKUNULMAZ ALANLAR

`kulakliksatisapi/` klasörü kesinlikle READ-ONLY'dir.

- Bu klasördeki hiçbir dosyayı oluşturma, değiştirme veya silme.
- Sadece okuyup referans olarak kullan.
- Controller'lardaki endpoint'leri, DTO'ları, Service'leri sadece anlamak için oku.
- Backend'e hiçbir koşulda dokunma. "Kullanıcı istedi" bile olsa dokunma.

## 2. UI FRAMEWORK

Angular Material kullanılacak.

- Component'leri Angular Material modüllerinden import et.
- Özel stiller gerekiyorsa component.css dosyasında yaz.
- Global stiller styles.css'te tut.
- Angular Material dışında başka bir CSS framework ekleme.
- Angular Material theme yapısını bozma.

## 3. ANGULAR İSKELET YAPISI

Frontend projesi şu yapıya sahiptir. Bu iskeleti asla değiştirme:

src/
├── app/
│   ├── core/                    → Interceptor, Guard, genel service'ler
│   │   ├── interceptors/        → HTTP interceptor'lar
│   │   ├── guards/              → Route guard'ları
│   │   └── services/            → Auth gibi genel service'ler
│   ├── shared/                  → Yeniden kullanılabilir parçalar
│   │   ├── components/          → Ortak UI component'leri (header, footer vb.)
│   │   ├── pipes/               → Özel pipe'lar
│   │   └── directives/          → Özel directive'ler
│   ├── features/                → Her özellik kendi klasöründe
│   │   └── [feature-name]/
│   │       ├── [feature-name].module.ts
│   │       ├── [feature-name]-routing.module.ts
│   │       ├── components/
│   │       │   └── [component-name].component.ts/html/css
│   │       └── services/
│   │           └── [feature-name].service.ts
│   ├── models/                  → Backend DTO'larının TypeScript interface karşılıkları
│   ├── app.module.ts            → Root module
│   ├── app.component.ts/html/css
│   └── app-routing.module.ts    → Root routing
├── assets/                      → Statik dosyalar (görseller vb.)
├── environments/                → Ortam konfigürasyonu
│   ├── environment.ts           → Development
│   └── environment.prod.ts      → Production
├── index.html
├── main.ts
└── styles.css                   → Global stiller

Bu yapıda olmayan bir klasörü oluşturma.
Bu yapıdan bir klasörü silme veya taşıma.

## 4. ÖZELLİK EKLEME SÜRECİ

Kullanıcı yeni bir özellik istediğinde şu adımları sırasıyla izle:

Adım 1: Backend'deki ilgili DTO'yu oku → models/ klasörüne TypeScript interface olarak ekle
Adım 2: features/[feature-name]/ klasörü oluştur
Adım 3: Feature module ve routing module oluştur
Adım 4: services/ altında service oluştur → API çağrılarını buraya yaz
Adım 5: components/ altında component oluştur (ts + html + css)
Adım 6: Feature routing'ini app-routing.module.ts'a ekle

Her adımı tamamladıktan sonra DUR. Kullanıcıya ne yaptığını bildir ve "devam edeyim mi?" diye sor.
Kullanıcı onay vermeden bir sonraki adıma geçme.

## 5. API KULLANIM KURALI

Backend'deki endpoint'leri SADECE kullanıcı açıkça belirttiğinde kullan.

- Kullanıcı "şu endpoint'i kullan" demediği sürece, backend'deki herhangi bir endpoint'i
  kendi kendine entegre etme.
- Yeni bir API çağrısı yazmadan önce kullanıcıya sor.
- Endpoint yapısını ve DTO'yu backend kodundan oku ama asla değiştirme.
- HTTP çağrılarını her zaman service katmanına yaz, component içine doğrudan yazma.

## 6. YASAKLAR

- İskelet klasör yapısını değiştirme
- Dosyaları taşıma veya yeniden adlandırma
- any tipi kullanma — her zaman spesifik tip veya interface kullan
- Constructor içinde business logic yazma (ngOnInit kullan)
- Observable subscription'larını ngOnDestroy'da temizlemeyi unutma
- Kullanıcıdan izin almadan büyük değişiklik yapma
- Backend klasörüne hiçbir koşulda dokunma
- Kullanıcının "şunu ekle" demediği bir özelliği kendi kendine ekleme
- Angular Material dışında UI framework ekleme

## 7. KOD YAZIM STANDARTLARI

- Strict typing: her değişken, parametre ve dönüş tipi belirtilmeli
- Interface'ler models/ klasörüne, service'ler features/[name]/services/'e
- Her service @Injectable({ providedIn: 'root' }) ile işaretli olmalı
- Component selector'ları app- ön eki ile başlamalı
- Dosya adlandırma: kebab-case (user-list.component.ts)
- Class adlandırma: PascalCase (UserListComponent)