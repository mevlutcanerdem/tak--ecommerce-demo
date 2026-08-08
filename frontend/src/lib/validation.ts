// Lightweight client-side validation helpers. These exist purely to catch
// obvious mistakes and improve UX before a request is sent — the backend is
// the real source of truth for validation and must not be trusted to have
// been bypassed here.

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
// Accepts Turkish mobile/landline numbers with optional +90/0 prefix and
// common separators, e.g. "0532 123 45 67", "+90 212 123 45 67".
const PHONE_REGEX = /^(\+?90|0)?[\s-]?\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{2}[\s-]?\d{2}$/

export function isValidEmail(value: string): boolean {
  return EMAIL_REGEX.test(value.trim())
}

export function isValidPhone(value: string): boolean {
  return PHONE_REGEX.test(value.trim())
}

export function isNonEmpty(value: string): boolean {
  return value.trim().length > 0
}

export interface ShippingFormValues {
  fullName: string
  phone: string
  address: string
  city: string
  postalCode: string
  email: string
}

export type ShippingFormErrors = Partial<Record<keyof ShippingFormValues, string>>

export function validateShippingForm(values: ShippingFormValues): ShippingFormErrors {
  const errors: ShippingFormErrors = {}

  if (!isNonEmpty(values.fullName)) {
    errors.fullName = 'Ad soyad zorunludur.'
  } else if (values.fullName.trim().length < 3) {
    errors.fullName = 'Ad soyad en az 3 karakter olmalıdır.'
  }

  if (!isNonEmpty(values.phone)) {
    errors.phone = 'Telefon numarası zorunludur.'
  } else if (!isValidPhone(values.phone)) {
    errors.phone = 'Geçerli bir telefon numarası girin (örn. 0532 123 45 67).'
  }

  if (!isNonEmpty(values.address)) {
    errors.address = 'Adres zorunludur.'
  } else if (values.address.trim().length < 10) {
    errors.address = 'Lütfen daha ayrıntılı bir adres girin.'
  }

  if (!isNonEmpty(values.city)) {
    errors.city = 'Şehir zorunludur.'
  }

  if (!isNonEmpty(values.postalCode)) {
    errors.postalCode = 'Posta kodu zorunludur.'
  } else if (!/^\d{4,6}$/.test(values.postalCode.trim())) {
    errors.postalCode = 'Posta kodu 4-6 haneli bir sayı olmalıdır.'
  }

  if (!isNonEmpty(values.email)) {
    errors.email = 'E-posta adresi zorunludur.'
  } else if (!isValidEmail(values.email)) {
    errors.email = 'Geçerli bir e-posta adresi girin.'
  }

  return errors
}
