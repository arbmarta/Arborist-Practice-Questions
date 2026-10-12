import Redirect from '@/components/course/Redirect';
import { domains } from '@/lib/navigation';

// Old lesson URLs (e.g. /botany/tree-biology/) redirect to their new place inside a course.
const COURSE_FOR: Record<string, string> = {
  'botany': 'tree-biology', 'soil-and-nutrition': 'soils-and-nutrition', 'disorders-and-disturbances': 'tree-health',
  'arboriculture-operations': 'arboriculture-operations', 'urban-forestry': 'urban-forestry',
};
function target(domain: string, lesson: string) {
  const course = COURSE_FOR[domain];
  if (domain === 'botany') {
    if (lesson === 'tree-biology') return `/courses/${course}/parts-of-a-tree/introduction/`;
    if (lesson === 'tree-identification') return `/courses/${course}/tree-identification/introduction/`;
    return `/courses/${course}/`;
  }
  if (lesson === 'section-quiz') return `/courses/${course}/course-review/quiz/`;
  return `/courses/${course}/${lesson}/reading/`;
}
export function generateStaticParams() {
  return domains.flatMap(d => d.lessons.map(l => ({ legacy: d.slug, lesson: l.slug })));
}
export default async function Legacy({ params }: { params: Promise<{ legacy: string; lesson: string }> }) {
  const { legacy, lesson } = await params;
  return <Redirect to={target(legacy, lesson)} />;
}
