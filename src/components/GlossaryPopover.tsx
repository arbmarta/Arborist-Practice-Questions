'use client';
import { useEffect, useRef, useState } from 'react';
import { GLOSSARY } from '@/lib/glossary';

// One pop-up for the whole site: clicking any .gloss-term keyword shows its definition beside it.
export default function GlossaryPopover() {
  const [open, setOpen] = useState<{ id: string; x: number; y: number; above: boolean } | null>(null);
  const box = useRef<HTMLDivElement>(null);
  const anchor = useRef<HTMLElement | null>(null);

  useEffect(() => {
    function place(el: HTMLElement, id: string) {
      const r = el.getBoundingClientRect();
      const w = Math.min(340, window.innerWidth - 24);
      const x = Math.max(12, Math.min(r.left + r.width / 2 - w / 2, window.innerWidth - w - 12));
      const above = r.bottom + 200 > window.innerHeight && r.top > 220;
      setOpen({ id, x, y: above ? r.top - 10 : r.bottom + 10, above });
    }
    function onClick(e: MouseEvent) {
      const t = (e.target as HTMLElement).closest<HTMLElement>('.gloss-term');
      if (t?.dataset.term && GLOSSARY[t.dataset.term]) {
        e.preventDefault();
        if (anchor.current === t) { anchor.current = null; setOpen(null); return; }
        anchor.current = t; place(t, t.dataset.term); return;
      }
      if (!box.current?.contains(e.target as Node)) { anchor.current = null; setOpen(null); }
    }
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') { anchor.current?.focus(); anchor.current = null; setOpen(null); } }
    function onMove() { anchor.current = null; setOpen(null); }
    document.addEventListener('click', onClick);
    document.addEventListener('keydown', onKey);
    window.addEventListener('scroll', onMove, true); window.addEventListener('resize', onMove);
    return () => { document.removeEventListener('click', onClick); document.removeEventListener('keydown', onKey); window.removeEventListener('scroll', onMove, true); window.removeEventListener('resize', onMove); };
  }, []);

  if (!open) return null;
  const g = GLOSSARY[open.id];
  return <div ref={box} className={'gloss-pop' + (open.above ? ' above' : '')} role="dialog" aria-label={g.term}
    style={{ left: open.x, top: open.y, width: Math.min(340, typeof window !== 'undefined' ? window.innerWidth - 24 : 340) }}>
    <div className="gloss-head"><span className="gloss-label">Key term</span>
      <button className="gloss-close" aria-label="Close definition" onClick={() => { anchor.current = null; setOpen(null); }}>×</button></div>
    <p className="gloss-term-name">{g.term}</p>
    <p>{g.def}</p>
  </div>;
}
