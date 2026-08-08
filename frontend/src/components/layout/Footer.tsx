import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Logo } from './Logo'

const socialIcons = [
  {
    label: 'Instagram',
    path: 'M12 2.2c3.2 0 3.58.01 4.85.07 1.17.05 1.97.24 2.43.4a4.9 4.9 0 0 1 1.77 1.15 4.9 4.9 0 0 1 1.15 1.77c.16.46.35 1.26.4 2.43.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.24 1.97-.4 2.43a4.9 4.9 0 0 1-1.15 1.77 4.9 4.9 0 0 1-1.77 1.15c-.46.16-1.26.35-2.43.4-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.97-.24-2.43-.4a4.9 4.9 0 0 1-1.77-1.15 4.9 4.9 0 0 1-1.15-1.77c-.16-.46-.35-1.26-.4-2.43-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.24-1.97.4-2.43a4.9 4.9 0 0 1 1.15-1.77A4.9 4.9 0 0 1 4.72 2.67c.46-.16 1.26-.35 2.43-.4C8.42 2.21 8.8 2.2 12 2.2Zm0 1.8c-3.14 0-3.5.01-4.73.07-.96.04-1.48.2-1.82.34-.46.18-.78.39-1.13.73-.34.35-.55.67-.73 1.13-.14.34-.3.86-.34 1.82-.06 1.23-.07 1.59-.07 4.73s.01 3.5.07 4.73c.04.96.2 1.48.34 1.82.18.46.39.78.73 1.13.35.34.67.55 1.13.73.34.14.86.3 1.82.34 1.23.06 1.59.07 4.73.07s3.5-.01 4.73-.07c.96-.04 1.48-.2 1.82-.34.46-.18.78-.39 1.13-.73.34-.35.55-.67.73-1.13.14-.34.3-.86.34-1.82.06-1.23.07-1.59.07-4.73s-.01-3.5-.07-4.73c-.04-.96-.2-1.48-.34-1.82a3.1 3.1 0 0 0-.73-1.13 3.1 3.1 0 0 0-1.13-.73c-.34-.14-.86-.3-1.82-.34-1.23-.06-1.59-.07-4.73-.07Zm0 3.06a4.94 4.94 0 1 1 0 9.88 4.94 4.94 0 0 1 0-9.88Zm0 1.8a3.14 3.14 0 1 0 0 6.28 3.14 3.14 0 0 0 0-6.28Zm5.13-1.99a1.15 1.15 0 1 1-2.3 0 1.15 1.15 0 0 1 2.3 0Z',
  },
  {
    label: 'Facebook',
    path: 'M13.5 21.6v-8.1h2.72l.41-3.15h-3.13V8.35c0-.91.25-1.53 1.56-1.53h1.66V3.99C15.87 3.87 14.9 3.8 13.76 3.8c-2.38 0-4.01 1.45-4.01 4.11v2.44H7.02v3.15h2.73v8.1h3.75Z',
  },
  {
    label: 'Pinterest',
    path: 'M12 2.4c-5.3 0-9.6 4.3-9.6 9.6 0 4.07 2.54 7.54 6.11 8.93-.08-.76-.16-1.92.03-2.75.18-.75 1.16-4.77 1.16-4.77s-.3-.59-.3-1.47c0-1.37.8-2.4 1.79-2.4.84 0 1.25.63 1.25 1.39 0 .85-.54 2.11-.82 3.29-.23.98.5 1.79 1.47 1.79 1.76 0 3.02-2.26 3.02-4.95 0-2.04-1.37-3.57-3.87-3.57-2.82 0-4.58 2.11-4.58 4.46 0 .81.24 1.38.61 1.82.17.2.2.29.13.52-.04.17-.15.6-.19.77-.06.24-.25.33-.46.24-1.29-.53-1.89-1.94-1.89-3.53 0-2.62 2.21-5.77 6.6-5.77 3.52 0 5.84 2.55 5.84 5.29 0 3.62-1.99 6.33-4.93 6.33-.99 0-1.91-.54-2.23-1.15l-.63 2.44c-.19.72-.7 1.63-1.06 2.19.79.24 1.62.37 2.49.37 5.3 0 9.6-4.3 9.6-9.6 0-5.3-4.3-9.6-9.6-9.6Z',
  },
]

export function Footer() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    // Visual-only demo: no real submission takes place.
    setSubscribed(true)
    setEmail('')
  }

  return (
    <footer className="mt-24 border-t border-charcoal/10 bg-charcoal text-cream-100">
      <div className="container-page grid grid-cols-1 gap-12 py-16 sm:grid-cols-2 lg:grid-cols-5">
        <div>
          <Logo light />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-cream-100/70">
            Sumer Jewelry, zamansız zarafeti günlük kullanım için tasarlanmış takılarla
            buluşturur. Her parça, ustalıkla seçilmiş malzemeler ve özenli işçilikle
            hazırlanır.
          </p>
          <div className="mt-6 flex items-center gap-3">
            {socialIcons.map((icon) => (
              <a
                key={icon.label}
                href="#"
                aria-label={icon.label}
                onClick={(e) => e.preventDefault()}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-cream-100/20 text-cream-100/80 transition-colors hover:border-gold-400 hover:text-gold-400"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                  <path d={icon.path} />
                </svg>
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-widest2 text-gold-400">
            Mağaza
          </h4>
          <ul className="space-y-3 text-sm text-cream-100/70">
            <li>
              <Link to="/urunler" className="transition-colors hover:text-cream-50">
                Tüm Ürünler
              </Link>
            </li>
            <li>
              <Link
                to="/urunler?category=yuzukler"
                className="transition-colors hover:text-cream-50"
              >
                Yüzükler
              </Link>
            </li>
            <li>
              <Link
                to="/urunler?category=kolyeler"
                className="transition-colors hover:text-cream-50"
              >
                Kolyeler
              </Link>
            </li>
            <li>
              <Link
                to="/urunler?category=kupeler"
                className="transition-colors hover:text-cream-50"
              >
                Küpeler
              </Link>
            </li>
            <li>
              <Link
                to="/urunler?category=bileklikler"
                className="transition-colors hover:text-cream-50"
              >
                Bileklikler
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-widest2 text-gold-400">
            Kurumsal
          </h4>
          <ul className="space-y-3 text-sm text-cream-100/70">
            <li>
              <Link to="/hesabim" className="transition-colors hover:text-cream-50">
                Hesabım
              </Link>
            </li>
            <li>
              <Link to="/sepet" className="transition-colors hover:text-cream-50">
                Sepetim
              </Link>
            </li>
            <li>
              <span className="cursor-default">Kargo &amp; İade</span>
            </li>
            <li>
              <span className="cursor-default">Gizlilik Politikası</span>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-widest2 text-gold-400">
            Bize Ulaşın
          </h4>
          <ul className="space-y-3 text-sm text-cream-100/70">
            <li>Mevlüt Can Erdem</li>
            <li>
              <a
                href="tel:+905558971293"
                className="transition-colors hover:text-cream-50"
              >
                0555 897 12 93
              </a>
            </li>
            <li>
              <a
                href="mailto:mevlutcanerdem34@gmail.com"
                className="break-all transition-colors hover:text-cream-50"
              >
                mevlutcanerdem34@gmail.com
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-widest2 text-gold-400">
            Bültenimize Katılın
          </h4>
          <p className="mb-4 text-sm text-cream-100/70">
            Yeni koleksiyonlardan ve özel fırsatlardan ilk siz haberdar olun.
          </p>
          {subscribed ? (
            <p className="text-sm text-gold-400">Teşekkürler! Kaydınız alındı (demo).</p>
          ) : (
            <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="E-posta adresiniz"
                className="w-full rounded-sm border border-cream-100/20 bg-charcoal-light px-3 py-2.5 text-sm text-cream-50 placeholder:text-cream-100/40 focus:border-gold-400 focus:outline-none"
              />
              <button type="submit" className="btn-gold shrink-0 px-4">
                Katıl
              </button>
            </form>
          )}
        </div>
      </div>

      <div className="border-t border-cream-100/10 py-6">
        <div className="container-page flex flex-col items-center justify-between gap-3 text-xs text-cream-100/50 sm:flex-row">
          <p>&copy; {new Date().getFullYear()} Sumer Jewelry. Tüm hakları saklıdır.</p>
          <p>Bu bir demo e-ticaret sitesidir. Gerçek ödeme işlemi yapılmaz.</p>
        </div>
      </div>
    </footer>
  )
}
