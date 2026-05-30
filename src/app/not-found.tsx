import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Page Not Found',
  description: 'The page you are looking for does not exist. Browse EduCampusHub to find books, notes, and study materials.',
}

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="w-20 h-20 rounded-full bg-brand/10 flex items-center justify-center mb-6">
        <span className="text-4xl">📚</span>
      </div>
      <h1 className="text-3xl font-bold text-foreground mb-3 font-heading">Page Not Found</h1>
      <p className="text-muted-foreground mb-8 max-w-md">
        Sorry, the page you are looking for doesn&apos;t exist or has been moved.
        Browse our marketplace to find books, notes, and study materials.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <a
          href="/"
          className="inline-flex items-center justify-center h-11 px-6 rounded-xl bg-gradient-to-r from-brand to-accent text-white font-semibold hover:opacity-90 transition-opacity"
        >
          Go Home
        </a>
        <a
          href="/explore"
          className="inline-flex items-center justify-center h-11 px-6 rounded-xl border-2 border-brand/30 text-brand font-semibold hover:bg-brand/5 transition-colors"
        >
          Browse Books
        </a>
      </div>
    </div>
  )
}
