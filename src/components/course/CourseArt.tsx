// Line-art emblems for each course, drawn in the course colour (like the compass on the eCornell card).
import type { Course } from '@/lib/courses';

function Emblem({ art }: { art: Course['art'] }) {
  switch (art) {
    case 'leaf':
      return <g>
        <path d="M50 92 C50 70 50 40 50 8" strokeWidth="3" />
        <path d="M50 8 C20 22 12 55 50 82 C88 55 80 22 50 8 Z" fill="currentColor" fillOpacity=".18" />
        <path d="M50 30 L34 22 M50 42 L28 34 M50 54 L30 50 M50 66 L36 64 M50 30 L66 22 M50 42 L72 34 M50 54 L70 50 M50 66 L64 64" />
      </g>;
    case 'soil':
      return <g>
        <path d="M8 30 H92 M8 50 H92 M8 72 H92" />
        <rect x="8" y="10" width="84" height="84" rx="4" />
        <path d="M8 10 H92 V30 H8 Z" fill="currentColor" fillOpacity=".25" />
        <path d="M50 20 V46 C50 56 40 60 36 70 M50 46 C54 58 64 62 66 76 M50 34 C44 40 32 40 26 44" strokeWidth="2.5" />
        {[[20, 60], [30, 82], [70, 86], [80, 60], [62, 40], [24, 38]].map(([x, y]) => <circle key={x + '-' + y} cx={x} cy={y} r="2.4" fill="currentColor" />)}
      </g>;
    case 'lens':
      return <g>
        <circle cx="42" cy="42" r="28" fill="currentColor" fillOpacity=".12" />
        <circle cx="42" cy="42" r="28" strokeWidth="4" />
        <path d="M62 62 L88 88" strokeWidth="9" />
        <path d="M42 24 C28 30 26 46 42 58 C58 46 56 30 42 24 Z M42 26 V58" />
      </g>;
    case 'helmet':
      return <g>
        <path d="M14 66 C14 36 30 20 50 20 C70 20 86 36 86 66 Z" fill="currentColor" fillOpacity=".18" />
        <path d="M14 66 C14 36 30 20 50 20 C70 20 86 36 86 66 Z" strokeWidth="3" />
        <path d="M6 66 H94 V74 H6 Z" fill="currentColor" fillOpacity=".3" />
        <path d="M50 20 V66 M38 24 C34 36 34 52 36 66 M62 24 C66 36 66 52 64 66" />
      </g>;
    case 'city':
      return <g>
        <path d="M6 90 H94" strokeWidth="3" />
        <path d="M10 90 V48 H30 V90 M34 90 V30 H52 V90 M74 90 V56 H90 V90" fill="currentColor" fillOpacity=".12" />
        <path d="M14 56 H18 M22 56 H26 M14 66 H18 M22 66 H26 M38 40 H42 M44 40 H48 M38 52 H42 M44 52 H48 M38 64 H42 M44 64 H48 M78 64 H86 M78 74 H86" />
        <circle cx="63" cy="58" r="14" fill="currentColor" fillOpacity=".3" />
        <path d="M63 90 V64" strokeWidth="3" />
      </g>;
  }
}

export default function CourseArt({ course, variant }: { course: Course; variant: 'banner' | 'badge' }) {
  if (variant === 'badge') {
    return <svg viewBox="0 0 100 100" className="course-badge" style={{ color: course.color }} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="50" cy="50" r="48" strokeWidth="1.2" />
      <g transform="translate(18 18) scale(.64)"><Emblem art={course.art} /></g>
    </svg>;
  }
  // Banner: an oversized, cropped emblem on a tinted background.
  return <svg viewBox="0 0 330 75" preserveAspectRatio="xMidYMid slice" className="course-banner" style={{ color: course.color }} aria-hidden="true">
    <rect width="330" height="75" fill={course.color} opacity=".08" />
    <g fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <g transform="translate(95 -60) scale(1.9)"><Emblem art={course.art} /></g>
      <path d="M0 38 H330" strokeWidth=".8" opacity=".4" />
    </g>
  </svg>;
}
