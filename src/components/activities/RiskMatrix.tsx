'use client';
import { useState } from 'react';

// Matrices follow the ISA Tree Risk Assessment Best Management Practices / TRAQ approach.
const FAILURE = ['Imminent', 'Probable', 'Possible', 'Improbable'] as const;
const IMPACT = ['Very likely', 'Likely', 'Somewhat likely', 'Unlikely'] as const;
const CONSEQ = ['Negligible', 'Minor', 'Significant', 'Severe'] as const;
type FI = 'Very likely' | 'Likely' | 'Somewhat likely' | 'Unlikely';
type Rating = 'Low' | 'Moderate' | 'High' | 'Extreme';

// Matrix 1: likelihood of failure (rows) × likelihood of impact (columns) → likelihood of failure and impact
const M1: FI[][] = [
  ['Very likely', 'Very likely', 'Likely', 'Somewhat likely'],
  ['Very likely', 'Likely', 'Somewhat likely', 'Unlikely'],
  ['Likely', 'Somewhat likely', 'Unlikely', 'Unlikely'],
  ['Unlikely', 'Unlikely', 'Unlikely', 'Unlikely'],
];
const FI_ROWS: FI[] = ['Very likely', 'Likely', 'Somewhat likely', 'Unlikely'];
// Matrix 2: likelihood of failure and impact (rows) × consequences (columns) → risk rating
const M2: Rating[][] = [
  ['Low', 'Moderate', 'High', 'Extreme'],
  ['Low', 'Moderate', 'High', 'High'],
  ['Low', 'Low', 'Moderate', 'Moderate'],
  ['Low', 'Low', 'Low', 'Low'],
];
const RATINGS: Rating[] = ['Low', 'Moderate', 'High', 'Extreme'];

function Seg<T extends string>({ label, options, value, onChange }: { label: string; options: readonly T[]; value: T; onChange: (v: T) => void }) {
  return <div className="risk-pick"><span>{label}</span><div className="seg wrap">{options.map(o =>
    <button key={o} className={o === value ? 'on' : ''} aria-pressed={o === value} onClick={() => onChange(o)}>{o}</button>)}</div></div>;
}

function Matrix({ title, rows, cols, cells, r, c, rowHead, colHead }: { title: string; rows: readonly string[]; cols: readonly string[]; cells: string[][]; r: number; c: number; rowHead: string; colHead: string }) {
  return <div className="risk-matrix">
    <p className="risk-title">{title}</p>
    <div className="table-scroll"><table>
      <thead><tr><th className="corner">{rowHead} ↓ / {colHead} →</th>{cols.map((h, j) => <th key={h} className={j === c ? 'hl' : ''}>{h}</th>)}</tr></thead>
      <tbody>{rows.map((h, i) => <tr key={h}><th className={i === r ? 'hl' : ''}>{h}</th>{cols.map((_, j) =>
        <td key={j} className={'rc-' + cells[i][j].toLowerCase().replace(' ', '-') + (i === r && j === c ? ' pick' : '')}>{cells[i][j]}</td>)}</tr>)}</tbody>
    </table></div>
  </div>;
}

export default function RiskMatrix() {
  const [f, setF] = useState<(typeof FAILURE)[number]>('Probable');
  const [i, setI] = useState<(typeof IMPACT)[number]>('Likely');
  const [c, setC] = useState<(typeof CONSEQ)[number]>('Significant');
  const [quiz, setQuiz] = useState<{ guess?: Rating } | null>(null);
  const [score, setScore] = useState({ right: 0, total: 0 });

  const fi = M1[FAILURE.indexOf(f)][IMPACT.indexOf(i)];
  const rating = M2[FI_ROWS.indexOf(fi)][CONSEQ.indexOf(c)];
  const hidden = quiz !== null && !quiz.guess;
  const rnd = <T,>(a: readonly T[]) => a[Math.floor(Math.random() * a.length)];
  function newQuiz() { setF(rnd(FAILURE)); setI(rnd(IMPACT)); setC(rnd(CONSEQ)); setQuiz({}); }
  function guess(g: Rating) { if (!quiz || quiz.guess) return; setQuiz({ guess: g }); setScore(s => ({ right: s.right + (g === rating ? 1 : 0), total: s.total + 1 })); }

  return (
    <section className="act" aria-labelledby="risk-h">
      <div className="act-head">
        <h2 id="risk-h">Tree risk rating matrix</h2>
        <div className="seg">
          <button className={!quiz ? 'on' : ''} onClick={() => setQuiz(null)}>Explore</button>
          <button className={quiz ? 'on' : ''} onClick={() => { setScore({ right: 0, total: 0 }); newQuiz(); }}>Quiz me</button>
        </div>
      </div>
      <p className="act-note">Risk is rated in two steps. First, likelihood of failure is combined with likelihood of impact. That result is then combined with the consequences to give the risk rating. Based on the ISA tree risk assessment matrices.</p>

      {quiz ? <div className="risk-scenario">
        <p><b>Likelihood of failure:</b> {f}</p><p><b>Likelihood of impact:</b> {i}</p><p><b>Consequences:</b> {c}</p>
      </div> : <>
        <Seg label="Likelihood of failure" options={FAILURE} value={f} onChange={setF} />
        <Seg label="Likelihood of impact" options={IMPACT} value={i} onChange={setI} />
        <Seg label="Consequences of failure" options={CONSEQ} value={c} onChange={setC} />
      </>}

      {hidden ? <>
        <p className="act-note">What is the risk rating?</p>
        <div className="choice-row">{RATINGS.map(r => <button key={r} className="choice" onClick={() => guess(r)}>{r}</button>)}</div>
      </> : <>
        {quiz?.guess && <div className={'act-feedback ' + (quiz.guess === rating ? 'ok' : 'no')}>{quiz.guess === rating ? 'Correct.' : `Not quite, you picked ${quiz.guess}.`} Step 1 gives <b>{fi.toLowerCase()}</b>; combined with <b>{c.toLowerCase()}</b> consequences, the risk is <b>{rating.toLowerCase()}</b>.</div>}
        <div className="risk-grid">
          <Matrix title="Step 1: Likelihood of failure and impact" rows={FAILURE} cols={IMPACT} cells={M1} r={FAILURE.indexOf(f)} c={IMPACT.indexOf(i)} rowHead="Failure" colHead="Impact" />
          <Matrix title="Step 2: Risk rating" rows={FI_ROWS} cols={CONSEQ} cells={M2} r={FI_ROWS.indexOf(fi)} c={CONSEQ.indexOf(c)} rowHead="Failure & impact" colHead="Consequences" />
        </div>
        {!quiz && <div className={'risk-result rc-' + rating.toLowerCase()}>Risk rating: <b>{rating}</b></div>}
        {quiz && <div className="actions"><button className="primary" onClick={newQuiz}>Next tree</button></div>}
      </>}
      {quiz && <p className="act-score">Score: {score.right} / {score.total}</p>}
    </section>
  );
}
