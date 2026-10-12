import { notFound } from 'next/navigation';
import { findCourse } from '@/lib/courses';
import CourseShell from '@/components/course/CourseShell';

export default async function CourseLayout({ params, children }: { params: Promise<{ course: string }>; children: React.ReactNode }) {
  const { course } = await params;
  if (!findCourse(course)) notFound();
  return <CourseShell courseSlug={course}>{children}</CourseShell>;
}
