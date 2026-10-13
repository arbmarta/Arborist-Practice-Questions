'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { findCourse, itemHref, itemTitle, moduleItems } from '@/lib/courses';
import { useStudent } from '@/lib/store';
import { Chevron, ItemIcon, MenuIcon } from './Icons';

const norm = (p: string) => p.replace(/\/?$/, '/');

export default function CourseShell({ courseSlug, children }: { courseSlug: string; children: React.ReactNode }) {
  const course = findCourse(courseSlug)!;
  const pathname = norm(usePathname() || '/');
  const s = useStudent();
  const visited = new Set(s?.visited[course.slug] ?? []);
  const currentModule = course.modules.find(m => pathname.startsWith(`/courses/${course.slug}/${m.slug}/`))?.slug;

  const [open, setOpen] = useState<Record<string, boolean>>(() => ({ shortcuts: true, ...(currentModule ? { [currentModule]: true } : {}) }));
  const [navOpen, setNavOpen] = useState(true);       // desktop: panel shown/hidden
  const [mobileOpen, setMobileOpen] = useState(false); // phones: panel drawer
  useEffect(() => { setMobileOpen(false); if (currentModule) setOpen(o => ({ ...o, [currentModule]: true })); }, [pathname, currentModule]);

  const toggle = (k: string) => setOpen(o => ({ ...o, [k]: !o[k] }));
  function menuClick() {
    if (window.matchMedia('(max-width: 850px)').matches) setMobileOpen(v => !v); else setNavOpen(v => !v);
  }
  const link = (href: string, label: React.ReactNode, cls = '') => {
    const active = pathname === norm(href);
    return <Link href={href} className={cls + (active ? ' active' : '')} aria-current={active ? 'page' : undefined}>{label}</Link>;
  };

  return (
    <div className={'course-shell' + (navOpen ? '' : ' nav-collapsed') + (mobileOpen ? ' nav-mobile-open' : '')}>
      <aside className="course-nav" aria-label={`${course.title} navigation`}>
        <button className="course-menu" onClick={menuClick} aria-label="Toggle course menu" aria-expanded={navOpen}>
          <MenuIcon /><span>menu</span>
        </button>
        <div className="course-nav-body">
          <section className={'cn-group' + (open.shortcuts ? ' expanded' : '')}>
            <button className="cn-toggle" aria-expanded={!!open.shortcuts} onClick={() => toggle('shortcuts')}><Chevron /><span>Course Shortcuts</span></button>
            {open.shortcuts && <div className="cn-links shortcuts">
              {link(`/courses/${course.slug}/`, 'Home')}
              {link(`/courses/${course.slug}/discussions/`, 'Discussions')}
              {link(`/courses/${course.slug}/grades/`, 'Grades')}
            </div>}
          </section>

          {course.modules.map((m, i) => {
            const isOpen = !!open[m.slug];
            return <section key={m.slug} className={'cn-group' + (isOpen ? ' expanded' : '')}>
              <button className="cn-toggle" aria-expanded={isOpen} onClick={() => toggle(m.slug)}>
                <Chevron /><span>{m.items?.length === 1 ? m.title : `Module ${i + 1}: ${m.title}`}</span>
              </button>
              {isOpen && <ul className="cn-items">{moduleItems(m).map(k => {
                const href = itemHref(course, m, k);
                const active = pathname === href;
                return <li key={k} className={active ? 'active' : ''}>
                  <ItemIcon kind={k} />
                  <Link href={href} aria-current={active ? 'page' : undefined}>{itemTitle(course, m, k)}</Link>
                  {visited.has(href) && <span className="cn-done" title="Viewed" aria-label="Viewed">✓</span>}
                </li>;
              })}</ul>}
            </section>;
          })}

          <section className={'cn-group' + (open.resources ? ' expanded' : '')}>
            <button className="cn-toggle" aria-expanded={!!open.resources} onClick={() => toggle('resources')}><Chevron /><span>Course Resources</span></button>
            {open.resources && <div className="cn-links">
              {link(`/courses/${course.slug}/resources/`, 'Resources')}
              {link('/practice/', 'Mixed practice exam')}
            </div>}
          </section>
        </div>
      </aside>
      <div className="course-main">
        <button className="course-menu course-menu-inline" onClick={menuClick} aria-label="Toggle course menu"><MenuIcon /><span>menu</span></button>
        {children}
      </div>
    </div>
  );
}
