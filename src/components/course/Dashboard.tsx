'use client';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { COURSES, flatItems, type Course } from '@/lib/courses';
import { courseGrade, courseProgress, enroll, unenroll, useStudent } from '@/lib/store';
import CourseArt from './CourseArt';
import { Kebab } from './Icons';

function CardMenu({ course }: { course: Course }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [open]);
  return <div className="card-menu" ref={ref}>
    <button className="kebab-btn on-art" aria-label={`Options for ${course.title}`} aria-expanded={open} onClick={() => setOpen(!open)}><Kebab /></button>
    {open && <div className="menu-pop" role="menu">
      <Link role="menuitem" href={`/courses/${course.slug}/`}>Course home</Link>
      <Link role="menuitem" href={`/courses/${course.slug}/grades/`}>Grades</Link>
      <button role="menuitem" onClick={() => { if (confirm(`Unenroll from ${course.title}? Your saved scores are kept.`)) unenroll(course.slug); setOpen(false); }}>Unenroll</button>
    </div>}
  </div>;
}

export default function Dashboard() {
  const s = useStudent();
  const enrolled = COURSES.filter(c => s?.enrolled.includes(c.slug));
  const others = COURSES.filter(c => !s?.enrolled.includes(c.slug));
  return (
    <main className="dashboard">
      <div className="dash-head"><h1>Dashboard</h1></div>

      {s && (enrolled.length ? <div className="course-cards">
        {enrolled.map(c => {
          const g = courseGrade(s, c.slug);
          const prog = courseProgress(s, c.slug, flatItems(c).length);
          return <div className="course-card" key={c.slug}>
            <Link href={`/courses/${c.slug}/`} className="card-art" tabIndex={-1} aria-hidden="true"><CourseArt course={c} variant="banner" /></Link>
            <CardMenu course={c} />
            <div className="card-body">
              <Link href={`/courses/${c.slug}/`} className="card-title" style={{ color: c.color }} title={c.title}>{c.title}</Link>
              {g !== null && <p className="card-grade">Current grade: <b>{g}%</b></p>}
              <div className="card-progress">
                <div className="cp-bar" role="progressbar" aria-valuenow={prog} aria-valuemin={0} aria-valuemax={100} aria-label={`${c.title} progress`}><i style={{ width: prog + '%', background: c.color }} /></div>
                <span>{prog === 100 ? 'Complete' : `${prog}% complete`}</span>
              </div>
            </div>
          </div>;
        })}
      </div> : <div className="empty-dash">
        <p><b>You aren't enrolled in any courses yet.</b></p>
        <p>Choose a course below to enroll. Your enrolments, progress and quiz scores are saved in this browser.</p>
      </div>)}

      {s && others.length > 0 && <section className="catalog">
        <h2>{enrolled.length ? 'More courses' : 'Course catalog'}</h2>
        <div className="catalog-list">{others.map(c => (
          <div className="catalog-row" key={c.slug}>
            <CourseArt course={c} variant="badge" />
            <div className="catalog-text">
              <h3><Link href={`/courses/${c.slug}/`}>{c.title}</Link></h3>
              <p>{c.blurb}</p>
            </div>
            <div className="catalog-actions">
              <button className="primary" onClick={() => enroll(c.slug)}>Enroll</button>
              <Link className="secondary linkbutton" href={`/courses/${c.slug}/`}>Preview</Link>
            </div>
          </div>
        ))}</div>
      </section>}
    </main>
  );
}
