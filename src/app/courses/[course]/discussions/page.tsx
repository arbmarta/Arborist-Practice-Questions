import { notFound } from 'next/navigation';
import { COURSES, findCourse } from '@/lib/courses';
import Discussion from '@/components/course/Discussion';
import { EnrollGate } from '@/components/course/CourseClient';
export function generateStaticParams() { return COURSES.map(c => ({ course: c.slug })); }
export const metadata = { title: 'Discussions' };
export default async function Discussions({ params }: { params: Promise<{ course: string }> }) {
  const c = findCourse((await params).course); if (!c) notFound();
  return <main className="course-page">
    <p className="crumbs">{c.title}</p>
    <h1>Discussions</h1>
    <div className="discussion-intro">
      <p>Ask questions, share tips from the field and help each other prepare. Posting requires a free GitHub account; anyone can read.</p>
      <p className="act-note small">Be respectful, stay on topic, and don&apos;t share exam questions or personal information.</p>
    </div>
    <EnrollGate course={c.slug} track={false}><Discussion term={`course:${c.slug}`} /></EnrollGate>
  </main>;
}
