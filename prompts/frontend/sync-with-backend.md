# Backend ile Senkronizasyon

## Ne işime yarar
Backend'de api-contract.md değişti. Frontend tarafında:
- TypeScript modeller güncel mi?
- Service metodları doğru imzaya sahip mi?
- Error code mapping'i güncel mi?

## Ne zaman çalıştırırım
- Backend'de bir endpoint/DTO/error code değişti
- Backend repo'sunda yeni bir feature tamamlandı
- Backend'de bir bug fix yapıldı, response şekli değişti

## Nasıl çalıştırırım
Frontend repo'sunda Claude Code aç, aşağıdaki prompt'u ver.

---

## PROMPT

Görev: Backend ile frontend uyumunu kontrol et.
Oku:

- ../kulakliksatisapi/docs/api-contract.md (backend kontratı — SADECE OKU, asla dokunma)
- src/app/models/*.ts (frontend modeller)
- src/app/**/services/*.ts (frontend service'ler)
- src/app/core/services/error-message.service.ts (error code mapping)

Karşılaştır:
1. Model uyumu
Her backend DTO'su için frontend'de karşılığı var mı?

- Field'lar eşleşiyor mu? (isim, tip, nullable)
- Yeni eklenmesi gereken field var mı?
- Silinmesi gereken field var mı?

2. Service uyumu
Her backend endpoint için frontend service metodu var mı?

- Path doğru mu?
- HTTP method doğru mu?
- Request/response tipleri doğru mu?

3. Error code uyumu
Backend'de tanımlı EErrorCode'lar için frontend ErrorMessageService'te Türkçe mesaj var mı?

- Eksik mapping var mı?
- Backend'de artık olmayan ama frontend'de hâlâ duran error code var mı?

ÇIKTI:
Tutarsızlıklar
[Madde madde, her biri için "şu dosyada şu değişiklik" formatında]

Backend'in farkında olmamız gereken yeni şeyleri
[Backend tarafında yeni eklenmiş ama frontend'in henüz tüketmediği endpoint/DTO]

Önerdiğim sıralı eylemler
[Hangi değişikliği önce yapmalı, hangisi sonra — bağımlılık varsa belirt]

KURALLAR:

- ../kulakliksatisapi/ klasörüne sadece OKU, asla yazma (MUTLAK KURAL).
- Frontend tarafında değişiklik önerirken DIFF göster, onayımı bekle.
- Emin değilsen "⚠️ EMİN DEĞİLİM" yaz.

---

## Çıktıyı nasıl kullanırım
1. AI sana tutarsızlıkları listeler
2. "Şunu şöyle güncelle" dediklerinden hangilerine onay vereceğine karar ver
3. Onayladıklarını AI uygular

## Token tüketimi
Tahmini: 4-10K (proje büyüdükçe artar)