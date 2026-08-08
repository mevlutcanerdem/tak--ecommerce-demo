import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { useRegister } from '@/hooks/useAuth'
import { getApiErrorMessage } from '@/lib/api'
import { isValidEmail } from '@/lib/validation'
import { classNames } from '@/lib/utils'

interface FormValues {
  name: string
  email: string
  password: string
  confirmPassword: string
}

type FormErrors = Partial<Record<keyof FormValues, string>>

const initialValues: FormValues = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
}

export function RegisterPage() {
  const navigate = useNavigate()
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated())
  const registerMutation = useRegister()

  const [values, setValues] = useState<FormValues>(initialValues)
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitError, setSubmitError] = useState<string | null>(null)

  if (isAuthenticated) {
    return <Navigate to="/hesabim" replace />
  }

  const handleChange =
    (field: keyof FormValues) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setValues((prev) => ({ ...prev, [field]: e.target.value }))
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }

  const validate = (): FormErrors => {
    const nextErrors: FormErrors = {}
    if (!values.name.trim()) nextErrors.name = 'Ad soyad zorunludur.'
    else if (values.name.trim().length < 2)
      nextErrors.name = 'Ad soyad en az 2 karakter olmalıdır.'

    if (!values.email.trim()) nextErrors.email = 'E-posta adresi zorunludur.'
    else if (!isValidEmail(values.email))
      nextErrors.email = 'Geçerli bir e-posta adresi girin.'

    if (!values.password) nextErrors.password = 'Şifre zorunludur.'
    else if (values.password.length < 6)
      nextErrors.password = 'Şifre en az 6 karakter olmalıdır.'

    if (values.confirmPassword !== values.password) {
      nextErrors.confirmPassword = 'Şifreler eşleşmiyor.'
    }

    return nextErrors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError(null)

    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    try {
      await registerMutation.mutateAsync({
        name: values.name.trim(),
        email: values.email.trim(),
        password: values.password,
      })
      navigate('/giris', { state: { registered: true } })
    } catch (error) {
      setSubmitError(getApiErrorMessage(error, 'Kayıt sırasında bir hata oluştu.'))
    }
  }

  return (
    <div className="container-page flex min-h-[70vh] items-center justify-center py-16">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <span className="eyebrow">Aramıza Katılın</span>
          <h1 className="mt-3 text-3xl">Kayıt Ol</h1>
          <p className="mt-3 text-sm text-charcoal-soft">
            Yeni bir hesap oluşturarak siparişlerinizi kolayca takip edin.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <div>
            <label htmlFor="name" className="label-field">
              Ad Soyad
            </label>
            <input
              id="name"
              type="text"
              autoComplete="name"
              value={values.name}
              onChange={handleChange('name')}
              className={classNames('input-field', errors.name && 'border-red-400')}
              placeholder="Ayşe Yılmaz"
            />
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="email" className="label-field">
              E-posta
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={values.email}
              onChange={handleChange('email')}
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
              autoComplete="new-password"
              value={values.password}
              onChange={handleChange('password')}
              className={classNames('input-field', errors.password && 'border-red-400')}
              placeholder="En az 6 karakter"
            />
            {errors.password && (
              <p className="mt-1 text-xs text-red-500">{errors.password}</p>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="label-field">
              Şifre (Tekrar)
            </label>
            <input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              value={values.confirmPassword}
              onChange={handleChange('confirmPassword')}
              className={classNames(
                'input-field',
                errors.confirmPassword && 'border-red-400',
              )}
              placeholder="••••••••"
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>
            )}
          </div>

          {submitError && (
            <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {submitError}
            </div>
          )}

          <button
            type="submit"
            disabled={registerMutation.isPending}
            className="btn-primary w-full"
          >
            {registerMutation.isPending ? 'Kayıt Oluşturuluyor...' : 'Kayıt Ol'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-charcoal-soft">
          Zaten hesabınız var mı?{' '}
          <Link to="/giris" className="font-medium text-gold-600 hover:underline">
            Giriş Yapın
          </Link>
        </p>
      </div>
    </div>
  )
}

export default RegisterPage
