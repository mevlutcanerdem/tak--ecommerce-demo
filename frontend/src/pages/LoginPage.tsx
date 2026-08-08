import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { useLogin } from '@/hooks/useAuth'
import { getApiErrorMessage } from '@/lib/api'
import { isValidEmail } from '@/lib/validation'
import { classNames } from '@/lib/utils'

interface FormErrors {
  email?: string
  password?: string
}

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated())
  const loginMutation = useLogin()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitError, setSubmitError] = useState<string | null>(null)

  if (isAuthenticated) {
    const redirectTo = (location.state as { from?: string } | null)?.from ?? '/hesabim'
    return <Navigate to={redirectTo} replace />
  }

  const justRegistered = Boolean(
    (location.state as { registered?: boolean } | null)?.registered,
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError(null)

    const nextErrors: FormErrors = {}
    if (!email.trim()) nextErrors.email = 'E-posta adresi zorunludur.'
    else if (!isValidEmail(email)) nextErrors.email = 'Geçerli bir e-posta adresi girin.'
    if (!password) nextErrors.password = 'Şifre zorunludur.'

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    try {
      await loginMutation.mutateAsync({ email: email.trim(), password })
      navigate('/hesabim')
    } catch (error) {
      setSubmitError(getApiErrorMessage(error, 'E-posta veya şifre hatalı.'))
    }
  }

  return (
    <div className="container-page flex min-h-[70vh] items-center justify-center py-16">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <span className="eyebrow">Hoş Geldiniz</span>
          <h1 className="mt-3 text-3xl">Giriş Yap</h1>
          <p className="mt-3 text-sm text-charcoal-soft">
            Hesabınıza giriş yaparak siparişlerinizi takip edin.
          </p>
        </div>

        {justRegistered && (
          <div className="mb-6 border border-gold-300 bg-gold-50 px-4 py-3 text-sm text-gold-700">
            Kaydınız başarıyla oluşturuldu. Şimdi giriş yapabilirsiniz.
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <div>
            <label htmlFor="email" className="label-field">
              E-posta
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                setErrors((prev) => ({ ...prev, email: undefined }))
              }}
              className={classNames('input-field', errors.email && 'border-red-400')}
              placeholder="ornek@eposta.com"
            />
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="password" className="label-field">
              Şifre
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setErrors((prev) => ({ ...prev, password: undefined }))
              }}
              className={classNames('input-field', errors.password && 'border-red-400')}
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="mt-1 text-xs text-red-500">{errors.password}</p>
            )}
          </div>

          {submitError && (
            <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {submitError}
            </div>
          )}

          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="btn-primary w-full"
          >
            {loginMutation.isPending ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-charcoal-soft">
          Hesabınız yok mu?{' '}
          <Link to="/kayit" className="font-medium text-gold-600 hover:underline">
            Kayıt Olun
          </Link>
        </p>
      </div>
    </div>
  )
}

export default LoginPage
