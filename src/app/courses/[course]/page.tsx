import { notFound } from 'next/navigation';
import { COURSES, ACTIVITY_TITLES, findCourse, gradedModules, type ActivityId } from '@/lib/courses';
import { quizzes } from '@/lib/content';
import CourseArt from '@/components/course/CourseArt';
import { CourseCTA } from '@/components/course/CourseClient';

export function generateStaticParams() { return COURSES.map(c => ({ course: c.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ course: string }> }) {
  const c = findCourse((await params).course); return { title: c ? c.title : 'Course' };
}

// Course landing page, laid out like the eCornell course home: trailer + "This course includes", then description + "What you'll do".
export default async function CourseHome({ params }: { params: Promise<{ course: string }> }) {
  const c = findCourse((await params).course); if (!c) notFound();
  const graded = gradedModules(c, Object.keys(quizzes));
  const activities = c.modules.map(m => m.interactive).filter((a): a is ActivityId => !!a && a !== 'legacy');
  const hasWorksheet = c.modules.some(m => m.interactive === 'legacy');
  const lessonModules = c.modules.filter(m => !m.items || m.items.length > 1).length;
  return (
    <main className="course-home">
      <h1>{c.title}</h1>
      <CourseCTA course={c.slug} />
      <div className="ch-grid">
        <div className="video-box" role="img" aria-label="Course trailer coming soon">
          <CourseArt course={c} variant="badge" />
          <span className="play" aria-hidden="true" />
          <span className="video-note">Course introduction video coming soon</span>
        </div>
        <aside className="ch-side">
          <h2>This course includes</h2>
          <ul className="includes">
            <li><span className="inc-ic">▶</span>{lessonModules} modules with video lectures, readings and introductions</li>
            {(activities.length > 0 || hasWorksheet) && <li><span className="inc-ic">◎</span>Interactive practice{activities.length ? `: ${activities.map(a => ACTIVITY_TITLES[a]).join(', ')}` : ''}{hasWorksheet ? (activities.length ? ', plus worksheets' : ': hands-on worksheets') : ''}</li>}
            <li><span className="inc-ic">✓</span>{graded.length === 1 ? 'A review quiz' : `${graded.length} module quizzes`} with scores saved to your gradebook</li>
          </ul>
        </aside>
        <div className="ch-desc">
          <h2>Course Description</h2>
          <CourseArt course={c} variant="badge" />
          <p>{c.description}</p>
        </div>
        <aside className="ch-side">
          <h2>What you&apos;ll do</h2>
          <ul className="outcomes">{c.outcomes.map(o => <li key={o}>{o}</li>)}</ul>
        </aside>
      </div>
    </main>
  );
}
