'use client';
import {useEffect} from 'react';
const scripts:Record<string,string>={
 '/soil-and-nutrition/soil-analysis':'/legacy/soil-analysis.js',
 '/soil-and-nutrition/tree-fertilization':'/legacy/tree-fertilization.js',
 '/disorders-and-disturbances/diagnostic-practice':'/legacy/diagnostic-practice.js'
};
export default function LegacyActivity({path}:{path:string}){useEffect(()=>{const src=scripts[path];if(!src)return;const el=document.createElement('script');el.src=(process.env.NEXT_PUBLIC_BASE_PATH||'')+src;el.async=false;document.body.appendChild(el);return()=>el.remove()},[path]);return null}
