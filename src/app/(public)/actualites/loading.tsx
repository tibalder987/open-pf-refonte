export default function ActualitesLoading() {
  return (
    <section className="section">
      <div className="container">
        <div className="grid-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="card"
              style={{ height: '260px', background: 'var(--line)', animation: 'pulse 1.5s infinite' }}
              aria-hidden="true"
            />
          ))}
        </div>
      </div>
    </section>
  )
}
