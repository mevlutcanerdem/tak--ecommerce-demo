# Güvenlik Notları

Bu proje bir **demo/gösterim** uygulamasıdır; yine de gerçekçi bir e-ticaret sitesine yakışır temel güvenlik pratiklerini uygular.

## Uygulanan önlemler

- **Kimlik doğrulama**: parolalar BCrypt ile hash'lenir, hiçbir zaman düz metin loglanmaz/döndürülmez. Girişte JWT üretilir (kısa ömürlü, imzalı); korumalı endpoint'ler her istekte imza ve süre kontrolü yapar.
- **Yetkilendirme**: sipariş/hesap endpoint'leri yalnızca oturum sahibinin kendi verisine erişmesine izin verir (IDOR'a karşı kontrol edilir).
- **Brute-force koruması**: `/api/auth/login` üzerinde basit oran sınırlama (rate limiting) uygulanır.
- **Girdi doğrulama**: tüm istek DTO'ları Bean Validation ile doğrulanır; hatalı/aşırı büyük girdi 400 ile reddedilir.
- **Hata yanıtları**: stack trace, SQL veya iç sistem detayları istemciye asla sızdırılmaz.
- **HTTP güvenlik başlıkları**: hem backend (API yanıtları) hem frontend (nginx) tarafında `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy` ve `Content-Security-Policy` ayarlanır.
- **XSS**: frontend, React'in varsayılan escaping mekanizmasına güvenir; `dangerouslySetInnerHTML` kullanılmaz.
- **CI'da otomatik tarama**: her push/PR'da CodeQL (SAST, Java + TypeScript) ve PR'larda GitHub Dependency Review (bilinen yüksek/kritik CVE'li bağımlılıkları engeller) çalışır; frontend CI ayrıca `npm audit` yapar.
- **Sırlar**: gerçek bir JWT secret / DB parolası kod tabanına commit edilmez — `.env` (git-ignored) ve k8s `Secret` objeleri üzerinden verilir. `k8s/` ve `.env.example` içindeki değerler yalnızca **yerel demo** amaçlıdır.

## Kapsam dışı (bilinçli olarak demo seviyesinde tutulan konular)

- Gerçek bir ödeme sağlayıcısı entegre edilmemiştir (bkz. [README](README.md#kapsam-dışı)) — bu nedenle PCI-DSS kapsamı yoktur.
- 2FA, CAPTCHA, WAF, gelişmiş bot koruması gibi production-seviye ek katmanlar eklenmemiştir.
- `k8s/` içindeki secret'lar demo amaçlı düz metindir; gerçek bir dağıtımda Sealed Secrets / External Secrets / bulut KMS kullanılmalıdır.
- TLS sonlandırma bu depoda yapılandırılmamıştır; gerçek bir yayına alma senaryosunda ingress/reverse proxy seviyesinde HTTPS zorunlu kılınmalıdır.

## Bir açık bulursanız

Bu bir demo/portföy projesi olduğu için resmi bir güvenlik açığı bildirim süreci yoktur; yine de bulgularınızı repo üzerinden bir issue olarak açabilirsiniz.
