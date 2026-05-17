# kulakliksatisfrontend — Frontend Proje Bağlamı (Claude için)

> Bu dosya, Claude Code'un bu repository'de çalışırken uyacağı kuralları, projenin mevcut durumunu ve geliştirme felsefesini tanımlar. Her oturumun başında otomatik okunur.

---

## 🔴 MUTLAK KURALLAR — TARTIŞMA YOK

Aşağıdaki kurallar koşulsuz uygulanır. Bağlam, "acil durum", "hata düzeltme" gibi gerekçelerle gevşetilmez.

### 1. Backend repository'sine ASLA dokunulmaz

Backend repository'si (`../kulakliksatisapi/`) tamamen **read-only**. AI bu repo'daki hiçbir dosyaya yazma, oluşturma, silme yapmaz. Sadece **okuma ve referans alma** izni vardır.

- API kontratını öğrenmek için `../kulakliksatisapi/docs/api-contract.md` okunabilir.
- Bir backend DTO'sunun yapısını öğrenmek için ilgili `.java` dosyası okunabilir.
- Backend'de bir bug fark ettiğinde sadece **rapor et**, "düzelteyim" deme.

### 2. Onay olmadan kod üretilmez/değiştirilmez

Küçük olduğu düşünülen değişiklikler bile dahil — **AI önce planı söyler, kullanıcı onaylar, sonra uygular**. Tek istisna: kullanıcı açıkça "uygula" demişse veya görev gereği zincirleme adımlar varsa (örn. dosya oluştur → import et) ara onay atlanabilir.

Aksi durumlarda akış:
1. Plan / diff göster
2. Onay bekle
3. Uygula

### 3. `any` tipi yasak

TypeScript `strict` mode açık, `any` kullanımı **yasak**. Gerçekten bilinmeyen tip ise `unknown` kullanılır, sonra daraltılır. Generic'lerde `extends` ile sınırlandırılır.

`@ts-ignore`, `@ts-expect-error` da yasak — sadece **gerçekten** TypeScript bug'ı için (kullanıcı onayı ile).

### 4. Angular Material dışında CSS framework yasak

Tailwind, Bootstrap, Bulma, styled-components, Emotion, vs. — eklenmez. Mevcut Angular Material kütüphanesi yeterlidir. İhtiyaç olursa Material'ın CSS custom properties / theming sistemi kullanılır.

Dışarıdan alınan tasarım çıktıları (Claude Design, Google Stitch vb.) entegre edilebilir, ancak çıktıdaki CSS framework bağımlılıkları (Tailwind sınıfları, Bootstrap grid, vs.) temiz CSS'e dönüştürülür. Yeni package.json bağımlılığı eklenmez, stil Material theming sistemiyle uyumlu tutulur.

### 5. HTTP çağrıları daima service katmanında

Component'ler `HttpClient`'i doğrudan **inject etmez**. Her API çağrısı bir service metodunda yaşar. Component → Service → HttpClient zinciri korunur.

### 6. Backend hata mesajını kullanıcıya gösterme

Backend'in döndüğü `message` alanı **teknik mesajdır** ("item, id:5 değeri ile bulunamadı." gibi) ve kullanıcıya gösterilmez. Kullanıcıya gösterilecek mesaj her zaman `EErrorCode` → `ErrorMessageService.getUserMessage()` zincirinden gelir.

Yeni `errorCode` eklendiğinde `error.model.ts` ve `error-message.service.ts` aynı anda güncellenir.

### 7. "Sonsuz döngü riski" template kalıpları yasak

Şu kalıp yasak:
```html

```
`(error)` handler içinde `src`'yi değiştirmek yeni `error` event tetikleyebilir → sonsuz döngü. Alternatif: state'te fallback URL tut, template'te conditional render.

---

## 1. Proje Özeti

**Adı:** kulakliksatisfrontend  
**Türü:** Kulaklık satış platformu frontend'i (Angular)  
**Asıl vaadi:** Kullanıcı satın almadan önce, ürün sayfasındayken kendi kulaklığını listeden seçerek, AutoEQ verisi + Web Audio API ile o kulaklığın "kendi kulaklığına göre nasıl ses vereceğini" preset müzikle test edebilsin.

**Geliştirme aşaması:** Erken. Auth + admin paneli + ana sayfa iskeleti var. Ürün detay sayfası, sepet, AutoEQ test arayüzü henüz yok.

**Backend bağlantısı:** Ayrı repository (`../kulakliksatisapi/`). Spring Boot 3.5.5. Bu frontend onu tüketir, asla dokunmaz.

---

## 2. Teknik Stack

- **Framework:** Angular 21.2.0 (en güncel — 2026 Mayıs itibarıyla)
- **Dil:** TypeScript 5.9 (strict mode, `any` yasak)
- **Routing:** Angular Router
- **State management:** Yok (servis + RxJS pipe zinciri ile yönetiliyor)
- **UI:** Angular Material 21.2.6 (indigo-pink prebuilt theme)
- **Form:** Reactive Forms (FormBuilder, Validators)
- **HTTP:** Angular HttpClient + interceptor
- **JWT:** jwt-decode 4.0
- **RxJS:** 7.8
- **Build:** Angular CLI 21.2.7
- **Test:** Vitest 4.0 + jsdom 28 (⚠️ Angular ekosisteminde standart dışı — Karma+Jasmine değil)
- **Format:** Prettier 3.8 (printWidth: 100, singleQuote: true)
- **Linter:** **YOK** (ileride eklenebilir, şu an Prettier yeterli)

---

## 3. Angular 21 Modern Syntax Tercihi

**Yeni kod yazılırken modern syntax kullanılır:**

- ✅ `@if`, `@else if`, `@else` — yeni control flow
- ✅ `@for (item of items; track item.id)` — yeni for, `track` zorunlu
- ✅ `@switch`, `@case`, `@default`
- ✅ `@let` — template içi local variable
- ✅ Signals (`signal()`, `computed()`, `effect()`) — yeni reactivity API
- ✅ `inject()` function — constructor injection yerine (modern Angular tercihi)
- ✅ `takeUntilDestroyed()` — manuel `Subscription` + `ngOnDestroy` yerine

**Eski syntax — sadece mevcut kod için kullanılır:**

- ⚠️ `*ngIf`, `*ngFor`, `*ngSwitch` — mevcut component'lerde varsa dokunma, ama yeni yazılan kodda kullanma
- ⚠️ `Subscription` + `ngOnDestroy` manuel unsubscribe — mevcut HomeComponent'te bu pattern var, koruyabilirsin; yeni component için `takeUntilDestroyed()` veya `async` pipe tercih edilir

**`async` pipe her zaman önce gelir** — Subscription manuel yönetimi ancak `async` pipe gerçekten mümkün değilse yapılır.

---

## 4. Standalone vs. NgModule Kararı

**Mevcut durum:** Proje `standalone: false` ile NgModule yaklaşımı kullanıyor. Login ve Admin feature modülleri lazy-loaded.

**Karar:** **Yeni component'ler standalone yazılır.** Mevcut NgModule yapısı korunur, refactor planlı.

**Pratikte ne demek:**

- ✅ Yeni feature: standalone component'lerle başla. (örn. Cart, ProductDetail, AutoEQTest)
- ✅ Yeni component eski bir feature module'a ekleniyorsa, **feature'ın tutarlılığı için** o module'a uyum sağlar.
- ❌ Mevcut NgModule yapısını "düzeltmek" için yarım refactor yapma. Tam refactor planlı bir iş — yapılacaksa `PROJECT-STATUS.md`'de görünür, ayrı bir görev olarak ele alınır.

---

## 5. Klasör Yapısı
src/app/
├── core/              ← Singleton, uygulama geneli (interceptor, guard, service)
├── shared/            ← Reusable component / pipe / directive (şu an çoğu boş)
├── features/          ← Feature klasörleri (her biri kendi modülü)
│   ├── home/
│   ├── login/
│   └── admin/
└── models/            ← TypeScript interface'ler ve enum'lar

**Yeni feature eklendiğinde:**
- `features/{feature-name}/` klasörü açılır
- İçinde: `components/`, `services/`, varsa `models/` alt klasörleri
- Lazy-loaded olarak `app-routing-module.ts`'e eklenir

---

## 6. Naming Convention'lar

- **Dosya:** kebab-case (`admin-items-table.component.ts`)
- **Class:** PascalCase (`AdminItemsTableComponent`)
- **Selector:** `app-` prefix zorunlu (`app-admin-items-table`)
- **Service:** `*Service` suffix
- **Model/Interface:** PascalCase, suffix yok (`UserResponse`, `ItemSummaryResponse`)
- **Enum:** PascalCase, sadece **opsiyonel** `E` prefix (backend ile tutarlı tutmak için backend enum karşılıkları `E` prefix alır: `EUserType`, `EErrorCode`)
- **Variable / function:** camelCase
- **Constant:** UPPER_SNAKE_CASE (sadece gerçek sabitler için)

---

## 7. Component Yazım Kuralları

### Dosya yapısı
- `*.component.ts` + `*.component.html` + `*.component.css` üçlüsü (inline template/style yasak değil ama tercih edilmez)
- Standalone component: `standalone: true` + `imports: [...]`
- Logic component'te, sunum template'te

### Inject yöntemi
```ts
// ✅ Modern (tercih)
private readonly userService = inject(UserService);

// ⚠️ Klasik (mevcut kodlarla uyum için kullanılabilir)
constructor(private userService: UserService) {}
```

### Change detection
- Gerektiğinde `OnPush` strategy tercih edilir.
- `ChangeDetectorRef.detectChanges()` **son çare**. Eğer manuel detection lazımsa, "neden Zone otomatik tetiklemedi?" sorulmalı (Zone-bypass async iş, NgZone.runOutsideAngular gibi durumlar).

### Subscription yönetimi
```ts
// ✅ Modern (tercih)
this.userService.users$
  .pipe(takeUntilDestroyed())
  .subscribe(...);

// ✅ Daha iyi: async pipe template'te
<div>{{ users$ | async }}</div>

// ⚠️ Klasik (mevcut kod için)
private sub = new Subscription();
ngOnInit() { this.sub.add(this.userService.users$.subscribe(...)); }
ngOnDestroy() { this.sub.unsubscribe(); }
```

---

## 8. Service Katmanı

### HTTP çağrıları
```ts
@Injectable({ providedIn: 'root' })
export class ItemService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/items`;

  getRecommendedItems(): Observable<ItemSummaryResponse[]> {
    return this.http.get<ItemSummaryResponse[]>(`${this.apiUrl}/recommended`);
  }
}
```

### Service yerleşimi
- **Global servisler** → `core/services/`
- **Feature-specific servisler** → `features/{feature}/services/`
- `providedIn: 'root'` default (tek instance, lazy import)

### Error handling — service'te değil, interceptor'da
Component'te `.subscribe({ error: ... })` yazma gereksiz. `AuthInterceptor` zaten global handler. Sadece **özel davranış** gerekiyorsa (örn. Login form'unda hatayı form altında göster) lokal handle edilir.

---

## 9. Form Handling

### Reactive Forms (zorunlu)
Template-driven (`[(ngModel)]`) yasak. Tüm formlar `FormGroup` + `FormBuilder`.

```ts
this.loginForm = this.fb.group({
  username: ['', [Validators.required, Validators.minLength(4)]],
  password: ['', [Validators.required, Validators.minLength(8)]]
});
```

### Validation
- Dahili `Validators.*` kullanılır.
- Custom validator gerektiğinde ayrı dosyaya yazılır (`shared/validators/`).
- Zod/Yup gibi runtime schema kütüphanesi **eklenmez** — `class-validator` style backend'de yapılıyor zaten.

### Hata gösterimi
- Validation errors template'te `*ngIf="control.hasError('...')"` (eski) veya `@if (control.hasError('...'))` (yeni) ile gösterilir.
- Submit hatası interceptor üzerinden snackbar'a gider; eğer form-altı mesaj **özel olarak** isteniyorsa component-local state'te tutulur.

---

## 10. Routing & Guards

### Route tanımları
- `app-routing-module.ts`'te ana route'lar.
- Feature modülleri lazy-loaded: `loadChildren: () => import('./...').then(m => m.AdminModule)`

### Guard yazımı — modern functional API
```ts
// ✅ Modern (yeni yazılırken)
export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (auth.isLoggedIn()) return true;
  router.navigate(['/login']);
  return false;
};

// ⚠️ Mevcut class-based guard'lar (AuthGuard, RoleGuard) refactor planlı
```

### Role kontrolü
- `RoleGuard` route data'sından roller okur: `data: { roles: [UserRole.ADMIN] }`
- Frontend role kontrolü **kullanıcı deneyimi içindir**, gerçek güvenlik backend'de olmalı.

---

## 11. State Management

### Yaklaşım
Global state için **NgRx/Akita eklenmez** (gereksiz karmaşıklık). Bunun yerine:

- **Auth state:** `AuthService` üzerinden, localStorage cache ile
- **UI state:** Component-local
- **Server state:** `HttpClient` + Service'in döndüğü Observable

### Signals ne zaman?
Yeni reactivity ihtiyacı için **Signals** tercih edilir (Angular 16+ resmi öneri). Örn. bir component'in birden çok türetilmiş değeri varsa `computed()` ideal.

```ts
private readonly count = signal(0);
readonly doubled = computed(() => this.count() * 2);
```

### Cross-component state
İki component aynı state'e ihtiyaç duyuyorsa:
1. **Yakın ata component** → input/output ile geçir
2. **Uzak ata** → BehaviorSubject/Signal taşıyan service
3. **NgRx-vari ihtiyaç oluştuğunda** kullanıcıya sor, eklenip eklenmeyeceğine karar verilir

---

## 12. Styling

### Genel
- Angular Material her yerde
- Component-level `.css` dosyaları (bileşene özgü stil)
- Global stiller → `styles.css` (sadece theme import + global utility)

### Tema
- `indigo-pink` prebuilt theme
- Renkler `mat-toolbar`, `mat-button` vs. üzerinden gelir
- Material'ın CSS custom properties sistemi kullanılabilir (`--mat-...`)

### Hardcoded renk yasağı
Component CSS'inde `color: #f44336` gibi hardcoded renk kullanma. Bunun yerine:
- Material theme renklerinden
- Veya `styles.css`'te tanımlanmış CSS variable'lardan

### Font / Icon
- Font: Roboto (global, `styles.css`'te set edilmiş)
- Icon: Material Icons (index.html'de CDN)

---

## 13. Auth & Token Yönetimi

### Mevcut yaklaşım
- Token `localStorage`'da (`authToken` key)
- UserInfo da `localStorage`'da cache (`userInfo` key)
- `AuthInterceptor` her isteğe `Authorization: Bearer <token>` ekler
- 401 → otomatik logout + `/login` redirect

### Bilinen trade-off
Token `localStorage`'da → XSS riski mevcut. httpOnly cookie tercih edilmedi (mevcut karar). Bu CLAUDE.md'de **bilinçli karar** olarak korunur, değiştirilmek istenirse `PROJECT-STATUS.md`'de planlı iş olarak gündeme alınır.

### JWT decode
`jwt-decode` kütüphanesi ile `exp` claim kontrol edilir. Süresi dolmuşsa otomatik logout.

---

## 14. Error Handling

### Zincir
HTTP error → AuthInterceptor.catchError
→ (401 ise logout + redirect)
→ diğer → ErrorMessageService.getUserMessage(errorCode)
→ SnackbarService.showError(turkishMessage)

### Component'te özel handling
Sadece **özel UX davranışı** gerekiyorsa. Örn. login form altında hata mesajı göstermek — bu durumda interceptor'ı **tamamen bypass etme**, üzerine ek olarak göster (mevcut Login pattern'i).

### Backend mesajı asla gösterilmez
Bu kural yukarıda da var ama burada hatırlatma: backend'in `message` alanı debug için, log için, ama **kullanıcıya değil**.

---

## 15. Test Yaklaşımı

### Mevcut durum
- Vitest + jsdom kurulu
- Fiilen test **yok** (sadece boş `app.spec.ts`)

### Yeni component yazıldığında
- Şu an test yazma zorunluluğu yok (proje öğrenme aşamasında)
- Yazılırsa Vitest syntax (Jasmine değil)
- Angular Testing Library kullanılabilir

### İleride eklenecek (planlı iş)
Kritik flow'lar için (login, sepete ekle, ödeme — eklendiğinde) integration test yazılması beklenir. Bu Faz 5 işi.

---

## 16. 🟠 Bilinen Sorunlar / Refactor Bekleyenler

Bu liste **AI'ın yeni hata üretmemesi için** bilgilendiricidir. **AI bu sorunları kendiliğinden düzeltmez**, sadece kullanıcı talep ederse müdahale eder.

### Kritik (yakında düzeltilecek)
1. **Dosya adlandırma:** Kök app dosyaları Angular konvansiyonuna uymuyor (`app.ts`, `app-module.ts`, `app-routing-module.ts`, `app.html`). Doğrusu: `app.component.ts/html/css`, `app.module.ts`, `app-routing.module.ts`.
2. **Login çift hata gösterimi:** Hata hem snackbar'da hem form altı errorMessage'da görünüyor. Düzeltme: sadece snackbar.
3. **`environment.prod.ts` apiUrl placeholder:** `'PRODUCTION_URL'` — gerçek değer girilmeden production build çalışmaz.
4. **`console.log` spam:** HomeComponent'te `[HomeComponent] ngOnInit çalıştı.` gibi debug log'lar kalmış, temizlenmeli.

### Orta öncelik
5. **Deprecated class-based guard'lar:** `AuthGuard`, `RoleGuard` — `CanActivateFn` (functional) API'ye geçilmeli.
6. **HomeComponent modülsüz:** `features/home/` kendi modülüne sahip değil, `AppModule`'de declare edilmiş. Diğer feature'larla tutarsız.
7. **NgModule → Standalone refactor:** Yukarıda detaylandı. Yeni component'ler standalone, mevcutlar zamanla refactor.
8. **`UserResponse.userType` array:** Backend `Set<UserTypeResponse>` dönüyor, frontend `userType[0]` ile erişiyor. Backend tek tip dönecekse fix edilmeli; çoklu tip planlanıyorsa UI'da hesaba katılmalı.
9. **Admin sekme routing kullanmıyor:** `selectedPage: string` ile yönetiliyor. URL değişmiyor, deep link çalışmıyor. Düzeltme: child route'lar.

### Düşük öncelik
10. **Subscription manual yönetimi:** `takeUntilDestroyed()` veya `async` pipe'a geçiş.
11. **`ChangeDetectorRef.detectChanges()` HomeComponent'te:** Zone-bypass kaynağı araştırılıp temizlenmeli.
12. **`shared/pipes/` ve `shared/directives/` boş** — kullanılmıyorsa silinebilir veya ihtiyaç oluşana kadar kalır.
13. **Header'daki placeholder alanlar:** Arama, profil, sepet ikonu — UI bağlamlandığında doldurulacak.
14. **Ana sayfa sol kategori menüsü placeholder.**

---

## 17. API Kontratı Erişimi

Frontend backend'i tüketir. **Tek doğruluk kaynağı:**

📄 `../kulakliksatisapi/docs/api-contract.md`

AI bu dosyayı **referans olarak okur** (yazma izni yok — backend repo MUTLAK KURAL 1).

### Frontend model dosyaları
- `models/auth.model.ts` — LoginRequest/Response, JwtPayload, UserRole, UserInfo
- `models/user.model.ts` — EUserType, UserTypeResponse, UserResponse, UserUpdateRequest, SellerResponse
- `models/item.model.ts` — ItemSummaryResponse
- `models/error.model.ts` — EErrorCode enum, ErrorResponse, ValidationErrorResponse

### Backend değişti mi kontrolü
Yeni endpoint/DTO geldiğinde:
1. `api-contract.md`'yi oku
2. İlgili frontend model dosyasını **kullanıcının onayıyla** güncelle
3. Service'i güncelle
4. Etkilenen component'leri güncelle

---

## 18. Yakın Vade Roadmap

**Sırasıyla:**
1. **Ürün detay sayfası** — backend `GET /api/items/{id}` çağrılarak (⚠️ şu an SELLER kısıtlı, backend tarafında düzelmesi bekleniyor)
2. **Sepet UI** — backend Cart domain'i bittikten sonra
3. **AutoEQ test arayüzü** — kullanıcı kendi kulaklığını listeden seçer, Web Audio API + AudioContext + BiquadFilterNode chain ile preset müziği EQ'lar

**Yakın geleceğin teknik gereksinimleri:**
- `AudioContext` servisi — singleton, muhtemelen `NgZone.runOutsideAngular()` ile
- AutoEQ filtre veri yapısı — 10-band PEQ (frekans, gain, Q, filter type)
- AutoEQ veri kaynağı henüz net değil (backend mi, GitHub raw mı, frontend bundle mı)

---

## 19. Geliştirme Yardımcısı Olarak AI'ın Rolü

- ✅ Component / service / model yazmak (kullanıcı onayıyla)
- ✅ Backend API'sini tüketen kod yazmak
- ✅ Mevcut kodu refactor etmek (kullanıcı talebiyle)
- ✅ Bilinen sorunları çözmek (kullanıcı talebiyle, listede olan)
- ✅ Test yazmak (talep edilirse)
- ✅ Tasarım/UX öneri sunmak
- ✅ CLAUDE.md ve PROJECT-STATUS.md için **öneri vermek** (uygulama kullanıcı onayıyla)
- ❌ Backend dosyalarına yazmak (MUTLAK KURAL 1)
- ❌ Kullanıcı onayı olmadan yeni dosya/değişiklik yapmak
- ❌ Bilinen sorunlar listesinde olan ama henüz iznin verilmediği şeyleri "geçerken düzeltmek"

---

## 20. Bakım Notu

**Bu dosya ne zaman güncellenir:**
- Yeni bir kalıcı kural ortaya çıktığında
- Bir kural eskidiğinde (örn. NgModule → Standalone tamamen geçildiğinde §4 güncellenir)
- Yeni bir bilinen sorun keşfedildiğinde §16'ya eklenir
- Sorun çözüldüğünde §16'dan silinir
- Tech stack değiştiğinde (kütüphane eklendi/kaldırıldı/major version atlandı)

**Nasıl güncellenir:**
- AI: "Bu kuralı CLAUDE.md'ye ekleyim mi?" diye **diff sunar**, kullanıcı onaylarsa uygular
- Kullanıcı manuel ekleyebilir (her zaman geçerli)
- Yardımcı prompt: `prompts/frontend/add-rule.md` (Adım 4.7'de yazılacak)

**Şişme uyarısı:** Bu dosya 600 satırı geçerse büyük ihtimal:
- Bir bölüm gereksiz uzamış (örn. bir kural 20 örnekle anlatılmış — 1-2 örnek yeterli)
- Birden fazla bilinen sorun kalıcı kural gibi yazılmış (PROJECT-STATUS.md'ye taşı)
- Geçici notlar birikmiş (temizle)

**Bu dosya ile `PROJECT-STATUS.md` arasındaki sınır:**
- CLAUDE.md = kural (nadiren değişir)
- PROJECT-STATUS.md = durum (sık değişir)
- "Şu an Cart üstünde çalışıyorum" → STATUS
- "Reactive Forms zorunludur" → CLAUDE.md