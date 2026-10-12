// Line icons for module items, in the style of the Canvas module list.
import type { ItemKind } from '@/lib/courses';

const P = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };

export function ItemIcon({ kind }: { kind: ItemKind }) {
  switch (kind) {
    case 'introduction':
    case 'reading': // open book with text lines
      return <svg viewBox="0 0 28 22" className="item-icon" aria-hidden="true" {...P}>
        <path d="M2 3h9a3 3 0 0 1 3 3v14a2.5 2.5 0 0 0-2.5-2.5H2z M26 3h-9a3 3 0 0 0-3 3v14a2.5 2.5 0 0 1 2.5-2.5H26z" />
        <path d="M5 7h5M5 10h5M5 13h5M18 7h5M18 10h5M18 13h5" />
      </svg>;
    case 'video': // film strip with play triangle
      return <svg viewBox="0 0 28 22" className="item-icon" aria-hidden="true" {...P}>
        <rect x="3" y="2" width="22" height="18" rx="1.5" />
        <path d="M7 2v18M21 2v18M3 6h4M3 10h4M3 14h4M21 6h4M21 10h4M21 14h4" />
        <path d="M12 7.5v7l5.5-3.5z" />
      </svg>;
    case 'interactive': // target with arrow
      return <svg viewBox="0 0 28 22" className="item-icon" aria-hidden="true" {...P}>
        <circle cx="11" cy="11" r="8.5" /><circle cx="11" cy="11" r="5.2" /><circle cx="11" cy="11" r="2" />
        <path d="M11 11 26 4M22.5 3.5 26 4l-1.8 3" />
      </svg>;
    case 'quiz': // document with check
      return <svg viewBox="0 0 28 22" className="item-icon" aria-hidden="true" {...P}>
        <path d="M8 1.5h9l5 5v14H8z M17 1.5v5h5" />
        <path d="M11.5 12.5l2.5 2.5 4.5-5" />
      </svg>;
  }
}

export function MenuIcon() {
  return <svg viewBox="0 0 30 20" className="menu-icon" aria-hidden="true" {...P} strokeWidth={2}><path d="M2 3h26M2 10h26M2 17h26" /></svg>;
}

export function Chevron() {
  return <svg viewBox="0 0 12 12" className="chev" aria-hidden="true" {...P} strokeWidth={1.8}><path d="M3 4.5 6 7.5 9 4.5" /></svg>;
}

export function Kebab() {
  return <svg viewBox="0 0 4 16" className="kebab" aria-hidden="true"><circle cx="2" cy="2" r="1.6" fill="currentColor" /><circle cx="2" cy="8" r="1.6" fill="currentColor" /><circle cx="2" cy="14" r="1.6" fill="currentColor" /></svg>;
}
