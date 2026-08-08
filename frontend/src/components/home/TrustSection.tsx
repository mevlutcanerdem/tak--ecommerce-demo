const features = [
  {
    title: 'Üstün Malzeme Kalitesi',
    description:
      '18 ayar altın kaplama, 925 ayar gümüş ve özenle seçilmiş taşlarla, cildinizde iz bırakmayan dayanıklı üretim.',
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3 4 12l8 9 8-9-8-9Zm0 0v18M4 12h16"
      />
    ),
  },
  {
    title: 'Usta İşçiliği',
    description:
      'Her parça, yılların verdiği tecrübeyle çalışan kuyumcu ustalarımızın elinden özenle geçer.',
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.34-5.111 4.213c-.474.39-.921.826-1.335 1.294l-.174.194a3.75 3.75 0 0 0-.844 2.376V19.5a2.25 2.25 0 0 0 2.25 2.25h.008"
      />
    ),
  },
  {
    title: 'Güvenli ve Hızlı Kargo',
    description:
      'Siparişleriniz özel korumalı ambalajlarla, 2-4 iş günü içinde adresinize kadar ulaştırılır.',
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.25h5.909c.472 0 .897.3 1.05.748l1.36 3.968a2.106 2.106 0 0 1-.02.94M14.25 7.5V18.75m0-11.25H3.75a1.5 1.5 0 0 0-1.5 1.5v8.25a1.5 1.5 0 0 0 1.5 1.5h1.5"
      />
    ),
  },
  {
    title: 'Kolay İade & Değişim',
    description:
      'Beğenmediğiniz ürünleri, teslim tarihinden itibaren 14 gün içinde kolayca iade edebilirsiniz.',
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
      />
    ),
  },
]

export function TrustSection() {
  return (
    <section className="container-page py-20">
      <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((feature) => (
          <div key={feature.title} className="flex flex-col items-start gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gold-50 text-gold-600">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.3}
                className="h-7 w-7"
              >
                {feature.icon}
              </svg>
            </div>
            <h3 className="font-display text-lg text-charcoal">{feature.title}</h3>
            <p className="text-sm leading-relaxed text-charcoal-soft">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
