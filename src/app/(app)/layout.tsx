import Link from 'next/link';
import { requireSalon } from '@/auth';

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const ctx = await requireSalon();

  const nav = [
    { href: '/dashboard', label: 'Today' },
    { href: '/calendar', label: 'Calendar' },
    { href: '/clients', label: 'Clients' },
    ...(ctx.role === 'owner' ? [{ href: '/settings', label: 'Settings' }] : []),
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <nav className="mx-auto flex max-w-6xl items-center gap-6 px-4 py-3">
          <span className="font-semibold">Qevy</span>
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm text-neutral-600 hover:text-neutral-900">
              {item.label}
            </Link>
          ))}
        </nav>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">{children}</main>
    </div>
  );
}
