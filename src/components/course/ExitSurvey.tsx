'use client';
import { useEffect, useState } from 'react';
import { findCourse } from '@/lib/courses';
import { saveSurvey, useStudent } from '@/lib/store';

// Optional: to collect responses centrally, paste a form endpoint here (for example a Formspree URL,
// https://formspree.io/f/XXXXXXX). Responses are always saved in the student's browser as well.
const SURVEY_ENDPOINT = '';

type Q =
  | { id: string; kind: 'scale'; text: string; low: string; high: string }
  | { id: string; kind: 'choice'; text: string; options: string[] }
  | { id: string; kind: 'text'; text: string; note?: string; optional: true };

const LIKERT = ['Strongly disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly agree'];
const QUESTIONS: Q[] = [
  { id: 'recommend', kind: 'scale', text: 'How likely are you to recommend this course to a friend or colleague?', low: 'Not at all likely', high: 'Extremely likely' },
  { id: 'clarity', kind: 'choice', text: 'The course content was clear and well organized.', options: LIKERT },
  { id: 'interactive', kind: 'choice', text: 'The interactive activities helped me understand the material.', options: LIKERT },
  { id: 'quizzes', kind: 'choice', text: 'The module quizzes were a fair check of what I learned.', options: LIKERT },
  { id: 'prepared', kind: 'choice', text: 'How prepared do you now feel for this part of the ISA Certified Arborist exam?', options: ['Not at all', 'Slightly', 'Moderately', 'Very', 'Extremely'] },
  { id: 'time', kind: 'choice', text: 'Roughly how long did the course take you?', options: ['Under 1 hour', '1–2 hours', '2–4 hours', 'More than 4 hours'] },
  { id: 'feedback', kind: 'text', optional: true, text: 'If you have any other specific feedback, please share!', note: 'If we may contact you to follow up, please include your preferred contact information here.' },
];
const REQUIRED = QUESTIONS.filter(q => q.kind !== 'text');

export default function ExitSurvey({ course }: { course: string }) {
  const s = useStudent();
  const c = findCourse(course)!;
  const saved = s?.surveys[course];
  const [answers, setAnswers] = useState<Record<string, string | number>>({});
  const [editing, setEditing] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => { if (saved) setAnswers(saved.answers); }, [saved]);

  const answered = REQUIRED.filter(q => answers[q.id] !== undefined && answers[q.id] !== '').length;
  const pct = Math.round(answered / REQUIRED.length * 100);
  const set = (id: string, v: string | number) => setAnswers(a => ({ ...a, [id]: v }));

  async function submit() {
    setError('');
    if (SURVEY_ENDPOINT) {
      setSending(true);
      try {
        const r = await fetch(SURVEY_ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ course: c.title, ...answers }) });
        if (!r.ok) throw new Error(String(r.status));
      } catch { setError('Your responses were saved, but could not be sent. Please try again later.'); }
      setSending(false);
    }
    saveSurvey(course, { answers, submitted: new Date().toISOString() });
    setEditing(false);
  }

  const done = !!saved?.submitted && !editing;
  return (
    <div className="survey-layout">
      <div className="survey-intro">
        <p>This course is designed to keep improving, and to do that we need to hear from you!</p>
        <p>Now that you've worked through the modules, please share your feedback on the learning experience: the course materials, the interactive activities and quizzes, and how well it all met your expectations. <b>Please take a few minutes to complete this survey. Your opinion matters, and it tells us what to build next.</b></p>
        <p className="act-note">The survey takes about two minutes. Questions marked * are required.</p>
      </div>

      <div className="survey-panel">
        {done ? <div className="survey-thanks">
          <p className="survey-check" aria-hidden="true">✓</p>
          <h2>Thank you for your feedback!</h2>
          <p>Your survey for {c.title} was submitted on {new Date(saved!.submitted!).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}.</p>
          {error && <p className="survey-error">{error}</p>}
          <button className="secondary" onClick={() => setEditing(true)}>Edit my responses</button>
        </div> : <>
          <p className="survey-lede">Feedback. To complete your course, please answer the following questions about your experience. Your input helps us continuously improve these courses. Thank you for your thoughtful feedback!</p>
          {QUESTIONS.map((q, i) => (
            <fieldset key={q.id} className="survey-q">
              <legend><span>{i + 1}.</span> {q.text}{q.kind !== 'text' && <b className="req" aria-label="required">*</b>}</legend>
              {q.kind === 'scale' && <div className="nps">
                <div className="nps-ends"><span>{q.low}</span><span>{q.high}</span></div>
                <div className="nps-row">{Array.from({ length: 11 }, (_, n) => (
                  <label key={n}><span>{n}</span><input type="radio" name={q.id} checked={answers[q.id] === n} onChange={() => set(q.id, n)} /></label>
                ))}</div>
              </div>}
              {q.kind === 'choice' && <div className="survey-opts">{q.options.map(o => (
                <label key={o} className={answers[q.id] === o ? 'on' : ''}><input type="radio" name={q.id} checked={answers[q.id] === o} onChange={() => set(q.id, o)} />{o}</label>
              ))}</div>}
              {q.kind === 'text' && <>{q.note && <p className="survey-note">{q.note}</p>}
                <textarea rows={4} value={(answers[q.id] as string) ?? ''} onChange={e => set(q.id, e.target.value)} /></>}
            </fieldset>
          ))}
          <div className="survey-progress" aria-label={`Survey completion ${pct}%`}>
            <span className="sp-label">Survey Completion</span>
            <div className="sp-row"><span>0%</span><div className="sp-bar"><i style={{ width: pct + '%' }} /></div><span>100%</span></div>
          </div>
          <div className="survey-actions">
            {answered < REQUIRED.length && <span className="act-note small">{REQUIRED.length - answered} required question{REQUIRED.length - answered === 1 ? '' : 's'} left</span>}
            <button className="primary" disabled={answered < REQUIRED.length || sending} onClick={submit}>{sending ? 'Sending…' : 'Submit survey'}</button>
          </div>
        </>}
      </div>
    </div>
  );
}
