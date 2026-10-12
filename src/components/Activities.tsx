'use client';
import { useEffect, useState, type ComponentType } from 'react';
import { createPortal } from 'react-dom';
import SoilTriangle from './activities/SoilTriangle';
import PruningCuts from './activities/PruningCuts';
import RiskMatrix from './activities/RiskMatrix';
import ConiferKey from './activities/ConiferKey';
import CoditWalls from './activities/CoditWalls';
import RopeSorter from './activities/RopeSorter';

// Interactive activities shown on each lesson page. If `mount` is set, the activity is placed
// inside the lesson HTML at the element with that id; otherwise it appears after the lesson.
const ACTIVITIES: Record<string, { C: ComponentType; mount?: string }[]> = {
  '/botany/tree-biology': [{ C: CoditWalls }],
  '/botany/tree-identification': [{ C: ConiferKey }],
  '/soil-and-nutrition/soil-analysis': [{ C: SoilTriangle, mount: 'soil-triangle-root' }],
  '/arboriculture-operations/pruning': [{ C: PruningCuts }],
  '/arboriculture-operations/tree-risk-and-support': [{ C: RiskMatrix }],
  '/arboriculture-operations/worker-safety-and-climbing': [{ C: RopeSorter }],
};

function Mounted({ id, C }: { id: string; C: ComponentType }) {
  const [el, setEl] = useState<HTMLElement | null>(null);
  useEffect(() => setEl(document.getElementById(id)), [id]);
  return el ? createPortal(<C />, el) : null;
}

export default function Activities({ path }: { path: string }) {
  const list = ACTIVITIES[path];
  if (!list) return null;
  return <>{list.map(({ C, mount }, i) => mount ? <Mounted key={i} id={mount} C={C} /> : <C key={i} />)}</>;
}
