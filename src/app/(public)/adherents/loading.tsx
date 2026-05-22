export default function AdherentsLoading() {
  return (
    <section className="section">
      <div className="container">
        <div className="members-grid">
          {Array.from({ length: 9 }).map((_, i) => (
            <div
              key={i}
              className="card"
              style={{ height: '280px', background: 'var(--line)', animation: 'pulse 1.5s infinite' }}
              aria-hidden="true"
            />
          ))}
        </div>
      </div>
    </section>
  )
}
