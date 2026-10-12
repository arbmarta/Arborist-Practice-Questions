'use client';
import Link from 'next/link';
import { useEffect } from 'react';
import { findCourse, gradedModules, itemHref, itemTitle } from '@/lib/courses';
import { courseGrade, enroll, markVisited, recordQuiz, resetCourse, unenroll, useStudent } from '@/lib/store';
import Quiz from '@/components/Quiz';
import SoilTriangle from '@/components/activities/SoilTriangle';
import PruningCuts from '@/components/activities/PruningCuts';
import RiskMatrix from '@/components/activities/RiskMatrix';
import ConiferKey from '@/components/activities/ConiferKey';
import CoditWalls from '@/components/activities/CoditWalls';
import RopeSorter from '@/components/activities/RopeSorter';
import type { ActivityId } from '@/lib/courses';

const ACTIVITIES: Record<ActivityId, React.ComponentType> = {
  'soil-triangle': SoilTriangle, 'pruning-cuts': PruningCuts, 'risk-matrix': RiskMatrix,
  'conifer-key': ConiferKey, 'codit': CoditWalls, 'rope-terms': RopeSorter,
};
export function Activity({ id }: { id: ActivityId }) { const C = ACTIVITIES[id]; return <C />; }

/** Shows children only to enrolled students; otherwise an enroll prompt. Marks the item as viewed. */
export function EnrollGate({ course, href, children }: { course: string; href: string; children: React.ReactNode }) {
  const s = useStudent();
  const enrolled = !!s?.enrolled.includes(course);
  useEffect(() => { if (enrolled) markVisited(course, href); }, [enrolled, course, href]);
  if (!s) return <div className="gate-loading" aria-busy="true" />;
  if (!enrolled) {
    const c = findCourse(course)!;
    return <div className="enroll-gate">
      <p><b>Enroll in {c.title} to access this page.</b></p>
      <p>Enrolling is free. Your progress and quiz scores will be saved in this browser.</p>
      <button className="primary" onClick={() => enroll(course)}>Enroll in course</button>
    </div>;
  }
  return <>{children}</>;
}

type Q = { q: string; o: readonly string[]; a: number; e: string };
export function ModuleQuiz({ course, module, questions }: { course: string; module: string; questions: readonly Q[] }) {
  const s = useStudent();
  const r = s?.grades[course]?.[module];
  return <>
    {r && <p className="quiz-record">Best score: <b>{r.best}%</b> · Last attempt: {r.last}% · Attempts: {r.attempts}</p>}
    <Quiz questions={questions} storageKey={`quiz:${course}/${module}`} onGraded={pct => recordQuiz(course, module, pct)} />
  </>;
}

/** Course home call-to-action: enroll, or jump to the first unvisited item. */
export function CourseCTA({ course }: { course: string }) {
  const s = useStudent();
  const c = findCourse(course)!;
  if (!s) return <div className="cta-row" />;
  if (!s.enrolled.includes(course)) return <div className="cta-row"><button className="primary" onClick={() => enroll(course)}>Enroll in this course</button></div>;
  const visited = new Set(s.visited[course] ?? []);
  const first = c.modules.flatMap(m => (m.items ?? ['introduction', 'video', 'reading', 'interactive', 'quiz'] as const).map(k => ({ m, k })))
    .find(x => !visited.has(itemHref(c, x.m, x.k)));
  const target = first ?? { m: c.modules[0], k: (c.modules[0].items?.[0] ?? 'introduction') as 'introduction' };
  return <div className="cta-row">
    <Link className="primary linkbutton" href={itemHref(c, target.m, target.k)}>{visited.size ? 'Continue' : 'Start course'}</Link>
    {visited.size > 0 && <span className="cta-next">Next up: {itemTitle(c, target.m, target.k)}</span>}
    <span className="enrolled-pill">✓ Enrolled</span>
  </div>;
}

export function Gradebook({ course, quizKeys }: { course: string; quizKeys: string[] }) {
  const s = useStudent();
  const c = findCourse(course)!;
  const mods = gradedModules(c, quizKeys);
  const grade = courseGrade(s, course);
  if (!s) return null;
  if (!s.enrolled.includes(course)) return <div className="enroll-gate"><p><b>Enroll in {c.title} to start earning grades.</b></p><button className="primary" onClick={() => enroll(course)}>Enroll in course</button></div>;
  const fmt = (iso: string) => new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  const done = mods.filter(m => s.grades[course]?.[m.slug]).length;
  return <>
    <div className="grade-summary">
      <div><span>Current grade</span><b>{grade === null ? '–' : grade + '%'}</b></div>
      <div><span>Quizzes completed</span><b>{done} of {mods.length}</b></div>
    </div>
    <p className="act-note small">Your course grade is the average of your best score on each quiz you've attempted.</p>
    <div className="table-scroll"><table className="gradebook">
      <thead><tr><th>Assessment</th><th>Best</th><th>Last</th><th>Attempts</th><th>Last attempted</th></tr></thead>
      <tbody>{mods.map(m => {
        const r = s.grades[course]?.[m.slug];
        return <tr key={m.slug}>
          <td><Link href={itemHref(c, m, 'quiz')}>{itemTitle(c, m, 'quiz')}</Link></td>
          <td className="num">{r ? <b className={r.best >= 80 ? 'g-good' : r.best >= 60 ? 'g-mid' : 'g-low'}>{r.best}%</b> : '–'}</td>
          <td className="num">{r ? r.last + '%' : '–'}</td>
          <td className="num">{r?.attempts ?? 0}</td>
          <td>{r ? fmt(r.updated) : 'Not started'}</td>
        </tr>;
      })}</tbody>
    </table></div>
    <div className="actions">
      <button className="secondary" onClick={() => { if (confirm('Clear all saved scores and progress for this course?')) resetCourse(course); }}>Reset progress</button>
      <button className="secondary" onClick={() => { if (confirm(`Unenroll from ${c.title}? Your saved scores are kept.`)) unenroll(course); }}>Unenroll</button>
    </div>
  </>;
}
