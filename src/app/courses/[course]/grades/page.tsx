import { notFound } from 'next/navigation';
import { COURSES, findCourse } from '@/lib/courses';
import { quizzes } from '@/lib/content';
import { Gradebook } from '@/components/course/CourseClient';
export function generateStaticParams() { return COURSES.map(c => ({ course: c.slug })); }
export const metadata = { title: 'Grades' };
export default async function Grades({ params }: { params: Promise<{ course: string }> }) {
  const c = findCourse((await params).course); if (!c) notFound();
  return <main className="course-page"><p className="crumbs">{c.title}</p><h1>Grades</h1><Gradebook course={c.slug} quizKeys={Object.keys(quizzes)} /></main>;
}
