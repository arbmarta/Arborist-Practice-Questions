'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { domains } from '@/lib/navigation';

// Sidebar sections collapse into dropdowns; the section containing the current page opens automatically.
export default function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || '/';
  const current = domains.find(d => pathname.startsWith(`/${d.slug}/`))?.slug;
  const [open, setOpen] = useState<Record<string, boolean>>(current ? { [current]: true } : {});
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    setMenu(false);
    if (current) setOpen({ [current]: true }); // moving to a page opens its section and tidies the rest
  }, [pathname, current]);

  const norm = (p: string) => p.replace(/\/$/, '');
  return <>
    <header>
      <Link className="brand" href="/">Arborist Study</Link>
      <button className="menu" onClick={() => setMenu(!menu)} aria-label="Toggle navigation" aria-expanded={menu}>☰</button>
      <nav className={menu ? 'open' : ''}><Link href="/practice/">Practice</Link><Link href="/about/">About</Link></nav>
    </header>
    <div className="app">
      <aside className={menu ? 'open' : ''}>
        {domains.map(d => {
          const isOpen = !!open[d.slug];
          return <section key={d.slug} className={'nav-group' + (isOpen ? ' expanded' : '') + (current === d.slug ? ' current' : '')}>
            <button className="nav-toggle" aria-expanded={isOpen} onClick={() => setOpen(o => ({ ...o, [d.slug]: !o[d.slug] }))}>
              <span>{d.name}</span><svg viewBox="0 0 12 12" aria-hidden="true"><path d="M3 4.5 6 7.5 9 4.5" /></svg>
            </button>
            {isOpen && <div className="nav-links">{d.lessons.map(l => {
              const href = `/${d.slug}/${l.slug}/`;
              const active = norm(pathname) === norm(href);
              return <Link key={l.slug} href={href} className={active ? 'active' : ''} aria-current={active ? 'page' : undefined}>{l.title}</Link>;
            })}</div>}
          </section>;
        })}
      </aside>
      <div className="content">{children}</div>
    </div>
  </>;
}
