'use client';
import {useEffect,useState} from 'react';
export default function Progress({path}:{path:string}){const [done,setDone]=useState(false);useEffect(()=>setDone(localStorage.getItem('lesson:'+path)==='1'),[path]);function toggle(){const n=!done;setDone(n);localStorage.setItem('lesson:'+path,n?'1':'0')}return <button className={`complete ${done?'done':''}`} onClick={toggle}>{done?'✓ Completed':'Mark lesson complete'}</button>}
