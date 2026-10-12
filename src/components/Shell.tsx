'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import GlossaryPopover from './GlossaryPopover';

export default function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || '/';
  const [menu, setMenu] = useState(false);
  useEffect(() => setMenu(false), [pathname]);
  const cls = (p: string) => (p === '/' ? pathname === '/' || pathname.startsWith('/courses') : pathname.startsWith(p)) ? 'active' : '';
  return <>
    <header>
      <Link className="brand" href="/">Arborist Study</Link>
      <button className="menu" onClick={() => setMenu(!menu)} aria-label="Toggle navigation" aria-expanded={menu}>☰</button>
      <nav className={menu ? 'open' : ''}>
        <Link href="/" className={cls('/')}>Dashboard</Link>
        <Link href="/practice/" className={cls('/practice')}>Practice Exam</Link>
        <Link href="/about/" className={cls('/about')}>About</Link>
      </nav>
    </header>
    <div className="site-body">{children}</div>
    <GlossaryPopover />
  </>;
}
