import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Page Not Found',
  description: 'The page you are looking for does not exist. Browse EduCampusHub to find books, notes, and study materials.',
}

export default function NotFound() {
  return (
    <div style={{
      minHeight: '60vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
      textAlign: 'center',
    }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.75rem', color: '#002868' }}>Page Not Found</h1>
      <p style={{ color: '#64748B', marginBottom: '2rem', maxWidth: '28rem' }}>
        Sorry, the page you are looking for doesn&apos;t exist or has been moved.
        Browse our marketplace to find books, notes, and study materials.
      </p>
      <a
        href="/"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '2.75rem',
          padding: '0 1.5rem',
          borderRadius: '0.75rem',
          background: 'linear-gradient(to right, #002868, #FF6600)',
          color: 'white',
          fontWeight: 600,
          textDecoration: 'none',
        }}
      >
        Go Home
      </a>
    </div>
  )
}
