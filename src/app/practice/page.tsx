import Link from 'next/link';
import { COURSES } from '@/lib/courses';
import { quizzes } from '@/lib/content';
import PracticeExam, { type ExamQ } from '@/components/activities/PracticeExam';
export const metadata = { title: 'Practice Exam' };
// Pool every module and review quiz question, tagged with its course.
const bank: ExamQ[] = COURSES.flatMap(c => c.modules.flatMap(m => (m.quiz ? quizzes[m.quiz as keyof typeof quizzes] ?? [] : []).map(q => ({ ...q, domain: c.title }))));
export default function Practice() {
  return <main><div className="page-head"><p className="eyebrow">Practice</p><h1>Mixed practice exam</h1><p>Questions are drawn from every course. Your best score is saved in this browser.</p></div>
    <PracticeExam bank={bank} domains={COURSES.map(c => c.title)} />
    <p className="act-note">Module quizzes and course grades live inside each course. <Link href="/">Go to your dashboard →</Link></p>
  </main>;
}
