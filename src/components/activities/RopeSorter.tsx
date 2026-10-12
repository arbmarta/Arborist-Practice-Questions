'use client';
import { useState } from 'react';

type Item = { text: string; answer: string; why: string };
type Round = { id: string; title: string; note: string; choices: string[]; items: Item[] };

const ROUNDS: Round[] = [
  {
    id: 'knots', title: 'Knot, hitch or bend?',
    note: 'A knot is tied in one rope, a hitch secures a rope to an object or another rope, and a bend joins two rope ends. Classify each by what it does.',
    choices: ['Knot', 'Hitch', 'Bend'],
    items: [
      { text: 'Figure-eight stopper: tied in the end of a rope so it cannot pull through a device', answer: 'Knot', why: 'It is tied in a single rope.' },
      { text: 'Clove hitch: secures a rope around a limb or carabiner', answer: 'Hitch', why: 'It attaches a rope to an object.' },
      { text: 'Sheet bend: joins two ropes of different diameters', answer: 'Bend', why: 'It joins two rope ends.' },
      { text: 'Bowline: forms a fixed loop in the end of a rope', answer: 'Knot', why: 'The loop is tied in a single rope.' },
      { text: 'Prusik: a friction hitch that grips the climbing line', answer: 'Hitch', why: 'It secures one rope to another rope.' },
      { text: 'Double fisherman\'s: joins two rope ends, often to make a loop sling', answer: 'Bend', why: 'It joins two rope ends.' },
      { text: 'Timber hitch: secures a lowering line around a log or limb', answer: 'Hitch', why: 'It attaches a rope to an object.' },
      { text: 'Alpine butterfly: forms a loop in the middle of a rope', answer: 'Knot', why: 'It is tied in a single rope.' },
      { text: 'Water knot: joins the two ends of flat webbing', answer: 'Bend', why: 'Despite the name, it joins two ends, so it works as a bend.' },
    ],
  },
  {
    id: 'systems', title: 'Moving rope (MRS) or stationary rope (SRS)?',
    note: 'In an MRS the climbing line moves through the tie-in point as the climber moves. In an SRS the climber moves along a line that stays still.',
    choices: ['MRS', 'SRS'],
    items: [
      { text: 'The line runs up through the tie-in point and back down to the climber\'s saddle.', answer: 'MRS', why: 'The rope passes through the tie-in and moves as the climber moves.' },
      { text: 'The climber ascends a single line with a mechanical device; the rope does not move at the anchor.', answer: 'SRS', why: 'The line is stationary and the climber travels along it.' },
      { text: 'Rope slides through a friction saver at the tie-in as the climber advances.', answer: 'MRS', why: 'Rope movement through the tie-in defines a moving rope system.' },
      { text: 'The line is anchored at the base of the tree and the climber travels up it.', answer: 'SRS', why: 'A base-anchored line stays still while the climber moves.' },
      { text: 'Climbing on a doubled rope gives the climber a 2:1 mechanical advantage.', answer: 'MRS', why: 'In the classic doubled-rope MRS, rope moves through the tie-in, giving 2:1.' },
    ],
  },
];

function shuffle<T>(a: T[]) { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; }

function SortRound({ round }: { round: Round }) {
  const [items, setItems] = useState(round.items);
  const [ans, setAns] = useState<Record<number, string>>({});
  const [checked, setChecked] = useState(false);
  const right = items.filter((it, i) => ans[i] === it.answer).length;
  return (
    <div className="act-block">
      <h3>{round.title}</h3>
      <p className="act-note">{round.note}</p>
      <ul className="sort-list">{items.map((it, i) => (
        <li key={it.text} className={checked ? (ans[i] === it.answer ? 'ok' : 'no') : ''}>
          <p>{it.text}</p>
          <div className="seg">{round.choices.map(c => (
            <button key={c} className={ans[i] === c ? 'on' : ''} aria-pressed={ans[i] === c} disabled={checked} onClick={() => setAns(a => ({ ...a, [i]: c }))}>{c}</button>
          ))}</div>
          {checked && ans[i] !== it.answer && <p className="sort-why"><b>{it.answer}.</b> {it.why}</p>}
        </li>
      ))}</ul>
      <div className="actions">
        <button className="primary" disabled={checked || Object.keys(ans).length < items.length} onClick={() => setChecked(true)}>Check answers</button>
        <button className="secondary" onClick={() => { setItems(shuffle(round.items)); setAns({}); setChecked(false); }}>Reset</button>
      </div>
      {checked && <div className={'act-feedback ' + (right === items.length ? 'ok' : 'no')}>{right} of {items.length} correct.</div>}
    </div>
  );
}

// Working-load limit = tensile (breaking) strength ÷ design factor
function WllCalc() {
  const make = () => ({ strength: (4 + Math.floor(Math.random() * 9)) * 1000 + (Math.random() < .5 ? 500 : 0), factor: [5, 10, 15][Math.floor(Math.random() * 3)] });
  const [q, setQ] = useState({ strength: 5400, factor: 10 });
  const [val, setVal] = useState('');
  const [shown, setShown] = useState(false);
  const answer = Math.round(q.strength / q.factor);
  const ok = Math.abs(parseFloat(val) - answer) <= 1;
  return (
    <div className="act-block">
      <h3>Working-load limit</h3>
      <p className="act-note">The working-load limit is the highest intended load. Divide the tensile (breaking) strength by the design factor.</p>
      <p>A rope has a tensile strength of <b>{q.strength.toLocaleString()} lb</b>. With a design factor of <b>{q.factor}:1</b>, what is its working-load limit?</p>
      <div className="inline-input"><input type="number" inputMode="decimal" value={val} onChange={e => { setVal(e.target.value); setShown(false); }} aria-label="Working-load limit in pounds" /> <span>lb</span></div>
      <div className="actions">
        <button className="primary" disabled={!val} onClick={() => setShown(true)}>Check</button>
        <button className="secondary" onClick={() => { setQ(make()); setVal(''); setShown(false); }}>New rope</button>
      </div>
      {shown && <div className={'act-feedback ' + (ok ? 'ok' : 'no')}>{ok ? 'Correct.' : 'Not quite.'} {q.strength.toLocaleString()} ÷ {q.factor} = <b>{answer.toLocaleString()} lb</b>.</div>}
    </div>
  );
}

export default function RopeSorter() {
  return (
    <section className="act" aria-labelledby="rope-h">
      <div className="act-head"><h2 id="rope-h">Rope and climbing terms</h2></div>
      {ROUNDS.map(r => <SortRound key={r.id} round={r} />)}
      <WllCalc />
    </section>
  );
}
