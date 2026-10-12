'use client';
import { useState } from 'react';

type Wall = 'Wall 1' | 'Wall 2' | 'Wall 3' | 'Wall 4';
const WALLS: Wall[] = ['Wall 1', 'Wall 2', 'Wall 3', 'Wall 4'];
const INFO: Record<Wall, string> = {
  'Wall 1': 'Resists vertical spread: vessels above and below the wound are plugged. It is the weakest wall, so decay columns are often long.',
  'Wall 2': 'Resists inward spread toward the pith, formed along the growth rings.',
  'Wall 3': 'Resists lateral (sideways) spread around the stem, formed by the rays.',
  'Wall 4': 'The barrier zone: formed by the cambium after injury. It separates the new wood from the injured or decayed wood and is the strongest wall.',
};
// Zones on the diagram and the wall each one shows.
const ZONES: { id: string; wall: Wall; x: number; y: number; tx: number; ty: number }[] = [
  { id: 'A', wall: 'Wall 3', x: 604, y: 36, tx: 546, ty: 134 },
  { id: 'B', wall: 'Wall 1', x: 34, y: 40, tx: 160, ty: 67 },
  { id: 'C', wall: 'Wall 2', x: 410, y: 165, tx: 514, ty: 165 },
  { id: 'D', wall: 'Wall 4', x: 268, y: 108, tx: 204, ty: 108 },
];

export default function CoditWalls() {
  const [sel, setSel] = useState<Wall | null>(null);
  const [placed, setPlaced] = useState<Record<string, Wall | undefined>>({});
  const [checked, setChecked] = useState(false);
  const used = new Set(Object.values(placed));
  function place(zone: string, wall: Wall | null) {
    if (!wall || checked) return;
    setPlaced(p => { const n: Record<string, Wall | undefined> = {}; for (const k in p) if (p[k] !== wall) n[k] = p[k]; n[zone] = wall; return n; });
    setSel(null);
  }
  function clear(zone: string) { if (checked) return; setPlaced(p => ({ ...p, [zone]: undefined })); }
  const correct = ZONES.filter(z => placed[z.id] === z.wall).length;
  const state = (z: typeof ZONES[number]) => checked ? (placed[z.id] === z.wall ? 'ok' : 'no') : placed[z.id] ? 'filled' : '';

  // Cross-section geometry
  const cx = 470, cy = 165, rad = (d: number) => d * Math.PI / 180;
  const P = (r: number, a: number) => `${(cx + r * Math.cos(rad(a))).toFixed(1)},${(cy + r * Math.sin(rad(a))).toFixed(1)}`;
  const arc = (r: number, a0: number, a1: number) => `M${P(r, a0)} A${r},${r} 0 0 1 ${P(r, a1)}`;

  return (
    <section className="act" aria-labelledby="codit-h">
      <div className="act-head"><h2 id="codit-h">Label the CODIT walls</h2></div>
      <p className="act-note">The left drawing is a lengthwise cut through a wounded stem; the right is a cross-section. Tap a wall, then tap the lettered marker it belongs to. Dragging works too.</p>
      <div className="bank">{WALLS.map(w => (
        <button key={w} draggable={!checked} onDragStart={e => e.dataTransfer.setData('text/plain', w)}
          className={'chip' + (sel === w ? ' on' : '') + (used.has(w) ? ' used' : '')} onClick={() => setSel(sel === w ? null : w)}>{w}</button>
      ))}</div>

      <svg viewBox="0 0 640 330" className="act-svg codit-svg" role="img" aria-label="Lengthwise section and cross-section of a wounded stem with four lettered markers">
        <rect width="640" height="330" rx="12" fill="#f7f9f6" />
        {/* lengthwise section */}
        <text x="130" y="322" textAnchor="middle" className="svg-note">lengthwise section</text>
        <rect x="60" y="20" width="150" height="290" fill="#e8d3ac" />
        <rect x="60" y="20" width="10" height="290" fill="#6f523a" />
        <rect x="200" y="20" width="10" height="120" fill="#6f523a" /><rect x="200" y="190" width="10" height="120" fill="#6f523a" />
        <path d="M100,20 V310 M130,20 V310 M170,20 V310" stroke="#d4bd92" strokeWidth="2" />
        {/* decay column behind the wound, elongated vertically */}
        <path d="M150,80 C150,60 200,60 200,80 L200,250 C200,270 150,270 150,250 Z" fill="#8b5e3c" opacity=".85" />
        {/* wound opening */}
        <path d="M200,140 C188,150 188,180 200,190 L212,190 L212,140 Z" fill="#f7f9f6" />
        <path d="M200,140 q10,4 8,12 M200,190 q10,-4 8,-12" stroke="#6f523a" strokeWidth="5" fill="none" />
        {/* wall 1: caps at the top and bottom of the column */}
        <path d="M150,80 C150,60 200,60 200,80 M150,250 C150,270 200,270 200,250" stroke="#6b4fa0" strokeWidth="4" fill="none" />
        {/* wall 4: barrier zone between decay and wood formed after wounding */}
        <path d="M203,78 V140 M203,190 V252" stroke="#c0504d" strokeWidth="4" />

        {/* cross-section */}
        <text x={cx} y="322" textAnchor="middle" className="svg-note">cross-section</text>
        <circle cx={cx} cy={cy} r="138" fill="#6f523a" />
        <circle cx={cx} cy={cy} r="130" fill="#ecd8b2" />
        {[20, 40, 60, 80, 100, 115].map(r => <circle key={r} cx={cx} cy={cy} r={r} fill="none" stroke="#d4bd92" strokeWidth="1.5" />)}
        <circle cx={cx} cy={cy} r="4" fill="#8b6b4a" />
        {[0, 45, 90, 135, 180, 225, 270, 315, 20, 340].map(a => <path key={a} d={`M${P(8, a)} L${P(128, a)}`} stroke="#dcc49a" strokeWidth="1" />)}
        {/* decay wedge in wood formed before injury */}
        <path d={`M${P(55, -22)} A55,55 0 0 1 ${P(55, 22)} L${P(110, 22)} A110,110 0 0 0 ${P(110, -22)} Z`} fill="#8b5e3c" opacity=".9" />
        {/* open wound through bark and new wood */}
        <path d={`M${P(110, -22)} A110,110 0 0 1 ${P(110, 22)} L${P(140, 22)} A140,140 0 0 0 ${P(140, -22)} Z`} fill="#f7f9f6" />
        <path d={`${arc(110, -70, -22)} M${P(110, 22)} A110,110 0 0 1 ${P(110, 70)}`} stroke="#c0504d" strokeWidth="4" fill="none" />
        <path d={arc(55, -22, 22)} stroke="#2f5d8a" strokeWidth="4" fill="none" />
        <path d={`M${P(55, -22)} L${P(110, -22)} M${P(55, 22)} L${P(110, 22)}`} stroke="#3c7d4f" strokeWidth="4" />

        {ZONES.map(z => (
          <g key={z.id} className={'zone ' + state(z)} onClick={() => sel ? place(z.id, sel) : clear(z.id)}
            onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); place(z.id, e.dataTransfer.getData('text/plain') as Wall); }}
            role="button" aria-label={`Marker ${z.id}${placed[z.id] ? ', ' + placed[z.id] : ''}`}>
            <line x1={z.x} y1={z.y} x2={z.tx} y2={z.ty} />
            <circle cx={z.x} cy={z.y} r="18" />
            <text x={z.x} y={z.y} textAnchor="middle" dominantBaseline="central">{z.id}</text>
          </g>
        ))}
      </svg>

      <div className="slots">{ZONES.map(z => (
        <div key={z.id} className={'slot ' + state(z)} onClick={() => sel ? place(z.id, sel) : clear(z.id)}
          onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); place(z.id, e.dataTransfer.getData('text/plain') as Wall); }}>
          <b>{z.id}</b><span>{placed[z.id] ?? (sel ? 'Tap to place ' + sel : 'Empty')}</span>
        </div>
      ))}</div>

      <div className="actions">
        <button className="primary" disabled={checked || Object.values(placed).filter(Boolean).length < 4} onClick={() => setChecked(true)}>Check answers</button>
        <button className="secondary" onClick={() => { setPlaced({}); setChecked(false); setSel(null); }}>Reset</button>
      </div>
      {checked && <>
        <div className={'act-feedback ' + (correct === 4 ? 'ok' : 'no')}>{correct} of 4 correct.{correct < 4 && ' Wrong markers are shown in red.'}</div>
        <div className="act-legend">{ZONES.slice().sort((a, b) => a.wall.localeCompare(b.wall)).map(z => <p key={z.id}><b>{z.wall} (marker {z.id}):</b> {INFO[z.wall]}</p>)}</div>
      </>}
    </section>
  );
}
