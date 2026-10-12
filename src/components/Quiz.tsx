'use client';
import {useMemo,useState,useEffect} from 'react';
type Q={q:string;o:readonly string[];a:number;e:string};
export default function Quiz({questions,storageKey}:{questions:readonly Q[],storageKey:string}){
 const [attempt,setAttempt]=useState(0); const qs=useMemo(()=>[...questions].sort(()=>Math.random()-.5),[questions,attempt]);
 const [answers,setAnswers]=useState<Record<number,number>>({}); const [graded,setGraded]=useState(false); const [best,setBest]=useState<number|null>(null);
 useEffect(()=>{const v=localStorage.getItem(storageKey); if(v)setBest(Number(v));},[storageKey]);
 const score=graded?qs.reduce((n,q,i)=>n+(answers[i]===q.a?1:0),0):0;
 function grade(){setGraded(true); const s=qs.reduce((n,q,i)=>n+(answers[i]===q.a?1:0),0); const pct=Math.round(s/qs.length*100); if(best===null||pct>best){setBest(pct);localStorage.setItem(storageKey,String(pct));}}
 function restart(){setAnswers({});setGraded(false);setAttempt(x=>x+1)}
 return <section className="quiz-shell"><div className="quiz-top"><span>{qs.length} questions</span>{best!==null&&<span>Best: {best}%</span>}</div>{qs.map((q,i)=><fieldset className="quiz-question" key={`${attempt}-${i}`}><legend><span>{i+1}.</span> {q.q}</legend>{q.o.map((o,j)=><label key={o}><input type="radio" name={`q${i}`} checked={answers[i]===j} onChange={()=>!graded&&setAnswers({...answers,[i]:j})}/><span>{o}</span></label>)}{graded&&<div className="answer-explanation"><strong>{answers[i]===q.a?'Correct.':`Answer: ${q.o[q.a]}.`}</strong> {q.e}</div>}</fieldset>)}<div className="actions"><button className="primary" onClick={grade}>Grade quiz</button><button className="secondary" onClick={restart}>New attempt</button></div>{graded&&<div className="result"><strong>{score} / {qs.length}</strong> ({Math.round(score/qs.length*100)}%). Review the explanations above and retry when ready.</div>}</section>
}
