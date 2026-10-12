import Link from 'next/link';import {domains} from '@/lib/navigation';import {quizzes} from '@/lib/content';
import PracticeExam, {type ExamQ} from '@/components/activities/PracticeExam';
// Flatten every section quiz into one bank, tagging each question with its domain name.
const bank:ExamQ[]=domains.flatMap(d=>(quizzes[`/${d.slug}/section-quiz` as keyof typeof quizzes]??[]).map(q=>({...q,domain:d.name})));
export default function Practice(){return <main><div className="page-head"><p className="eyebrow">Practice</p><h1>Practice</h1><p>Take a mixed exam across every domain, or drill one section at a time. Best scores are saved in this browser.</p></div>
<PracticeExam bank={bank} domains={domains.map(d=>d.name)}/>
<h2 className="sub-h">Section quizzes</h2>
<div className="cards">{domains.map(d=><Link className="card" href={`/${d.slug}/section-quiz/`} key={d.slug}><h3>{d.name}</h3><p>Cumulative section practice</p><span>Start quiz →</span></Link>)}</div></main>}
