# Anında Kural Ekleme

## Ne işime yarar
AI yazarken bir pattern kararı netleşti ("memo ile sar", "OnDestroy yerine takeUntilDestroyed kullan", vs.) — CLAUDE.md'ye anında, sürtünmesiz eklemek.

## Ne zaman çalıştırırım
- AI bir component yazdı, review ettin, "bu hep böyle olsun" dedin
- AI bir hata yaptı, "bunu bir daha yapma" dedin
- Bir teknik karar verdin, kalıcılaşması lazım

## Nasıl çalıştırırım
Mevcut oturumda (yeni oturum açmaya gerek yok), AI'a aşağıdaki prompt'u ver.

---

## PROMPT

Bu kuralı CLAUDE.md'ye kalıcı ekle:

[BURAYA YAZ: kuralın tam metni — kısa olsun, 1-3 cümle]

Görevin:

1. CLAUDE.md'yi oku, bu kuralın gideceği en uygun bölümü tespit et (§3 Modern Syntax / §7 Component Yazım / §8 Service Katmanı / §16 Bilinen Sorunlar / yeni bölüm gerekir mi vs.)
2. Bana DIFF göster: hangi satırın altına ne ekleyeceğin
3. Onaylarsam uygula

KURALLAR:

- Önce diff, sonra onay, sonra uygulama.
- Mevcut kuralla çelişiyorsa beni uyar.
- Çok benzer bir kural zaten varsa beni uyar, yeniden ekleme.
- Kural metni 5 satırı geçmemeli — şişirme.

---

## Çıktıyı nasıl kullanırım
1. AI sana diff verir
2. "Tamam, uygula" dersen CLAUDE.md'yi günceller
3. Şüphen varsa "şu kelimeyi değiştir" diyebilirsin

## Token tüketimi
Tahmini: 1-2K (çok küçük)

## Örnek tetikleyici durumlar
- "Her async işlem `takeUntilDestroyed()` ile sarılmalı"
- "Form field için her zaman `MatError` kullan, console.error değil"
- "Lazy module isimlendirme `{feature}Module` formatında"
- "Component template'inde `||` ile fallback değer verme, `??` kullan"