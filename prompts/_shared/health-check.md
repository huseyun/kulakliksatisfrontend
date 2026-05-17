# Haftalık Sağlık Kontrolü

## Ne işime yarar
CLAUDE.md ve PROJECT-STATUS.md dosyaları tutarlı mı? Çelişki, eskimiş bilgi, gereksiz tekrar var mı? Haftalık küçük ritüel.

## Ne zaman çalıştırırım
- Pazar gecesi (önerilen)
- Veya: bir feature kapanışından önce
- Veya: "bu dosyalar artık güncel mi?" hissi geldiğinde

## Nasıl çalıştırırım
İlgili repo'da (backend veya frontend) Claude Code aç, aşağıdaki prompt'u ver. **Her repo için ayrı çalıştır** — iki repo'nun kendi bağlamı var.

---

## PROMPT

HİÇBİR DOSYA DEĞİŞTİRME. Sadece oku ve raporla.

Görev: Bu repo'daki dosyaların sağlığını kontrol et.

1. CLAUDE.md

- Eskimiş bilgi var mı? (örn. "henüz yazılmadı" diyen bir şey artık var)
- Çelişen kurallar var mı? (örn. iki farklı bölümde aynı konuda farklı tavsiye)
- Tekrar eden bilgi var mı? (gereksiz şişme)
- Mevcut kodla uyumsuz kural var mı? (artık geçerli değil)
- Dosyanın satır sayısı şişme sınırını geçti mi? (~300-500)

2. PROJECT-STATUS.md

- "Şu Anki Odak" gerçekten güncel mi?
- "Tamamlanmış olanlar"da olmaması gereken bir şey var mı?
- "Yakın Vade Roadmap"te artık geçersiz bir madde var mı?
- "Geçmiş Kilometre Taşları"nda eskimiş kayıtlar var mı? (3 aydan eski, silmeye değer mi)
- Dosyanın satır sayısı şişme sınırını geçti mi? (~250)

3. (Sadece backend) docs/api-contract.md

- Gerçek kodda olmayan endpoint var mı?
- Gerçek kodda olan ama belgelenmemiş endpoint var mı?
- "Kritik Güvenlik Durumu" bölümündeki uyarılar hâlâ geçerli mi?

4. İki repo arası tutarlılık (sadece eğer iki repo'ya da erişim varsa)

- Backend'de yeni eklenen endpoint frontend modellerine yansıdı mı?
- Frontend'in beklediği bir endpoint backend'de var mı?

ÇIKTI:
Önemli bulgular (düzeltilmeli)
[Madde madde, her biri için "şu dosyada şu yer şöyle düzeltilmeli"]

Küçük öneriler (opsiyonel)
[Acil değil ama yapılırsa iyi olur]

Durum: ✅/⚠️
[Genel sağlık durumu: tertemiz mi, küçük bakım mı, ciddi temizlik mi?]

KURALLAR:

- Sadece OKU, hiçbir dosyaya dokunma.
- Abartma. Her küçük detay "sorun" değil.
- Her bulgu için kanıt göster ("şu satırda şu yazıyor ama gerçekte..").

---

## Çıktıyı nasıl kullanırım
1. Önemli bulguları elle düzelt (10-15 dakikalık iş)
2. Küçük önerileri biriktir, bir sonraki haftalık check'te tekrar bak
3. Durum "✅ tertemiz" çıkarsa keyifle git, başka iş yap

## Token tüketimi
Tahmini: 4-10K