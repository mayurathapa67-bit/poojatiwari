import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <p className="text-7xl font-bold tracking-tight text-ink">404</p>
      <div className="mx-auto my-4 h-1 w-16 rounded-full bg-primary" />
      <h1 className="mb-2 text-xl font-semibold text-ink">Page not found</h1>
      <p className="mb-8 max-w-md text-muted">
        The page you’re looking for doesn’t exist or may have been moved. Try one of
        these instead.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link href="/" className="btn-primary">
          Back to Home
        </Link>
        <Link href="/about" className="btn-ghost">
          About
        </Link>
        <Link href="/projects" className="btn-ghost">
          Projects
        </Link>
        <Link href="/contact" className="btn-ghost">
          Contact
        </Link>
      </div>
    </main>
  );
}
