# Frontend Feature Kapanış İncelemesi

## Ne işime yarar
Bir feature tamamlandı. AI'nin bu süreçte kullandığı pattern'lerden hangileri "kalıcı kural" olmalı, hangileri "bir kerelik karar" — analiz et.

## Ne zaman çalıştırırım
- Bir feature/sayfa tamamen bitti (örn. "ürün detay sayfası bitti")
- 2-3 günlük bir frontend iş bloku bittikten sonra
- AI'nin pattern tutarlılığını kontrol etmek istediğinde

## Nasıl çalıştırırım
VS Code'da Claude Code panelinde, mevcut oturumda (bağlam canlı kalsın), aşağıdaki prompt'u ver.

---

## PROMPT

Az önce [BURAYA YAZ: feature adı] tamamlandı.

Görev: Bu süreçte yaptıklarımızı analiz et ve şu sorulara cevap ver:
1. Pattern özeti
Bu feature'da kullandığımız tüm önemli pattern'leri listele:

- State management nasıl yaptık?
- HTTP çağrıları nasıl yapıldı?
- Form handling nasıl?
- Error handling nasıl?
- Component yapısı (standalone mi, module mi)?
- Subscription yönetimi?

2. CLAUDE.md güncelleme önerileri
Bu pattern'lerden hangileri:

- Mevcut kuralla tutarlı (güncellemeye gerek yok)
- Yeni bir kural olarak eklenmeli (CLAUDE.md hangi bölümüne)
- Var olan bir kuralla çelişiyor (uyar)

3. Tekrar etmemem gereken hatalar
Bu süreçte yaptığım hata/eksik var mıydı? Var ise CLAUDE.md "AI'a notlar" gibi bir bölüme eklenmeli mi?

4. PROJECT-STATUS.md güncellemeleri

- "Tamamlanmış olanlar"a eklenecek?
- "Yakın Vade Roadmap" checkbox işaretlenmeli mi?
- "Geçmiş Kilometre Taşları"na eklenecek mi?
- "Henüz başlanmamış" listesinden çıkarılacak mı?

5. Bilinen sorunlar

- Bu feature'da bilinen sorunlar listesinden bir madde çözüldü mü?
- Yeni bir bilinen sorun ortaya çıktı mı?

ÇIKTI FORMATI:

Her bölüm için diff/öneri formatında. Hiçbir dosyaya henüz dokunma — onayladığım maddeleri sonra uygulayacağım.
KURALLAR:

- Sadece DIFF/ÖNERİ ver. Uygulama için onayımı bekle.
- Önerilerini 1-3 satırla gerekçelendir.
- "Çok küçük bir karar, kural olmaya değmez" diyebileceğin yerlerde de söyle.

---

## Çıktıyı nasıl kullanırım
1. Önerileri madde madde değerlendir
2. Kabul ettiklerin için "şunları uygula" de — AI dosyaları günceller
3. Reddettiklerin için "geçici karardı, kalıcılaştırma" de

## Token tüketimi
Tahmini: 4-8K