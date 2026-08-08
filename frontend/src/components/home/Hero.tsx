import { Link } from 'react-router-dom'

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-charcoal">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1800&q=80"
          alt="Zarif altın takı koleksiyonu"
          className="h-full w-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/60 to-charcoal/30" />
      </div>

      <div className="container-page relative flex min-h-[78vh] flex-col items-start justify-center py-24 text-cream-50">
        <span className="eyebrow mb-6 text-gold-400 animate-fade-in">
          2026 Koleksiyonu
        </span>
        <h1 className="max-w-2xl font-display text-4xl leading-[1.1] sm:text-5xl lg:text-6xl animate-fade-in-up">
          Zamanı aşan zarafet, <br className="hidden sm:block" /> her ana özel dokunuş
        </h1>
        <p
          className="mt-6 max-w-lg text-base leading-relaxed text-cream-100/80 animate-fade-in-up"
          style={{ animationDelay: '0.1s' }}
        >
          El işçiliğiyle şekillendirilen yüzük, kolye, küpe ve bileklik
          koleksiyonlarımızla tanışın. Her parça, günlük şıklığınıza kalıcı bir değer
          katmak için tasarlandı.
        </p>
        <div
          className="mt-10 flex flex-wrap items-center gap-4 animate-fade-in-up"
          style={{ animationDelay: '0.2s' }}
        >
          <Link to="/urunler" className="btn-gold">
            Koleksiyonu Keşfet
          </Link>
          <Link
            to="/urunler?category=yuzukler"
            className="btn border border-cream-50/30 text-cream-50 hover:border-gold-400 hover:text-gold-400"
          >
            Yüzükleri İncele
          </Link>
        </div>
      </div>
    </section>
  )
}
