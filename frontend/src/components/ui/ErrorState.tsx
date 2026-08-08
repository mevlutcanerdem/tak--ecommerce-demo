interface ErrorStateProps {
  title?: string
  message?: string
  onRetry?: () => void
}

export function ErrorState({
  title = 'Bir şeyler ters gitti',
  message = 'İçerik yüklenirken bir hata oluştu. Lütfen tekrar deneyin.',
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-500">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          className="h-7 w-7"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
          />
        </svg>
      </div>
      <h3 className="mb-2 font-display text-2xl text-charcoal">{title}</h3>
      <p className="mb-6 max-w-md text-sm text-charcoal-soft">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-secondary">
          Tekrar Dene
        </button>
      )}
    </div>
  )
}
