// Course catalogue. Each subject is a course; each course has modules; each module has up to five items.
// Content (HTML and quiz questions) lives in content.ts and is referenced by key, so this file stays small
// enough to ship to the browser for navigation, the dashboard and the gradebook.

export type ItemKind = 'introduction' | 'video' | 'reading' | 'interactive' | 'quiz' | 'survey';
export const ITEM_KINDS: ItemKind[] = ['introduction', 'video', 'reading', 'interactive', 'quiz'];

/** Every course ends with an exit survey, added after its modules. */
export const SURVEY_MODULE: Module = { slug: 'course-survey', title: 'Course Exit Survey', items: ['survey'] };

export type ActivityId = 'codit' | 'conifer-key' | 'soil-triangle' | 'pruning-cuts' | 'risk-matrix' | 'rope-terms';
export const ACTIVITY_TITLES: Record<ActivityId, string> = {
  'codit': 'Label the CODIT Walls',
  'conifer-key': 'Conifer Identification Key',
  'soil-triangle': 'Soil Texture Triangle',
  'pruning-cuts': 'Pruning Cut Trainer',
  'risk-matrix': 'Tree Risk Rating Matrix',
  'rope-terms': 'Rope and Climbing Terms',
};

export type Module = {
  slug: string;
  title: string;
  /** Short intro paragraph for the Introduction page (blank = "coming soon"). */
  intro?: string;
  /** Learning objectives listed on the Introduction page. */
  objectives?: string[];
  /** Video lecture: a YouTube/Vimeo embed URL, e.g. https://www.youtube.com/embed/VIDEO_ID */
  video?: string;
  /** Key into `pages` in content.ts for the Reading page. */
  reading?: string;
  /** Interactive activity for this module. 'legacy' = the worksheet built into the reading page. */
  interactive?: ActivityId | 'legacy';
  /** Key into `pages` for hands-on practice material shown on the Interactive page (below any activity). */
  practical?: string;
  /** Key into `quizzes` in content.ts for the Module Quiz. */
  quiz?: string;
  /** Which items this module has (defaults to all five). */
  items?: ItemKind[];
};

export type Course = {
  slug: string;
  code: string;
  title: string;
  color: string;
  art: 'leaf' | 'soil' | 'lens' | 'helmet' | 'city';
  blurb: string;
  description: string;
  outcomes: string[];
  modules: Module[];
};

const COURSE_LIST: Course[] = [
  {
    slug: 'tree-biology', code: 'ARB101', title: 'Tree Biology and Identification', color: '#2f6b45', art: 'leaf',
    blurb: 'How trees are built, how they make and use energy, how they respond to injury, and how to identify them.',
    description: 'This course builds the botanical foundation every arborist relies on. You will learn how the parts of a tree work together, how trees capture and spend energy, how they wall off injury and decay, what makes palms different, and how to identify trees using a practical, trait-based approach.',
    outcomes: [
      'Describe the structure and function of leaves, stems, roots and the cambium',
      'Explain photosynthesis, respiration and how water moves through a tree',
      'Apply the CODIT model to predict how decay spreads after injury',
      'Recognize how palm anatomy differs from typical woody trees',
      'Identify common conifers using taxonomy and morphological traits',
    ],
    modules: [
      {
        slug: 'parts-of-a-tree', title: 'Parts of a Tree', reading: '/botany/parts-of-a-tree', quiz: '/botany/parts-of-a-tree',
        intro: 'Every recommendation an arborist makes starts with knowing how a tree is put together. In this module you will look at the jobs leaves, stems and roots do, where new growth comes from, and how the cambium adds wood each year.',
        objectives: ['Describe the main functions of leaves, stems and roots', 'Explain what the cambium produces and where', 'Distinguish primary from secondary growth', 'Tell sapwood from heartwood and earlywood from latewood'],
      },
      {
        slug: 'photosynthesis-and-respiration', title: 'Photosynthesis and Respiration', reading: '/botany/photosynthesis-and-respiration', quiz: '/botany/photosynthesis-and-respiration',
        intro: 'Trees run on a balance between making energy and spending it. This module covers how photosynthesis builds sugars, how respiration releases that energy, and how water moves into and through the tree.',
        objectives: ['Explain the inputs and outputs of photosynthesis', 'Describe what respiration does and why the balance matters', 'List conditions that restrict photosynthesis', 'Explain osmosis and transpiration'],
      },
      {
        slug: 'compartmentalization', title: 'Compartmentalization', reading: '/botany/compartmentalization', interactive: 'codit', quiz: '/botany/compartmentalization',
        intro: 'Trees do not heal wounds the way animals do; they wall them off. This module introduces the CODIT model and the four walls that limit the spread of decay, which underpins good pruning and risk decisions.',
        objectives: ['Name the four CODIT walls and the direction each resists', 'Explain why decay columns are often long', 'Describe the barrier zone (Wall 4)'],
      },
      {
        slug: 'palms', title: 'Palms', reading: '/botany/palms', quiz: '/botany/palms',
        intro: 'Palms look like trees but are built very differently. This module explains palm anatomy and why it changes how palms grow, respond to wounds and should be pruned.',
        objectives: ['Explain why palms are monocots without a vascular cambium', 'Describe the role of the single apical meristem', 'Apply palm-specific pruning guidance'],
      },
      {
        slug: 'tree-identification', title: 'Tree Identification', reading: '/botany/tree-identification', interactive: 'conifer-key', quiz: '/botany/tree-identification',
        intro: 'Correct identification comes before almost every other decision. This module gives you a framework for taxonomy and scientific names, and a trait-based approach to identifying conifers and broadleaf trees.',
        objectives: ['Use the taxonomic hierarchy and scientific names correctly', 'Separate pines, spruces and firs using needle and cone traits', 'Combine several traits for a reliable identification'],
      },
    ],
  },
  {
    slug: 'soils-and-nutrition', code: 'ARB102', title: 'Soils and Tree Nutrition', color: '#7a5532', art: 'soil',
    blurb: 'Soil properties, texture, water management, nutrients and fertilization.',
    description: 'Roots live in soil, so tree health depends on it. This course covers how soils form, how to read soil tests and texture, how to manage water, which nutrients trees need and how to calculate fertilizer applications.',
    outcomes: ['Describe soil formation, horizons, structure and pore space', 'Determine soil texture with the texture triangle', 'Plan irrigation and drainage around tree needs', 'Read N-P-K labels and calculate fertilizer amounts'],
    modules: [
      { slug: 'soil-science', title: 'Soil Science', reading: '/soil-and-nutrition/soil-science' },
      { slug: 'soil-analysis', title: 'Soil Analysis', interactive: 'soil-triangle', practical: '/soil-and-nutrition/soil-analysis' },
      { slug: 'water-management', title: 'Water Management', reading: '/soil-and-nutrition/water-management' },
      { slug: 'tree-nutrition', title: 'Tree Nutrition', reading: '/soil-and-nutrition/tree-nutrition' },
      { slug: 'tree-fertilization', title: 'Tree Fertilization', reading: '/soil-and-nutrition/tree-fertilization', interactive: 'legacy' },
      { slug: 'course-review', title: 'Course Review', quiz: '/soil-and-nutrition/section-quiz', items: ['quiz'] },
    ],
  },
  {
    slug: 'tree-health', code: 'ARB103', title: 'Tree Disorders and Plant Health Care', color: '#8a3b2e', art: 'lens',
    blurb: 'Abiotic and biotic problems, diagnosis and plant health care programs.',
    description: 'This course covers the problems trees face and how to work out what is wrong. You will learn to separate abiotic and biotic causes, follow a systematic diagnostic process and build plant health care strategies.',
    outcomes: ['Distinguish signs from symptoms and acute from chronic disturbances', 'Follow a systematic diagnostic process', 'Choose appropriate plant health care and control strategies'],
    modules: [
      { slug: 'abiotic-disturbances', title: 'Abiotic Disturbances', reading: '/disorders-and-disturbances/abiotic-disturbances' },
      { slug: 'pests-and-pathogens', title: 'Pests and Pathogens', reading: '/disorders-and-disturbances/pests-and-pathogens' },
      { slug: 'tree-diagnostics', title: 'Tree Diagnostics', reading: '/disorders-and-disturbances/tree-diagnostics' },
      { slug: 'plant-health-care', title: 'Plant Health Care', reading: '/disorders-and-disturbances/plant-health-care' },
      { slug: 'diagnostic-practice', title: 'Diagnostic Practice', practical: '/disorders-and-disturbances/diagnostic-practice' },
      { slug: 'course-review', title: 'Course Review', quiz: '/disorders-and-disturbances/section-quiz', items: ['quiz'] },
    ],
  },
  {
    slug: 'arboriculture-operations', code: 'ARB104', title: 'Arboriculture Operations', color: '#2d5c7a', art: 'helmet',
    blurb: 'Pruning, planting, worker safety and climbing, tree risk and support systems.',
    description: 'This course covers the hands-on work of arboriculture: making correct pruning cuts, selecting and planting trees, working safely aloft and assessing and reducing tree risk.',
    outcomes: ['Make and specify correct pruning cuts', 'Select, plant and establish trees', 'Apply core safety and climbing practices', 'Rate tree risk and choose mitigation'],
    modules: [
      { slug: 'pruning', title: 'Pruning', reading: '/arboriculture-operations/pruning', interactive: 'pruning-cuts' },
      { slug: 'tree-selection-and-planting', title: 'Tree Selection, Planting and Establishment', reading: '/arboriculture-operations/tree-selection-and-planting' },
      { slug: 'worker-safety-and-climbing', title: 'Tree Worker Safety and Climbing', reading: '/arboriculture-operations/worker-safety-and-climbing', interactive: 'rope-terms' },
      { slug: 'tree-risk-and-support', title: 'Tree Risk, Support and Lightning Protection', reading: '/arboriculture-operations/tree-risk-and-support', interactive: 'risk-matrix' },
      { slug: 'course-review', title: 'Course Review', quiz: '/arboriculture-operations/section-quiz', items: ['quiz'] },
    ],
  },
  {
    slug: 'urban-forestry', code: 'ARB105', title: 'Urban Forestry', color: '#4b5d2a', art: 'city',
    blurb: 'Managing urban forests and protecting trees during construction.',
    description: 'This course looks at trees as a shared community resource. It covers urban forest planning, inventories and equity, and how to protect trees before, during and after construction.',
    outcomes: ['Explain the benefits, costs and management of urban forests', 'Plan tree protection through each construction phase'],
    modules: [
      { slug: 'urban-forest-management', title: 'Urban Forest Management', reading: '/urban-forestry/urban-forest-management' },
      { slug: 'trees-and-construction', title: 'Trees and Construction', reading: '/urban-forestry/trees-and-construction' },
      { slug: 'course-review', title: 'Course Review', quiz: '/urban-forestry/section-quiz', items: ['quiz'] },
    ],
  },
];

export const COURSES: Course[] = COURSE_LIST.map(c => ({ ...c, modules: [...c.modules, SURVEY_MODULE] }));

export const findCourse = (slug: string) => COURSES.find(c => c.slug === slug);
export const moduleItems = (m: Module) => m.items ?? ITEM_KINDS;
export const itemHref = (c: Course, m: Module, k: ItemKind) => `/courses/${c.slug}/${m.slug}/${k}/`;

export function itemTitle(c: Course, m: Module, k: ItemKind): string {
  const n = c.modules.indexOf(m) + 1;
  const review = m.items?.length === 1;
  switch (k) {
    case 'introduction': return `Module ${n} Introduction: ${m.title}`;
    case 'video': return `Video Lecture: ${m.title}`;
    case 'reading': return `Reading: ${m.title}`;
    case 'interactive': return m.interactive && m.interactive !== 'legacy' && !m.practical ? `Interactive: ${ACTIVITY_TITLES[m.interactive]}` : `Interactive: ${m.title}`;
    case 'quiz': return review ? `${c.title} Review Quiz` : `Module ${n} Quiz: ${m.title}`;
    case 'survey': return 'Course Exit Survey';
  }
}

/** Every item in the course, in order, for previous/next navigation. */
export function flatItems(c: Course) {
  return c.modules.flatMap(m => moduleItems(m).map(k => ({ m, k, href: itemHref(c, m, k), title: itemTitle(c, m, k) })));
}

/** Modules with a quiz that has questions; these make up the gradebook. */
export const gradedModules = (c: Course, quizKeys: readonly string[]) => c.modules.filter(m => m.quiz && quizKeys.includes(m.quiz));
