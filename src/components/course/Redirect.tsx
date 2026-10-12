'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
export default function Redirect({ to }: { to: string }) {
  const router = useRouter();
  useEffect(() => { router.replace(to); }, [router, to]);
  return <main className="course-page"><p>This page has moved. <Link href={to}>Continue to its new location →</Link></p></main>;
}
