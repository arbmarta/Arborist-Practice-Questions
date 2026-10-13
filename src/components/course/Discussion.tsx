'use client';
import { useEffect, useRef } from 'react';

// Giscus settings. Fill in repoId and categoryId from https://giscus.app once Discussions is enabled on the repo
// and the giscus app is installed. Threads are linked to a fixed name (`term`), not the page URL, so they
// survive a change of domain or URL structure when the site moves hosts.
export const GISCUS = {
  repo: 'arbmarta/Arborist-Practice-Questions',
  repoId: 'R_kgDOVGHxpQ',
  category: 'General',
  categoryId: 'DIC_kwDOVGHxpc4DISKs',
};
export const giscusReady = () => !!(GISCUS.repoId && GISCUS.categoryId);

export default function Discussion({ term }: { term: string }) {
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = box.current;
    if (!el || !giscusReady()) return;
    el.innerHTML = '';
    const s = document.createElement('script');
    s.src = 'https://giscus.app/client.js';
    s.async = true;
    s.crossOrigin = 'anonymous';
    const attrs: Record<string, string> = {
      'data-repo': GISCUS.repo, 'data-repo-id': GISCUS.repoId,
      'data-category': GISCUS.category, 'data-category-id': GISCUS.categoryId,
      'data-mapping': 'specific', 'data-term': term, 'data-strict': '1',
      'data-reactions-enabled': '1', 'data-emit-metadata': '0', 'data-input-position': 'bottom',
      'data-theme': 'light', 'data-lang': 'en', 'data-loading': 'lazy',
    };
    for (const [k, v] of Object.entries(attrs)) s.setAttribute(k, v);
    el.appendChild(s);
    return () => { el.innerHTML = ''; };
  }, [term]);

  if (!giscusReady()) return <div className="placeholder">
    <p><b>Discussions are being set up.</b></p>
    <p>This board will open once the course discussion service is connected. Check back soon!</p>
  </div>;
  return <div ref={box} className="giscus-box" />;
}
