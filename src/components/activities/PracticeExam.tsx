'use client';
import { useEffect, useState } from 'react';

export type ExamQ = { q: string; o: readonly string[]; a: number; e: string; domain: string };
type Live = ExamQ & { order: number[] }; // order maps displayed option → original option index

function shuffle<T>(a: readonly T[]): T[] { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; }
const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

export default function PracticeExam({ bank, domains }: { bank: ExamQ[]; domains: string[] }) {
  const [qs, setQs] = useState<Live[] | null>(null);
  const [ans, setAns] = useState<Record<number, number>>({});
  const [idx, setIdx] = useState(0);
  const [done, setDone] = useState(false);
  const [start, setStart] = useState(0);
  const [now, setNow] = useState(0);
  const [best, setBest] = useState<number | null>(null);
  const [onlyMissed, setOnlyMissed] = useState(false);
  const [all, setAll] = useState(false); // 'Every question' mode: don't reveal the bank size

  useEffect(() => { try { const v = localStorage.getItem('exam:best'); if (v) setBest(+v); } catch {} }, []);
  useEffect(() => { if (!qs || done) return; const t = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t); }, [qs, done]);

  function begin(list: ExamQ[], all = false) {
    setAll(all);
    setQs(shuffle(list).map(q => ({ ...q, order: shuffle(q.o.map((_, i) => i)) })));
    setAns({}); setIdx(0); setDone(false); setOnlyMissed(false); setStart(Date.now()); setNow(Date.now());
  }
  function finish() {
    setDone(true);
    if (!qs) return;
    const pct = Math.round(qs.filter((q, i) => ans[i] === q.a).length / qs.length * 100);
    if (qs.length >= 20 && (best === null || pct > best)) { setBest(pct); try { localStorage.setItem('exam:best', String(pct)); } catch {} }
  }

  if (!qs) return (
    <section className="act exam-start">
      <div className="act-head"><h2>Mixed practice exam</h2></div>
      <p className="act-note">Questions are drawn at random from all five sections and shown one at a time, like the real exam. You get a score breakdown by domain at the end.</p>
      {best !== null && <p className="act-score">Your best score: {best}%</p>}
      <div className="choice-row">
        {[20, 50, 100].filter(n => n < bank.length).map(n =>
          <button key={n} className="choice" onClick={() => begin(shuffle(bank).slice(0, n))}>{n} questions</button>)}
        <button className="choice" onClick={() => begin(bank, true)}>Every question</button>
      </div>
    </section>
  );

  const elapsed = Math.max(0, Math.round((now - start) / 1000));
  const answered = Object.keys(ans).length;

  if (done) {
    const right = qs.filter((q, i) => ans[i] === q.a).length;
    const pct = Math.round(right / qs.length * 100);
    const byDomain = domains.map(d => {
      const items = qs.map((q, i) => ({ q, i })).filter(x => x.q.domain === d);
      return { d, n: items.length, r: items.filter(x => ans[x.i] === x.q.a).length };
    }).filter(x => x.n > 0);
    const missed = qs.map((q, i) => ({ q, i })).filter(x => ans[x.i] !== x.q.a);
    return (
      <section className="act">
        <div className="act-head"><h2>Exam results</h2></div>
        <div className="exam-score"><b>{pct}%</b><span>{all ? '' : `${right} of ${qs.length} correct · `}{fmt(elapsed)}</span></div>
        <div className="domain-bars">{byDomain.map(x => {
          const p = Math.round(x.r / x.n * 100);
          return <div key={x.d} className="domain-bar"><span>{x.d}</span><div className="bar"><i style={{ width: p + '%' }} className={p >= 70 ? 'good' : p >= 50 ? 'mid' : 'low'} /></div><b>{p}%</b></div>;
        })}</div>
        <p className="act-note small">Use the domain breakdown to decide which lessons to review next.</p>
        <div className="actions">
          {missed.length > 0 && <button className="primary" onClick={() => begin(missed.map(x => x.q))}>Retry the {missed.length} I missed</button>}
          <button className="secondary" onClick={() => setQs(null)}>New exam</button>
          <label className="check"><input type="checkbox" checked={onlyMissed} onChange={e => setOnlyMissed(e.target.checked)} /> Show only missed questions</label>
        </div>
        <ol className="review">{qs.map((q, i) => {
          const ok = ans[i] === q.a;
          if (onlyMissed && ok) return null;
          return <li key={i} className={ok ? 'ok' : 'no'} value={i + 1}>
            <p className="rq">{q.q} <span className="tag">{q.domain}</span></p>
            {!ok && <p>Your answer: {ans[i] === undefined ? <i>skipped</i> : q.o[ans[i]]}</p>}
            <p><b>Answer: {q.o[q.a]}.</b> {q.e}</p>
          </li>;
        })}</ol>
      </section>
    );
  }

  const q = qs[idx];
  return (
    <section className="act exam">
      <div className="exam-bar">
        <span>Question {idx + 1}{all ? '' : ` of ${qs.length}`}</span>
        <span className="tag">{q.domain}</span>
        <span>{fmt(elapsed)}</span>
      </div>
      <div className="progress"><i style={{ width: (answered / qs.length * 100) + '%' }} /></div>
      <fieldset className="quiz-question exam-q">
        <legend>{q.q}</legend>
        {q.order.map(oi => (
          <label key={oi} className={ans[idx] === oi ? 'picked' : ''}>
            <input type="radio" name={'exam-q' + idx} checked={ans[idx] === oi} onChange={() => setAns(a => ({ ...a, [idx]: oi }))} />
            <span>{q.o[oi]}</span>
          </label>
        ))}
      </fieldset>
      <div className="actions">
        <button className="secondary" disabled={idx === 0} onClick={() => setIdx(idx - 1)}>Previous</button>
        {idx < qs.length - 1
          ? <button className="primary" onClick={() => setIdx(idx + 1)}>Next</button>
          : <button className="primary" onClick={finish}>Finish exam</button>}
        <button className="secondary" onClick={() => { if (answered === qs.length || confirm(`You have ${qs.length - answered} unanswered question(s). Finish anyway?`)) finish(); }}>Finish now</button>
      </div>
    </section>
  );
}
