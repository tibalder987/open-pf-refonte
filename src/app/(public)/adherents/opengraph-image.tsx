import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Annuaire des adhérents OPEN PF'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'flex-end',
          background: 'linear-gradient(135deg, #0f1c2e 0%, #1a3a5c 60%, #0077b6 100%)',
          padding: '64px',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '32px',
          }}
        >
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '12px',
              background: '#0077b6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '16px',
              fontSize: '24px',
              fontWeight: 700,
              color: '#fff',
            }}
          >
            O
          </div>
          <span
            style={{
              fontSize: '28px',
              fontWeight: 700,
              color: '#ffffff',
              letterSpacing: '-0.5px',
            }}
          >
            OPEN PF
          </span>
        </div>
        <div
          style={{
            fontSize: '52px',
            fontWeight: 800,
            color: '#ffffff',
            lineHeight: 1.1,
            marginBottom: '20px',
            maxWidth: '900px',
          }}
        >
          Annuaire des adhérents
        </div>
        <div
          style={{
            fontSize: '22px',
            color: 'rgba(255,255,255,0.75)',
            maxWidth: '760px',
            lineHeight: 1.5,
          }}
        >
          Découvrez les entreprises du numérique de Polynésie française réunies au sein d'OPEN PF.
        </div>
      </div>
    ),
    { ...size },
  )
}
