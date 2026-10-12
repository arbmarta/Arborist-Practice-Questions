import Link from 'next/link';
import { notFound } from 'next/navigation';
import { COURSES, findCourse } from '@/lib/courses';
export function generateStaticParams() { return COURSES.map(c => ({ course: c.slug })); }
export const metadata = { title: 'Course Resources' };
export default async function Resources({ params }: { params: Promise<{ course: string }> }) {
  const c = findCourse((await params).course); if (!c) notFound();
  return <main className="course-page"><p className="crumbs">{c.code}: {c.title}</p><h1>Course Resources</h1>
    <div className="placeholder"><p><b>More resources coming soon.</b></p><p>Glossaries, downloadable notes and reference charts for this course will appear here.</p></div>
    <h2 className="sub-h">Practice</h2>
    <p>Test yourself across every course with the <Link href="/practice/">mixed practice exam</Link>.</p>
  </main>;
}
