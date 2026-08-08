import { useEffect, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Logo } from './Logo'
import { useCategories } from '@/hooks/useCategories'
import { useCartStore } from '@/store/cartStore'
import { useAuthStore } from '@/store/authStore'
import { classNames } from '@/lib/utils'

export function Header() {
  const navigate = useNavigate()
  const { data: categories } = useCategories()
  const totalItems = useCartStore((state) => state.totalItems())
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated())

  const [isScrolled, setIsScrolled] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 12)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = searchTerm.trim()
    navigate(trimmed ? `/urunler?search=${encodeURIComponent(trimmed)}` : '/urunler')
    setIsSearchOpen(false)
    setSearchTerm('')
  }

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    classNames(
      'link-underline text-sm font-medium tracking-wide transition-colors',
      isActive ? 'text-gold-600' : 'text-charcoal hover:text-gold-600',
    )

  return (
    <header
      className={classNames(
        'sticky top-0 z-40 w-full border-b transition-all duration-300',
        isScrolled
          ? 'border-charcoal/10 bg-cream-50/95 shadow-soft backdrop-blur'
          : 'border-transparent bg-cream-50',
      )}
    >
      <div className="bg-charcoal py-2 text-center text-[11px] tracking-widest2 text-cream-100">
        TÜM SİPARİŞLERDE ÜCRETSİZ KARGO &middot; DEMO MAĞAZA
      </div>

      <div className="container-page flex h-20 items-center justify-between gap-4">
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center text-charcoal lg:hidden"
          aria-label="Menüyü aç"
          onClick={() => setIsMenuOpen((v) => !v)}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
        </button>

        <Logo />

        <nav className="hidden items-center gap-8 lg:flex">
          <NavLink to="/" end className={navLinkClass}>
            Anasayfa
          </NavLink>
          <NavLink to="/urunler" className={navLinkClass}>
            Ürünler
          </NavLink>
          {categories?.map((category) => (
            <NavLink
              key={category.id}
              to={`/urunler?category=${category.slug}`}
              className={navLinkClass}
            >
              {category.name}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <button
            type="button"
            aria-label="Ara"
            onClick={() => setIsSearchOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center text-charcoal transition-colors hover:text-gold-600"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
          </button>

          <Link
            to={isAuthenticated ? '/hesabim' : '/giris'}
            aria-label="Hesabım"
            className="flex h-10 w-10 items-center justify-center text-charcoal transition-colors hover:text-gold-600"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.964 0a9 9 0 1 0-11.964 0m11.964 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              />
            </svg>
          </Link>

          <Link
            to="/sepet"
            aria-label="Sepetim"
            className="relative flex h-10 w-10 items-center justify-center text-charcoal transition-colors hover:text-gold-600"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 1.876-4.99 2.13-7.5H5.25M7.5 14.25 5.106 5.272M6.75 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
              />
            </svg>
            {totalItems > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-gold-500 px-1 text-[10px] font-semibold text-white">
                {totalItems}
              </span>
            )}
          </Link>
        </div>
      </div>

      {isSearchOpen && (
        <div className="border-t border-charcoal/10 bg-cream-50 py-4 animate-fade-in">
          <form
            onSubmit={handleSearchSubmit}
            className="container-page flex items-center gap-3"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              className="h-5 w-5 shrink-0 text-charcoal-soft"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
            <input
              type="text"
              autoFocus
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Ürün, kategori veya materyal ara..."
              className="w-full border-b border-charcoal/20 bg-transparent py-2 text-sm text-charcoal outline-none placeholder:text-charcoal-soft/60 focus:border-gold-500"
            />
            <button type="submit" className="btn-primary shrink-0">
              Ara
            </button>
          </form>
        </div>
      )}

      {isMenuOpen && (
        <nav className="border-t border-charcoal/10 bg-cream-50 py-4 lg:hidden animate-fade-in">
          <div className="container-page flex flex-col gap-4">
            <NavLink
              to="/"
              end
              className={navLinkClass}
              onClick={() => setIsMenuOpen(false)}
            >
              Anasayfa
            </NavLink>
            <NavLink
              to="/urunler"
              className={navLinkClass}
              onClick={() => setIsMenuOpen(false)}
            >
              Ürünler
            </NavLink>
            {categories?.map((category) => (
              <NavLink
                key={category.id}
                to={`/urunler?category=${category.slug}`}
                className={navLinkClass}
                onClick={() => setIsMenuOpen(false)}
              >
                {category.name}
              </NavLink>
            ))}
          </div>
        </nav>
      )}
    </header>
  )
}
