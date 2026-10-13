'use client';
import {useState,useEffect} from 'react';
type Q={q:string;o:readonly string[];a:number;e:string};
// Fisher-Yates shuffle; question order and answer order both change on every attempt.
function shuffle<T>(arr:readonly T[]):T[]{const a=[...arr];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
export default function Quiz({questions,storageKey,onGraded,hideBest}:{questions:readonly Q[],storageKey:string,onGraded?:(pct:number)=>void,hideBest?:boolean}){
 const [attempt,setAttempt]=useState(0); const [qs,setQs]=useState<Q[]>(()=>[...questions]);
 useEffect(()=>{setQs(shuffle(questions).map(q=>{const order=shuffle(q.o.map((_,j)=>j));return {...q,o:order.map(j=>q.o[j]),a:order.indexOf(q.a)}}))},[questions,attempt]);
 const [answers,setAnswers]=useState<Record<number,number>>({}); const [graded,setGraded]=useState(false); const [best,setBest]=useState<number|null>(null);
 useEffect(()=>{const v=localStorage.getItem(storageKey); if(v)setBest(Number(v));},[storageKey]);
 const score=graded?qs.reduce((n,q,i)=>n+(answers[i]===q.a?1:0),0):0;
 function grade(){setGraded(true); const s=qs.reduce((n,q,i)=>n+(answers[i]===q.a?1:0),0); const pct=Math.round(s/qs.length*100); onGraded?.(pct); if(best===null||pct>best){setBest(pct);localStorage.setItem(storageKey,String(pct));}}
 function restart(){setAnswers({});setGraded(false);setAttempt(x=>x+1)}
 return <section className="quiz-shell">{!hideBest&&best!==null&&<div className="quiz-top"><span>Best: {best}%</span></div>}{qs.map((q,i)=><fieldset className={'quiz-question'+(graded?(answers[i]===q.a?' is-right':' is-wrong'):'')} key={`${attempt}-${i}`}><legend><span>{i+1}.</span> {q.q}</legend>{q.o.map((o,j)=>{
   // After grading: the student's wrong pick turns red, and the correct answer is always shown in green.
   const st=graded?(j===q.a?' opt-right':answers[i]===j?' opt-wrong':''):'';
   return <label key={o} className={st.trim()||undefined}><input type="radio" name={`q${i}`} checked={answers[i]===j} disabled={graded&&answers[i]!==j} onChange={()=>!graded&&setAnswers({...answers,[i]:j})}/><span>{o}</span>{graded&&j===q.a&&<b className="opt-tag">{answers[i]===j?'✓ Your answer':'✓ Correct answer'}</b>}{graded&&j!==q.a&&answers[i]===j&&<b className="opt-tag">✗ Your answer</b>}</label>})}
  {graded&&<div className="answer-explanation"><strong>{answers[i]===q.a?'Correct.':answers[i]===undefined?`Not answered. Answer: ${q.o[q.a]}.`:`Incorrect. Answer: ${q.o[q.a]}.`}</strong> {q.e}</div>}</fieldset>)}<div className="actions"><button className="primary" onClick={grade}>Grade quiz</button><button className="secondary" onClick={restart}>New attempt</button></div>{graded&&<div className="result">You scored <strong>{Math.round(score/qs.length*100)}%</strong>. Review the explanations above and retry when ready.</div>}</section>
}
