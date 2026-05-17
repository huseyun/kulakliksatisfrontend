# Bilinen Sorun Düzeltme Planı

## Ne işime yarar
Bilinen sorunlar listesindeki bir maddeyi düzeltme zamanı geldi. AI sana sıralı, kontrollü bir plan çıkarır. Sen onaylarsan uygular.

## Ne zaman çalıştırırım
- "Şu hafta dosya adlandırma sorununu düzelteceğim" gibi planlı bir hedefin olduğunda
- Pazar gecesi sağlık kontrolü sırasında çözebileceğin bir maddeye karar verdiğinde
- Bir feature'a başlamadan önce, ilgili bir teknik borç temizliği

## Nasıl çalıştırırım
Frontend repo'sunda Claude Code aç, aşağıdaki prompt'u ver, hangi maddeyi düzelteceğini belirt.

---

## PROMPT

Düzeltilecek bilinen sorun: [BURAYA YAZ: örn. "Kök app dosyaları Angular naming convention'ına aykırı"]

(CLAUDE.md §16 ve PROJECT-STATUS.md "Teknik Borç Detay Listesi"nde tanımlı maddelerden biri.)
Görev:

1. Bu sorunu mevcut kodda incele — gerçekten neyin yanlış olduğunu doğrula.
2. Sıralı bir refactor planı çıkar:

- Hangi dosyalar etkilenecek?
- Hangi sırayla yapılmalı? (bağımlılıklar)
- Risk noktaları neler? (build kırılır mı, başka yeri etkiler mi)

3. Plan'ı bana sun — her adım için ayrı diff/açıklama.
4. Onaylarsam adım adım uygula (her adım sonrası dur, devam onayı al).

ÇIKTI:
Sorunun mevcut durumu
[Kısa açıklama: nerede, nasıl yanlış]

Refactor planı

Adım 1: [Ne yapılacak] — [Etki: hangi dosyalar]
Adım 2: ...
...

Risk değerlendirmesi
[Olası problemler, kaçınma stratejisi]

Test/doğrulama önerisi
[Refactor sonrası nasıl test edebilirsin]

KURALLAR:

- Önce sadece planı sun. Uygulamayı her adım için ayrı onay isteyerek yap.
- Adımlar atomic olsun (her biri tek başına commit'lenebilir).
- Mevcut kuralla çelişen bir adım gerekiyorsa beni uyar.

---

## Çıktıyı nasıl kullanırım
1. AI'nin planını gözden geçir
2. Adım adım onay vererek ilerle
3. Her adım sonrası build/lint çalıştır (sen veya AI)
4. Tamamen bittiğinde, ilgili maddeyi CLAUDE.md §16 ve PROJECT-STATUS.md "Teknik Borç"tan sil

## Token tüketimi
Tahmini: 5-15K (sorunun büyüklüğüne göre)