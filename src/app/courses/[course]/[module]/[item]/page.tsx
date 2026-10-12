import Link from 'next/link';
import { notFound } from 'next/navigation';
import { COURSES, findCourse, flatItems, itemHref, itemTitle, moduleItems, type ItemKind } from '@/lib/courses';
import { pages, quizzes } from '@/lib/content';
import { withBase } from '@/lib/html';
import LegacyActivity from '@/components/LegacyActivity';
import { Activity, EnrollGate, ModuleQuiz } from '@/components/course/CourseClient';
import { ItemIcon } from '@/components/course/Icons';

type Params = { course: string; module: string; item: string };

export function generateStaticParams() {
  return COURSES.flatMap(c => c.modules.flatMap(m => moduleItems(m).map(k => ({ course: c.slug, module: m.slug, item: k }))));
}

function lookup(p: Params) {
  const c = findCourse(p.course); const m = c?.modules.find(x => x.slug === p.module);
  const k = p.item as ItemKind;
  if (!c || !m || !moduleItems(m).includes(k)) return null;
  return { c, m, k };
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const r = lookup(await params); return { title: r ? itemTitle(r.c, r.m, r.k) : 'Not found' };
}

function Placeholder({ what }: { what: string }) {
  return <div className="placeholder"><p><b>{what} coming soon.</b></p><p>This part of the module hasn&apos;t been written yet. Continue to the next item in the meantime.</p></div>;
}

export default async function ItemPage({ params }: { params: Promise<Params> }) {
  const r = lookup(await params); if (!r) notFound();
  const { c, m, k } = r;
  const all = flatItems(c);
  const i = all.findIndex(x => x.m === m && x.k === k);
  const prev = all[i - 1], next = all[i + 1];
  const n = c.modules.indexOf(m) + 1;
  const href = itemHref(c, m, k);
  const html = m.reading ? pages[m.reading as keyof typeof pages] : undefined;
  const questions = m.quiz ? quizzes[m.quiz as keyof typeof quizzes] : undefined;

  let body: React.ReactNode;
  switch (k) {
    case 'introduction':
      body = m.intro ? <div className="intro">
        <p className="lead">{m.intro}</p>
        {m.objectives && <><h2>Learning objectives</h2><p>By the end of this module you will be able to:</p><ul>{m.objectives.map(o => <li key={o}>{o}</li>)}</ul></>}
        <h2>In this module</h2>
        <ul className="module-outline">{moduleItems(m).filter(x => x !== 'introduction').map(x =>
          <li key={x}><ItemIcon kind={x} /><Link href={itemHref(c, m, x)}>{itemTitle(c, m, x)}</Link></li>)}</ul>
      </div> : <Placeholder what="The module introduction" />;
      break;
    case 'video':
      body = m.video
        ? <div className="video-frame"><iframe src={m.video} title={itemTitle(c, m, k)} allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture" allowFullScreen /></div>
        : <div className="video-box wide" role="img" aria-label="Video lecture coming soon"><span className="play" aria-hidden="true" /><span className="video-note">Video lecture coming soon</span></div>;
      break;
    case 'reading':
      body = html ? <><article className="lesson" dangerouslySetInnerHTML={{ __html: withBase(html) }} /><LegacyActivity path={m.reading!} /></> : <Placeholder what="The reading" />;
      break;
    case 'interactive':
      body = m.interactive === 'legacy'
        ? <div className="placeholder"><p><b>This module&apos;s interactive worksheet is part of the reading.</b></p><p><Link href={itemHref(c, m, 'reading')}>Open the reading and worksheet →</Link></p></div>
        : m.interactive ? <Activity id={m.interactive} /> : <Placeholder what="The interactive activity" />;
      break;
    case 'quiz':
      body = questions ? <ModuleQuiz course={c.slug} module={m.slug} questions={questions} /> : <Placeholder what="The module quiz" />;
      break;
  }

  return (
    <main className="course-page">
      <nav className="crumbs" aria-label="Breadcrumb">
        <Link href={`/courses/${c.slug}/`}>{c.code}</Link><span>›</span>
        <span>{m.items?.length === 1 ? m.title : `Module ${n}: ${m.title}`}</span>
      </nav>
      <h1 className="item-title"><ItemIcon kind={k} />{itemTitle(c, m, k)}</h1>
      <EnrollGate course={c.slug} href={href}>{body}</EnrollGate>
      <nav className="item-pager" aria-label="Previous and next">
        {prev ? <Link className="secondary linkbutton" href={prev.href}>← Previous</Link> : <span />}
        {next ? <Link className="primary linkbutton" href={next.href} title={next.title}>Next →</Link>
              : <Link className="primary linkbutton" href={`/courses/${c.slug}/grades/`}>View grades →</Link>}
      </nav>
    </main>
  );
}
