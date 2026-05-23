interface MemberSearchProps {
  q?: string | undefined
  domaine?: string | undefined
}

export function MemberSearch({ q, domaine }: MemberSearchProps) {
  return (
    <form
      className="search-box directory-search-form"
      role="search"
      aria-label="Recherche dans l'annuaire"
      action="/adherents"
      method="GET"
    >
      {domaine && <input type="hidden" name="domaine" value={domaine} />}
      <label className="sr-only" htmlFor="search-member">
        Rechercher une entreprise
      </label>
      <input
        id="search-member"
        name="q"
        type="search"
        placeholder="Rechercher une entreprise, un mot-clé…"
        defaultValue={q ?? ''}
        aria-label="Rechercher une entreprise"
      />
      <button className="btn" type="submit">
        Rechercher{' '}
        <svg className="icon" aria-hidden="true" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="m21 19.6-5.2-5.2a7 7 0 1 0-1.4 1.4l5.2 5.2 1.4-1.4zM5 10.5a5.5 5.5 0 1 1 11 0 5.5 5.5 0 0 1-11 0z"
          />
        </svg>
      </button>
    </form>
  )
}
