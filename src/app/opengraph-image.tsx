import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'EduCampusHub — Buy • Sell • Exchange'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#002868',
          padding: '40px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '20px',
              background: 'linear-gradient(135deg, #FF6600, #002868)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '20px',
            }}
          >
            <span style={{ fontSize: '40px', color: 'white' }}>📚</span>
          </div>
          <span style={{ fontSize: '64px', fontWeight: 800, color: 'white', fontFamily: 'sans-serif' }}>
            EduCampusHub
          </span>
        </div>
        <span style={{ fontSize: '32px', color: '#FF6600', fontWeight: 600, fontFamily: 'sans-serif' }}>
          Buy • Sell • Exchange
        </span>
        <span style={{ fontSize: '20px', color: 'rgba(255,255,255,0.7)', marginTop: '16px', fontFamily: 'sans-serif' }}>
          India's Trusted Student Marketplace for Books & Study Materials
        </span>
      </div>
    ),
    { ...size }
  )
}
