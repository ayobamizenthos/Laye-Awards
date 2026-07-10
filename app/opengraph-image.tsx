import { ImageResponse } from 'next/og'
import { siteConfig } from '@/config/site'

export const runtime = 'edge'
export const alt = `${siteConfig.name}, ${siteConfig.fullName}`
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(140deg, #0E0B09 0%, #181210 38%, #2A1A1C 74%, #3B2418 100%)',
        color: '#F4ECDA',
        padding: '96px',
        fontFamily: 'serif',
        position: 'relative',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '70%',
          background:
            'radial-gradient(ellipse 60% 70% at 50% 0%, rgba(201,168,76,0.28), transparent 70%)',
          display: 'flex',
        }}
      />
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 24,
          fontSize: 22,
          letterSpacing: '0.32em',
          textTransform: 'uppercase',
          color: '#C9A84C',
          fontFamily: 'sans-serif',
          fontWeight: 600,
        }}
      >
        <div style={{ width: 48, height: 1, background: '#C9A84C' }} />
        {siteConfig.edition.city}
        <div style={{ width: 48, height: 1, background: '#C9A84C' }} />
      </div>
      <div
        style={{
          marginTop: 48,
          fontSize: 96,
          lineHeight: 1.05,
          textAlign: 'center',
          fontWeight: 500,
          maxWidth: 980,
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        <span>Celebrating the&nbsp;</span>
        <span style={{ color: '#D4B560', fontStyle: 'italic' }}>excellence</span>
        <span>&nbsp;of young Lagos</span>
      </div>
      <div
        style={{
          marginTop: 56,
          fontSize: 28,
          color: '#9C9286',
          fontFamily: 'sans-serif',
          display: 'flex',
          alignItems: 'center',
          gap: 18,
        }}
      >
        <span style={{ color: '#F4ECDA', fontWeight: 600, letterSpacing: '0.18em' }}>
          {siteConfig.name}
        </span>
        <span
          style={{ width: 6, height: 6, background: '#C9A84C', borderRadius: 999, display: 'flex' }}
        />
        <span>{siteConfig.domain}</span>
      </div>
    </div>,
    { ...size }
  )
}
