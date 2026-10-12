'use client';
// Student progress, saved in this browser's localStorage (the site is static, so there is no server).
// Components subscribe with useStudent() and re-render whenever anything changes, in any tab.
import { useEffect, useState } from 'react';

export type QuizResult = { best: number; last: number; attempts: number; updated: string };
export type Student = {
  enrolled: string[];                                  // course slugs
  grades: Record<string, Record<string, QuizResult>>;  // course → module → result
  visited: Record<string, string[]>;                   // course → item hrefs viewed
};
const KEY = 'arborist-student-v1';
const EVENT = 'arborist-student-change';
const EMPTY: Student = { enrolled: [], grades: {}, visited: {} };

function read(): Student {
  try { const v = localStorage.getItem(KEY); return v ? { ...EMPTY, ...JSON.parse(v) } : EMPTY; } catch { return EMPTY; }
}
function write(s: Student) {
  try { localStorage.setItem(KEY, JSON.stringify(s)); } catch {}
  window.dispatchEvent(new Event(EVENT));
}
function update(fn: (s: Student) => Student) { write(fn(read())); }

export const enroll = (course: string) => update(s => s.enrolled.includes(course) ? s : { ...s, enrolled: [...s.enrolled, course] });
export const unenroll = (course: string) => update(s => ({ ...s, enrolled: s.enrolled.filter(c => c !== course) }));
export const markVisited = (course: string, href: string) => update(s => {
  const list = s.visited[course] ?? [];
  return list.includes(href) ? s : { ...s, visited: { ...s.visited, [course]: [...list, href] } };
});
export const recordQuiz = (course: string, module: string, pct: number) => update(s => {
  const prev = s.grades[course]?.[module];
  const r: QuizResult = { best: Math.max(prev?.best ?? 0, pct), last: pct, attempts: (prev?.attempts ?? 0) + 1, updated: new Date().toISOString() };
  return { ...s, grades: { ...s.grades, [course]: { ...s.grades[course], [module]: r } } };
});
export const resetCourse = (course: string) => update(s => {
  const grades = { ...s.grades }; delete grades[course];
  const visited = { ...s.visited }; delete visited[course];
  return { ...s, grades, visited };
});

/** Returns null until loaded in the browser, so server-rendered HTML never disagrees with saved data. */
export function useStudent(): Student | null {
  const [s, setS] = useState<Student | null>(null);
  useEffect(() => {
    const load = () => setS(read());
    load();
    const onStorage = (e: StorageEvent) => { if (e.key === KEY) load(); };
    window.addEventListener(EVENT, load); window.addEventListener('storage', onStorage);
    return () => { window.removeEventListener(EVENT, load); window.removeEventListener('storage', onStorage); };
  }, []);
  return s;
}

/** Course grade = average best score across module quizzes that have been attempted. */
export function courseGrade(s: Student | null, course: string): number | null {
  const g = s?.grades[course]; if (!g) return null;
  const vals = Object.values(g).map(r => r.best);
  return vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : null;
}
