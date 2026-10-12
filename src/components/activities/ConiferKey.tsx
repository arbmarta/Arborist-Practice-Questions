'use client';
import { useState } from 'react';

type Result = { genus: string; common: string; traits: string[] };
type Node = { q: string; options: { label: string; hint: string; next: string }[] };

// A simple dichotomous key for common conifer genera. Fir, spruce and pine follow the lesson;
// the others are common lookalikes worth separating.
const NODES: Record<string, Node> = {
  start: { q: 'What does the foliage look like?', options: [
    { label: 'Needles', hint: 'Long, narrow leaves', next: 'arrangement' },
    { label: 'Scales', hint: 'Small overlapping scales pressed flat to the twig', next: 'r:cypress' },
  ] },
  arrangement: { q: 'How are the needles attached?', options: [
    { label: 'In bundles (fascicles)', hint: 'Usually 2–5 needles wrapped together at the base', next: 'r:pine' },
    { label: 'In dense tufts on short spur shoots', hint: 'Many soft needles per tuft; turn yellow and drop in autumn', next: 'r:larch' },
    { label: 'Singly along the twig', hint: 'Each needle attached on its own', next: 'single' },
  ] },
  single: { q: 'Roll a needle between your fingers and look at the twig.', options: [
    { label: 'Stiff, sharp, rolls easily; sits on a woody peg', hint: 'Twig feels rough where needles have fallen', next: 'r:spruce' },
    { label: 'Flat, does not roll; no woody peg', hint: 'Twig stays smooth where needles have fallen', next: 'flat' },
  ] },
  flat: { q: 'Look at the cones and how each needle joins the twig.', options: [
    { label: 'Cones stand upright on the branch', hint: 'Needle base looks like a small suction cup', next: 'r:fir' },
    { label: 'Cones hang down with three-pointed bracts', hint: 'Bracts stick out between the scales, like a forked tongue', next: 'r:douglas' },
    { label: 'Small hanging cones; needles on tiny stalks', hint: 'Needles often have two white lines underneath', next: 'r:hemlock' },
  ] },
};
const RESULTS: Record<string, Result> = {
  pine: { genus: 'Pinus', common: 'Pine', traits: ['Needles in fascicles (bundles), usually 2–5', 'Woody cones', 'The number of needles per bundle helps separate species'] },
  larch: { genus: 'Larix', common: 'Larch (tamarack)', traits: ['Soft needles in tufts on spur shoots', 'Deciduous: needles yellow and drop in autumn', 'Small upright cones'] },
  spruce: { genus: 'Picea', common: 'Spruce', traits: ['Single, stiff, sharp needles', 'Needles attached on woody pegs', 'Hanging cones'] },
  fir: { genus: 'Abies', common: 'Fir', traits: ['Single, flat, blunt needles', 'Suction-cup-like needle base, no peg', 'Upright cones that break apart on the tree'] },
  douglas: { genus: 'Pseudotsuga', common: 'Douglas-fir', traits: ['Single flat needles', 'Hanging cones with three-pointed bracts', 'Not a true fir (Abies)'] },
  hemlock: { genus: 'Tsuga', common: 'Hemlock', traits: ['Short flat needles on tiny stalks', 'Two white lines under the needle', 'Small hanging cones; drooping leader'] },
  cypress: { genus: 'Cupressaceae (e.g. Thuja, Juniperus)', common: 'Cypress family: arborvitae (cedar), juniper', traits: ['Scale-like foliage pressed to the twig', 'Some junipers also have sharp juvenile needles', 'Cones small; juniper "berries" are fleshy cones'] },
};

export default function ConiferKey() {
  const [path, setPath] = useState<{ node: string; choice: string }[]>([]);
  const [current, setCurrent] = useState('start');
  const isResult = current.startsWith('r:');
  const node = NODES[current];
  const result = isResult ? RESULTS[current.slice(2)] : null;
  function choose(label: string, next: string) { setPath(p => [...p, { node: current, choice: label }]); setCurrent(next); }
  function back() { const p = [...path]; const last = p.pop(); if (last) { setPath(p); setCurrent(last.node); } }
  function restart() { setPath([]); setCurrent('start'); }
  return (
    <section className="act" aria-labelledby="key-h">
      <div className="act-head"><h2 id="key-h">Conifer identification key</h2></div>
      <p className="act-note">Work through the key with a real twig if you can. Each choice narrows the possibilities, the same way a field guide's dichotomous key does.</p>
      {path.length > 0 && <ol className="key-trail">{path.map((p, i) => <li key={i}>{p.choice}</li>)}</ol>}
      {node && <div className="key-step">
        <p className="key-q">{node.q}</p>
        <div className="key-options">{node.options.map(o =>
          <button key={o.label} className="key-option" onClick={() => choose(o.label, o.next)}><b>{o.label}</b><span>{o.hint}</span></button>)}</div>
      </div>}
      {result && <div className="key-result">
        <p className="eyebrow">Likely genus</p>
        <h3>{result.common} <i>({result.genus})</i></h3>
        <ul>{result.traits.map(t => <li key={t}>{t}</li>)}</ul>
        <p className="act-note small">Confirm with several independent traits (bark, cones, form) before settling on an identification.</p>
      </div>}
      <div className="actions">
        <button className="secondary" onClick={back} disabled={!path.length}>Back</button>
        <button className="secondary" onClick={restart} disabled={!path.length}>Start over</button>
      </div>
    </section>
  );
}
