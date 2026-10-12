'use client';
import { useMemo, useRef, useState } from 'react';
import { TEXTURES, classify, centroid } from '@/lib/soilTexture';

// Triangle corners in SVG space: 100% sand bottom-left, 100% silt bottom-right, 100% clay at top.
const W = 640, H = 560;
const SAND = { x: 70, y: 500 }, SILT = { x: 570, y: 500 }, CLAY = { x: 320, y: 500 - 500 * Math.sqrt(3) / 2 };

function toXY(sand: number, clay: number) {
  const silt = 100 - sand - clay;
  return { x: (sand * SAND.x + silt * SILT.x + clay * CLAY.x) / 100, y: (sand * SAND.y + silt * SILT.y + clay * CLAY.y) / 100 };
}
function fromXY(x: number, y: number) {
  // Barycentric coordinates of (x, y) in the triangle.
  const d = (SILT.y - CLAY.y) * (SAND.x - CLAY.x) + (CLAY.x - SILT.x) * (SAND.y - CLAY.y);
  const sand = ((SILT.y - CLAY.y) * (x - CLAY.x) + (CLAY.x - SILT.x) * (y - CLAY.y)) / d;
  const silt = ((CLAY.y - SAND.y) * (x - CLAY.x) + (SAND.x - CLAY.x) * (y - CLAY.y)) / d;
  return { sand: sand * 100, silt: silt * 100, clay: (1 - sand - silt) * 100 };
}
const pts = (poly: [number, number][]) => poly.map(([s, c]) => { const p = toXY(s, c); return `${p.x.toFixed(1)},${p.y.toFixed(1)}`; }).join(' ');

type Point = { sand: number; clay: number };
type Quiz = { target: Point; answer: string; picked?: string };

// A random composition at least 3 points away from any class boundary, so the answer is unambiguous.
function randomSample(): Point {
  for (;;) {
    const sand = Math.round(Math.random() * 95), clay = Math.round(Math.random() * (100 - sand));
    const c = classify(sand, clay);
    const steady = [[3, 0], [-3, 0], [0, 3], [0, -3], [3, -3], [-3, 3]].every(([ds, dc]) => {
      const s = sand + ds, k = clay + dc;
      return s < 0 || k < 0 || s + k > 100 || classify(s, k) === c;
    });
    if (steady) return { sand, clay };
  }
}

export default function SoilTriangle() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [pt, setPt] = useState<Point>({ sand: 40, clay: 20 });
  const [mode, setMode] = useState<'explore' | 'quiz'>('explore');
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [score, setScore] = useState({ right: 0, total: 0 });

  const silt = 100 - pt.sand - pt.clay;
  const texture = classify(pt.sand, pt.clay);
  const p = toXY(pt.sand, pt.clay);
  // Guide lines: constant clay to the left edge, constant silt to the right edge, constant sand to the bottom edge.
  const toClayAxis = toXY(100 - pt.clay, pt.clay);
  const toSiltAxis = toXY(0, 100 - silt);
  const toSandAxis = toXY(pt.sand, 0);

  const labels = useMemo(() => TEXTURES.map(t => {
    const [s, c] = t.label ?? centroid(t.poly);
    return { name: t.name, ...toXY(s, c) };
  }), []);

  function pointFromEvent(e: React.PointerEvent<SVGSVGElement>) {
    const svg = svgRef.current; if (!svg) return null;
    const r = svg.getBoundingClientRect();
    const v = fromXY((e.clientX - r.left) * W / r.width, (e.clientY - r.top) * H / r.height);
    if (v.sand < -0.5 || v.silt < -0.5 || v.clay < -0.5) return null;
    const sand = Math.max(0, Math.min(100, Math.round(v.sand)));
    const clay = Math.max(0, Math.min(100 - sand, Math.round(v.clay)));
    return { sand, clay };
  }
  function onPointer(e: React.PointerEvent<SVGSVGElement>) {
    if (e.type === 'pointermove' && e.buttons !== 1) return;
    const next = pointFromEvent(e); if (!next) return;
    if (mode === 'quiz') {
      if (e.type !== 'pointerdown' || !quiz || quiz.picked) return;
      const picked = classify(next.sand, next.clay);
      setQuiz({ ...quiz, picked });
      setScore(s => ({ right: s.right + (picked === quiz.answer ? 1 : 0), total: s.total + 1 }));
      setPt(quiz.target);
      return;
    }
    setPt(next);
  }
  function newQuestion() { const target = randomSample(); setQuiz({ target, answer: classify(target.sand, target.clay) }); }
  function startQuiz() { setMode('quiz'); setScore({ right: 0, total: 0 }); newQuestion(); }

  function setSand(v: number) { setPt(q => ({ sand: v, clay: Math.min(q.clay, 100 - v) })); }
  function setClay(v: number) { setPt(q => ({ clay: v, sand: Math.min(q.sand, 100 - v) })); }

  const showMarker = mode === 'explore' || !!quiz?.picked;
  const ticks = Array.from({ length: 11 }, (_, i) => i * 10);

  return (
    <section className="act" aria-labelledby="tri-h">
      <div className="act-head">
        <h2 id="tri-h">Interactive soil texture triangle</h2>
        <div className="seg" role="tablist">
          <button role="tab" aria-selected={mode === 'explore'} className={mode === 'explore' ? 'on' : ''} onClick={() => { setMode('explore'); setQuiz(null); }}>Explore</button>
          <button role="tab" aria-selected={mode === 'quiz'} className={mode === 'quiz' ? 'on' : ''} onClick={startQuiz}>Quiz me</button>
        </div>
      </div>
      {mode === 'explore'
        ? <p className="act-note">Tap or drag on the triangle, or use the sliders. The dashed lines show how to read each percentage off its axis: clay to the left, silt to the right, sand to the bottom.</p>
        : <p className="act-note">Find the texture class for the sample below by tapping its region on the triangle.</p>}

      <div className="tri-wrap">
        <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} className="tri-svg" onPointerDown={onPointer} onPointerMove={onPointer}
          role="img" aria-label={`Soil texture triangle. Current point: ${pt.sand}% sand, ${silt}% silt, ${pt.clay}% clay, ${texture}.`}>
          {TEXTURES.map(t => (
            <polygon key={t.name} points={pts(t.poly)} fill={t.color}
              className={mode === 'quiz' && quiz?.picked ? (t.name === quiz.answer ? 'tri-right' : t.name === quiz.picked ? 'tri-wrong' : '') : (mode === 'explore' && t.name === texture ? 'tri-active' : '')} />
          ))}
          {/* 10% grid lines */}
          {ticks.slice(1, 10).map(v => {
            const a = toXY(100 - v, v), b = toXY(0, v), c = toXY(v, 0), d = toXY(v, 100 - v), e = toXY(0, 100 - v), f = toXY(100 - v, 0);
            return <g key={v} className="tri-grid"><line x1={a.x} y1={a.y} x2={b.x} y2={b.y} /><line x1={c.x} y1={c.y} x2={d.x} y2={d.y} /><line x1={e.x} y1={e.y} x2={f.x} y2={f.y} /></g>;
          })}
          {TEXTURES.map(t => <polygon key={'o' + t.name} points={pts(t.poly)} className="tri-edge" />)}
          {labels.map(l => <text key={l.name} x={l.x} y={l.y} className="tri-label" textAnchor="middle" dominantBaseline="middle">{l.name}</text>)}
          {/* axis ticks and titles */}
          {ticks.map(v => {
            const L = toXY(100 - v, v), R = toXY(0, 100 - v), B = toXY(v, 0);
            return <g key={'t' + v} className="tri-tick">
              <text x={L.x - 10} y={L.y} textAnchor="end" dominantBaseline="middle">{v}</text>
              <text x={R.x + 10} y={R.y} dominantBaseline="middle">{v}</text>
              <text x={B.x} y={B.y + 20} textAnchor="middle">{v}</text>
            </g>;
          })}
          <text x={(SAND.x + CLAY.x) / 2 - 60} y={(SAND.y + CLAY.y) / 2} className="tri-axis" textAnchor="middle" transform={`rotate(-60 ${(SAND.x + CLAY.x) / 2 - 60} ${(SAND.y + CLAY.y) / 2})`}>% Clay →</text>
          <text x={(SILT.x + CLAY.x) / 2 + 60} y={(SILT.y + CLAY.y) / 2} className="tri-axis" textAnchor="middle" transform={`rotate(60 ${(SILT.x + CLAY.x) / 2 + 60} ${(SILT.y + CLAY.y) / 2})`}>% Silt →</text>
          <text x={(SAND.x + SILT.x) / 2} y={SAND.y + 48} className="tri-axis" textAnchor="middle">← % Sand</text>
          {showMarker && <g className="tri-marker">
            <line x1={p.x} y1={p.y} x2={toClayAxis.x} y2={toClayAxis.y} />
            <line x1={p.x} y1={p.y} x2={toSiltAxis.x} y2={toSiltAxis.y} />
            <line x1={p.x} y1={p.y} x2={toSandAxis.x} y2={toSandAxis.y} />
            <circle cx={p.x} cy={p.y} r={8} />
          </g>}
        </svg>

        <div className="tri-panel">
          {mode === 'explore' ? <>
            <div className="tri-readout">
              <span className="tri-class">{texture}</span>
              <span>{pt.sand}% sand · {silt}% silt · {pt.clay}% clay</span>
            </div>
            <label className="slider">Sand <b>{pt.sand}%</b>
              <input type="range" min={0} max={100} value={pt.sand} onChange={e => setSand(+e.target.value)} />
            </label>
            <label className="slider">Clay <b>{pt.clay}%</b>
              <input type="range" min={0} max={100} value={pt.clay} onChange={e => setClay(+e.target.value)} />
            </label>
            <p className="act-note small">Silt is whatever is left: 100 − sand − clay = <b>{silt}%</b>.</p>
          </> : quiz && <>
            <div className="tri-readout">
              <span className="tri-sample">{quiz.target.sand}% sand · {100 - quiz.target.sand - quiz.target.clay}% silt · {quiz.target.clay}% clay</span>
            </div>
            {quiz.picked
              ? <div className={'act-feedback ' + (quiz.picked === quiz.answer ? 'ok' : 'no')}>
                  {quiz.picked === quiz.answer ? <>Correct: <b>{quiz.answer}</b>.</> : <>You picked {quiz.picked}. This sample is <b>{quiz.answer}</b>, shown in green, where the dashed lines meet.</>}
                </div>
              : <p className="act-note">Tap the region where this sample plots.</p>}
            <div className="actions">
              <button className="primary" onClick={newQuestion} disabled={!quiz.picked}>Next sample</button>
            </div>
            <p className="act-score">Score: {score.right} / {score.total}</p>
          </>}
        </div>
      </div>
    </section>
  );
}
