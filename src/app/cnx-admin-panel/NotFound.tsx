export default function NotFoundPage() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      background: '#ffffff',
      color: '#333333',
    }}>
      <h1 style={{ fontSize: '6rem', fontWeight: 700, margin: 0, color: '#999' }}>404</h1>
      <p style={{ fontSize: '1.125rem', color: '#666', marginTop: '0.5rem' }}>
        This page could not be found.
      </p>
    </div>
  )
}
