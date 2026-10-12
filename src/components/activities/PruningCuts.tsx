'use client';
import { useState } from 'react';

// ---------- Part 1: where to make a branch removal cut ----------
// The branch is drawn in its own frame: x runs along the branch from the trunk face, y across it.
const ANGLE = -28, JX = 176, JY = 236; // branch angle and where the branch meets the trunk face
const rot = (x: number, y: number) => {
  const a = ANGLE * Math.PI / 180;
  return { x: JX + x * Math.cos(a) - y * Math.sin(a), y: JY + x * Math.sin(a) + y * Math.cos(a) };
};

type CutId = 'flush' | 'collar' | 'correct' | 'stub';
const CUTS: Record<CutId, { label: string; verdict: string; ok: boolean }> = {
  flush: { label: 'A', ok: false, verdict: 'Flush cut. It removes the branch collar and branch protection zone, creating a larger wound that is harder for the tree to compartmentalize.' },
  collar: { label: 'B', ok: false, verdict: 'This cuts into the branch collar. The collar is trunk tissue that helps seal the wound, so it should be left intact.' },
  correct: { label: 'C', ok: true, verdict: 'Correct. The cut sits just outside the branch bark ridge and branch collar, keeping the tissues that help the tree seal and compartmentalize.' },
  stub: { label: 'D', ok: false, verdict: 'This leaves a stub. Wood beyond the collar is cut off from the tree\'s defenses and tends to die back and decay.' },
};
// Cut lines in the branch frame: [x1, y1, x2, y2]
const CUT_LINES: Record<Exclude<CutId, 'flush'>, [number, number, number, number]> = {
  collar: [30, -44, 24, 46],
  correct: [80, -40, 70, 40],
  stub: [190, -34, 190, 34],
};

function BranchCut() {
  const [picked, setPicked] = useState<CutId | null>(null);
  const order: CutId[] = ['flush', 'collar', 'correct', 'stub'];
  const cls = (id: CutId) => 'cut' + (picked ? (id === 'correct' ? ' cut-right' : id === picked ? ' cut-wrong' : ' cut-dim') : '');
  const ridgeA = rot(4, -40), ridgeB = rot(60, -40);
  return (
    <div className="act-block">
      <h3>1. Choose the branch removal cut</h3>
      <p className="act-note">Tap the line where you would make the final cut to remove this branch.</p>
      <div className="act-grid">
        <svg viewBox="0 0 440 380" className="act-svg" role="img" aria-label="A branch attached to a trunk with four possible cut lines labelled A to D">
          <rect x="0" y="0" width="440" height="380" fill="#eef4f8" rx="12" />
          <g transform={`translate(${JX} ${JY}) rotate(${ANGLE})`}>
            {/* branch */}
            <path d="M-10,-32 L300,-24 Q318,0 300,24 L-10,32 Z" fill="#9a7856" />
            {/* branch collar: the swollen base, drawn as trunk-coloured tissue wrapping the branch */}
            <path d="M-12,-56 C20,-52 50,-44 76,-33 L76,33 C50,44 20,52 -12,58 Z" fill="#6f523a" />
            <path d="M8,-50 C30,-44 50,-38 70,-31 M8,52 C30,46 50,40 70,32" stroke="#5c4330" strokeWidth="2" fill="none" />
          </g>
          {/* trunk */}
          <path d="M60,0 L178,0 C172,120 170,250 178,380 L60,380 C66,250 64,120 60,0 Z" fill="#6f523a" />
          <path d="M88,0 C85,120 90,250 86,380 M120,0 C123,120 117,250 123,380 M150,0 C148,120 152,250 149,380" stroke="#5c4330" strokeWidth="2" fill="none" />
          {/* collar continues onto the trunk face */}
          <path d={`M178,${JY - 60} C192,${JY - 30} 192,${JY + 30} 178,${JY + 64}`} fill="#6f523a" />
          {/* branch bark ridge: raised bark in the crotch above the branch */}
          <path d={`M${ridgeA.x},${ridgeA.y} Q${(ridgeA.x + ridgeB.x) / 2},${Math.min(ridgeA.y, ridgeB.y) - 16} ${ridgeB.x},${ridgeB.y}`} stroke="#2e2016" strokeWidth="6" strokeLinecap="round" fill="none" />
          <text x="246" y="120" className="svg-note">branch bark ridge</text>
          <path d={`M262,126 L${(ridgeA.x + ridgeB.x) / 2 + 6},${Math.min(ridgeA.y, ridgeB.y) - 12}`} stroke="#33413a" strokeWidth="1.5" />
          <text x="236" y="340" className="svg-note">branch collar</text>
          {(() => { const c = rot(40, 46); return <path d={`M262,326 L${c.x},${c.y + 4}`} stroke="#33413a" strokeWidth="1.5" />; })()}

          {/* flush cut along the trunk face */}
          <g className={cls('flush')} onClick={() => !picked && setPicked('flush')} role="button" aria-label="Cut A">
            <line x1="178" y1={JY - 64} x2="178" y2={JY + 68} className="cut-hit" />
            <line x1="178" y1={JY - 64} x2="178" y2={JY + 68} className="cut-line" />
            <text x="160" y={JY + 90} textAnchor="middle" className="cut-label">A</text>
          </g>
          {(Object.keys(CUT_LINES) as Exclude<CutId, 'flush'>[]).map(id => {
            const [x1, y1, x2, y2] = CUT_LINES[id];
            const p1 = rot(x1, y1), p2 = rot(x2, y2), t = rot(x2, y2 + 20);
            return <g key={id} className={cls(id)} onClick={() => !picked && setPicked(id)} role="button" aria-label={`Cut ${CUTS[id].label}`}>
              <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} className="cut-hit" />
              <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} className="cut-line" />
              <text x={t.x} y={t.y + 6} textAnchor="middle" className="cut-label">{CUTS[id].label}</text>
            </g>;
          })}
        </svg>
        <div>
          {picked
            ? <div className={'act-feedback ' + (CUTS[picked].ok ? 'ok' : 'no')}><b>Cut {CUTS[picked].label}.</b> {CUTS[picked].verdict}</div>
            : <p className="act-note">Look for the branch bark ridge (the raised bark in the crotch) and the branch collar (the swollen base of the branch).</p>}
          {picked && !CUTS[picked].ok && <p className="act-note small">The correct cut is shown in green.</p>}
          {picked && <div className="act-legend">{order.map(id => <p key={id}><b>{CUTS[id].label}:</b> {CUTS[id].verdict.split('.')[0]}.</p>)}</div>}
          <div className="actions"><button className="secondary" onClick={() => setPicked(null)}>Try again</button></div>
        </div>
      </div>
    </div>
  );
}

// ---------- Part 2: branch removal, reduction or heading? ----------
type CutType = 'Branch removal' | 'Reduction' | 'Heading';
type Scenario = { removed: number; kept: number; removeLarger: boolean };
function makeScenario(): Scenario {
  const removed = 6 + Math.floor(Math.random() * 15); // 6–20 cm
  const removeLarger = Math.random() < 0.75;
  if (!removeLarger) return { removed, kept: removed + 2 + Math.floor(Math.random() * 8), removeLarger };
  // Pick a lateral clearly above or below one-third of the removed stem (never exactly on it).
  const third = removed / 3;
  const kept = Math.random() < 0.5
    ? Math.max(1, Math.floor(third * (0.4 + Math.random() * 0.45)))
    : Math.min(removed - 1, Math.ceil(third * (1.2 + Math.random() * 1.2)));
  return { removed, kept, removeLarger };
}
function answerFor(s: Scenario): CutType {
  if (!s.removeLarger) return 'Branch removal';
  return s.kept * 3 >= s.removed ? 'Reduction' : 'Heading';
}
function explain(s: Scenario): string {
  if (!s.removeLarger) return 'You are removing the smaller of the two stems at the union, so this is a branch removal cut.';
  const third = (s.removed / 3).toFixed(1);
  return s.kept * 3 >= s.removed
    ? `You are removing the larger stem, and the remaining lateral (${s.kept} cm) is at least one-third of the removed stem (${third} cm), so this is a reduction cut.`
    : `You are removing the larger stem, but the remaining lateral (${s.kept} cm) is less than one-third of the removed stem (${third} cm), so this is a heading cut. Heading cuts are generally ill-advised on mature trees.`;
}

function CutTypeQuiz() {
  const [s, setS] = useState<Scenario>({ removed: 15, kept: 7, removeLarger: true });
  const [picked, setPicked] = useState<CutType | null>(null);
  const [score, setScore] = useState({ right: 0, total: 0 });
  const answer = answerFor(s);
  function pick(c: CutType) { if (picked) return; setPicked(c); setScore(x => ({ right: x.right + (c === answer ? 1 : 0), total: x.total + 1 })); }
  // Drawing: a parent stem continuing upward (removed or kept) and a lateral to the side.
  const scale = 2.2;
  const big = Math.max(s.removed, s.kept), small = Math.min(s.removed, s.kept);
  const leaderW = big * scale, lateralW = small * scale;
  const removedIsLeader = s.removeLarger;
  return (
    <div className="act-block">
      <h3>2. Name the cut</h3>
      <p className="act-note">The red stem is being removed back to the union. Diameters are shown in centimetres.</p>
      <div className="act-grid">
        <svg viewBox="0 0 300 260" className="act-svg" role="img" aria-label={`Removing a ${s.removed} cm stem; the remaining stem is ${s.kept} cm`}>
          <rect width="300" height="260" fill="#eef4f8" rx="12" />
          <rect x={150 - leaderW / 2} y="150" width={leaderW} height="110" fill="#7b5c40" />
          <rect x={150 - leaderW / 2} y="20" width={leaderW} height="135" fill={removedIsLeader ? '#c0504d' : '#7b5c40'} opacity={removedIsLeader ? .85 : 1} />
          <g transform={`translate(150 160) rotate(-45)`}>
            <rect x="0" y={-lateralW / 2} width="135" height={lateralW} fill={removedIsLeader ? '#7b5c40' : '#c0504d'} opacity={removedIsLeader ? 1 : .85} />
          </g>
          <text x={150 + leaderW / 2 + 8} y="60" className="svg-note">{big} cm</text>
          <text x="254" y="92" className="svg-note">{small} cm</text>
        </svg>
        <div>
          <div className="choice-row">
            {(['Branch removal', 'Reduction', 'Heading'] as CutType[]).map(c => (
              <button key={c} onClick={() => pick(c)}
                className={'choice' + (picked ? (c === answer ? ' right' : c === picked ? ' wrong' : '') : '')}>{c}</button>
            ))}
          </div>
          {picked && <div className={'act-feedback ' + (picked === answer ? 'ok' : 'no')}>{picked === answer ? 'Correct. ' : `Not quite, it's ${answer.toLowerCase()}. `}{explain(s)}</div>}
          <div className="actions">
            <button className="primary" disabled={!picked} onClick={() => { setS(makeScenario()); setPicked(null); }}>Next branch</button>
          </div>
          <p className="act-score">Score: {score.right} / {score.total}</p>
        </div>
      </div>
    </div>
  );
}

export default function PruningCuts() {
  return (
    <section className="act" aria-labelledby="prune-h">
      <div className="act-head"><h2 id="prune-h">Pruning cut trainer</h2></div>
      <BranchCut />
      <CutTypeQuiz />
    </section>
  );
}
