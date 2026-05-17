# PROJECT-STATUS.md Güncelleme Önerisi

## Ne işime yarar
Bu haftaki ilerlemeyi PROJECT-STATUS.md'ye yansıtmak. AI sana commit history'sine bakıp önerilerini sunar.

## Ne zaman çalıştırırım
- Hafta sonu (haftalık ritmin parçası)
- Bir feature/sprint kapanışında
- "Status dosyası eskimiş hissediyorum" anında

## Nasıl çalıştırırım
İlgili repo'da Claude Code aç, prompt'u yapıştır, isteğe bağlı olarak tarih aralığı belirt.

---

## PROMPT

HİÇBİR DOSYA DEĞİŞTİRME. Sadece oku ve öner.

Görev: PROJECT-STATUS.md'yi güncel commit'lerle senkronize et.
[İsteğe bağlı: "Son 1 hafta" veya "Son 5 commit" veya "Şu tarihten beri" diye sınırla. Belirtmezsen son 1 hafta varsay.]

İncele:

- git log (son 1 hafta veya belirtilen aralık)
- Yapılan değişikliklerin özet niteliğini çıkar

Sonra PROJECT-STATUS.md için öneri:
__"Şu Anki Odak" güncellemesi__

- Aktif feature değişti mi?
- Aktif teknik borç değişti mi?
- "Bu hafta yapılması beklenen" listesi hangi maddeler işaretlendi/silindi/eklendi?

__"Mevcut Olgunluk"__

- "Tamamlanmış"a eklenecek var mı?
- "Kısmen var ama eksik"ten "tamamlanmış"a geçen var mı?
- "Henüz başlanmamış"tan "kısmen var"a geçen var mı?

__"Yakın Vade Roadmap"__

- Hangi madde checkbox'ları işaretlendi?
- Tamamen biten bir bölüm tamamen "Tamamlanmış"a taşınmalı mı?

__"Geçmiş Kilometre Taşları"__

-Bu hafta için bir satır eklenmeli mi? Eklenecekse taslak şu: **YYYY-MM-DD** — [milestone özeti]

__"Teknik Borç Detay Listesi"__

- Çözülmüş madde var mı? (silinmeli)
- Yeni bilinen sorun var mı? (eklenmeli)

ÇIKTI: Her madde için diff göster, ben elle uygulayacağım.
KURALLAR:

- Sadece commit'lerden çıkar, varsayma.
- Tarih bilgisi varsa kullan, yoksa "kabaca son hafta" de.
- Önerilerin küçük ve eyleme dönüştürülebilir olsun.

---

## Çıktıyı nasıl kullanırım
1. AI'nin önerilerini gözden geçir
2. Onayladıklarını PROJECT-STATUS.md'ye elle yansıt (~5 dakika)
3. Aynı commit'le itelersen daha temiz olur

## Token tüketimi
Tahmini: 3-7K