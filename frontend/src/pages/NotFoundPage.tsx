import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <div className="container-page flex min-h-[70vh] flex-col items-center justify-center py-20 text-center">
      <span className="font-display text-8xl text-gold-300">404</span>
      <h1 className="mt-6 text-3xl">Sayfa Bulunamadı</h1>
      <p className="mt-4 max-w-md text-sm text-charcoal-soft">
        Aradığınız sayfa taşınmış, kaldırılmış ya da hiç var olmamış olabilir. Ana sayfaya
        dönerek koleksiyonumuzu keşfedebilirsiniz.
      </p>
      <Link to="/" className="btn-primary mt-8">
        Anasayfaya Dön
      </Link>
    </div>
  )
}

export default NotFoundPage
