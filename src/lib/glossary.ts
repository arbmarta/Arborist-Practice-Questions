// Glossary of key terms. The first time a term appears in a reading or module introduction it is shown as a
// bold keyword; clicking it opens a pop-up definition. To add a term, add an entry below: `forms` lists the
// spellings to match (case-insensitive, whole words), and `def` is the definition shown in the pop-up.

export type GlossaryEntry = { term: string; forms: string[]; def: string };

export const GLOSSARY: Record<string, GlossaryEntry> = {
  // Tree biology
  cambium: { term: 'Cambium', forms: ['cambium'], def: 'A thin layer of dividing cells between the bark and wood. It produces phloem toward the outside and xylem toward the inside, adding to stem and root diameter.' },
  xylem: { term: 'Xylem', forms: ['xylem'], def: 'Wood tissue that conducts water and dissolved minerals up from the roots. It also provides support and stores energy.' },
  phloem: { term: 'Phloem', forms: ['phloem'], def: 'Inner bark tissue that carries sugars and other products of photosynthesis throughout the tree.' },
  transpiration: { term: 'Transpiration', forms: ['transpiration'], def: 'Loss of water vapour from the tree, mainly through leaf stomata. It is a major driver of water movement up through the tree.' },
  mycorrhizae: { term: 'Mycorrhizae', forms: ['mycorrhizae', 'mycorrhiza', 'mycorrhizal'], def: 'Symbiotic associations between fungi and absorbing roots that help the tree take up water and nutrients.' },
  photosynthesis: { term: 'Photosynthesis', forms: ['photosynthesis'], def: 'The process that uses light energy to make glucose from carbon dioxide and water, releasing oxygen.' },
  respiration: { term: 'Respiration', forms: ['respiration'], def: 'The process that releases usable energy from stored carbohydrates, using oxygen.' },
  osmosis: { term: 'Osmosis', forms: ['osmosis'], def: 'Movement of water across a semipermeable membrane from higher water potential toward lower water potential.' },
  sapwood: { term: 'Sapwood', forms: ['sapwood'], def: 'The outer, functional xylem that conducts water and stores energy.' },
  heartwood: { term: 'Heartwood', forms: ['heartwood'], def: 'Older inner wood that no longer conducts water. It is often darker and continues to provide support.' },
  'primary-growth': { term: 'Primary growth', forms: ['primary growth'], def: 'Growth in length, produced at the growing points (apical meristems) in buds and root tips.' },
  'secondary-growth': { term: 'Secondary growth', forms: ['secondary growth'], def: 'Growth in girth, produced by the cambium.' },
  codit: { term: 'Compartmentalization (CODIT)', forms: ['compartmentalization', 'compartmentalize'], def: 'How a tree walls off injured and decayed wood rather than healing it. The CODIT model describes four walls that resist the spread of decay.' },
  'barrier-zone': { term: 'Barrier zone', forms: ['barrier zone'], def: 'Wall 4 of the CODIT model: a layer formed by the cambium after injury that separates new wood from injured or decayed wood.' },
  'apical-meristem': { term: 'Apical meristem', forms: ['apical meristem'], def: 'The growing point at the tip of a shoot or root, where cell division produces growth in length. A palm has a single primary apical meristem.' },
  taxonomy: { term: 'Taxonomy', forms: ['taxonomy'], def: 'The science of classifying organisms by their natural relationships, from domain down to species.' },
  genus: { term: 'Genus', forms: ['genus'], def: 'The taxonomic rank above species and the first word of a scientific name, e.g. Pinus in Pinus ponderosa.' },
  'specific-epithet': { term: 'Specific epithet', forms: ['specific epithet'], def: 'The second word of a scientific name, identifying the species within its genus, e.g. ponderosa in Pinus ponderosa.' },
  // Soils and nutrition
  'soil-texture': { term: 'Soil texture', forms: ['soil texture'], def: 'The relative proportions of sand, silt and clay in a soil.' },
  cec: { term: 'Cation exchange capacity (CEC)', forms: ['cation exchange capacity'], def: "A soil's ability to hold and exchange positively charged nutrient ions such as calcium, magnesium and potassium." },
  'bulk-density': { term: 'Bulk density', forms: ['bulk density'], def: 'The dry mass of soil per unit volume. Higher bulk density means less pore space and often indicates compaction.' },
  macropores: { term: 'Macropores', forms: ['macropores'], def: 'Large soil pores that drain freely after watering and fill with air.' },
  ph: { term: 'pH', forms: ['pH'], def: 'A logarithmic measure of acidity or alkalinity. 7 is neutral; each whole unit is a tenfold change.' },
  evapotranspiration: { term: 'Evapotranspiration', forms: ['evapotranspiration'], def: 'The total water leaving a site through evaporation from the soil plus transpiration from plants.' },
  chlorosis: { term: 'Chlorosis', forms: ['chlorosis', 'chlorotic'], def: 'Yellowing of leaves from a lack of chlorophyll, often caused by nutrient deficiency or root problems.' },
  'guaranteed-analysis': { term: 'Guaranteed analysis', forms: ['guaranteed analysis'], def: 'The N-P-K percentages on a fertilizer label: total nitrogen, available phosphate and soluble potash, by weight.' },
  'fertilizer-burn': { term: 'Fertilizer burn', forms: ['fertilizer burn'], def: 'Injury to roots or foliage caused by excess soluble salts from fertilizer.' },
  // Disorders and plant health care
  abiotic: { term: 'Abiotic', forms: ['abiotic'], def: 'Caused by non-living factors such as weather, soil conditions, chemicals or mechanical injury.' },
  biotic: { term: 'Biotic', forms: ['biotic'], def: 'Caused by living organisms such as insects, mites, fungi, bacteria, viruses or parasitic plants.' },
  symptom: { term: 'Symptom', forms: ['symptoms', 'symptom'], def: "The plant's response to a problem, such as wilting, dieback or chlorosis. Symptoms are often not diagnostic on their own." },
  sign: { term: 'Sign', forms: ['signs'], def: 'Physical evidence of the causal agent itself, such as fungal conks, insect galleries or frass. Signs can be diagnostic.' },
  vitality: { term: 'Vitality', forms: ['vitality'], def: "A tree's ability to overcome stress and thrive." },
  vigor: { term: 'Vigor', forms: ['vigor', 'vigour'], def: "A tree's genetic capacity to resist stress." },
  phc: { term: 'Plant health care (PHC)', forms: ['plant health care'], def: 'A holistic, preventive program for maintaining tree health, appearance and safety, rather than reacting to individual problems.' },
  ipm: { term: 'Integrated pest management (IPM)', forms: ['integrated pest management'], def: 'Managing pests by combining monitoring, action thresholds and cultural, biological, mechanical and chemical controls.' },
  'disease-triangle': { term: 'Disease triangle', forms: ['disease triangle'], def: 'Disease develops only when a susceptible host, a pathogen and a conducive environment occur together.' },
  // Operations
  'branch-collar': { term: 'Branch collar', forms: ['branch collar'], def: 'The swelling at the base of a branch where branch and trunk tissues overlap. Pruning cuts should be made just outside it.' },
  'branch-bark-ridge': { term: 'Branch bark ridge', forms: ['branch bark ridge'], def: 'The raised ridge of bark in the crotch between a branch and the trunk.' },
  'reduction-cut': { term: 'Reduction cut', forms: ['reduction cut'], def: 'A cut that shortens a stem back to a lateral at least one-third the diameter of the stem removed.' },
  'heading-cut': { term: 'Heading cut', forms: ['heading cut', 'heading cuts'], def: 'A cut to a bud, stub, or lateral too small to take over as the leader. Generally ill-advised on mature trees.' },
  'lion-tailing': { term: 'Lion tailing', forms: ['lion tailing'], def: 'Removing lower and interior branches so foliage is left only at the branch ends. Considered malpractice.' },
  topping: { term: 'Topping', forms: ['topping'], def: 'Reducing tree size with large heading cuts, leaving stubs. It leads to decay, weak regrowth and higher failure risk.' },
  pollarding: { term: 'Pollarding', forms: ['pollarding'], def: 'A training system that repeatedly removes sprouts back to established knobs (pollard heads) on a regular cycle.' },
  wll: { term: 'Working-load limit', forms: ['working-load limit', 'working load limit'], def: 'The maximum load equipment should carry in use: its breaking strength divided by the design factor.' },
  'tensile-strength': { term: 'Tensile strength', forms: ['tensile strength'], def: 'The load at which new rope or equipment breaks under tension.' },
  'residual-risk': { term: 'Residual risk', forms: ['residual risk'], def: 'The risk that remains after mitigation has been carried out.' },
  target: { term: 'Target', forms: ['target', 'targets'], def: 'People, property or activities that could be struck or disrupted if a tree or tree part fails.' },
  cabling: { term: 'Cabling', forms: ['cabling'], def: 'Installing flexible cables between stems or branches to limit their movement and reduce the chance of failure.' },
  // Urban forestry
  'critical-root-zone': { term: 'Critical root zone', forms: ['critical root zone'], def: 'The area of soil around a tree containing the roots needed for its health and stability.' },
  'tree-protection-zone': { term: 'Tree protection zone', forms: ['tree protection zone'], def: 'The area fenced off and protected from construction activity to preserve a tree.' },
  inventory: { term: 'Tree inventory', forms: ['inventories', 'inventory'], def: 'A systematic record of trees, typically species, size, condition and location, used to plan management.' },
  'canopy-mapping': { term: 'Canopy mapping', forms: ['canopy mapping'], def: 'Measuring tree canopy cover, usually from aerial or satellite imagery, to track it over time and across neighbourhoods.' },
};

const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\-]/g, '\\$&');
// Built on first use (at build time, on the server), so browsers never parse these patterns.
let MATCHERS: { id: string; re: RegExp }[] | null = null;
const matchers = () => MATCHERS ??= Object.entries(GLOSSARY).map(([id, g]) => ({
  id, re: new RegExp(`(?<![\\w-])(${g.forms.map(esc).join('|')})(?![\\w-])`, g.forms.includes('pH') ? '' : 'i'),
}));

// Tags whose text should never become a keyword (headings, links, form controls, navigation lists…).
const SKIP = new Set(['a', 'button', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'summary', 'label', 'select', 'option', 'textarea', 'script', 'style', 'code', 'legend', 'th']);
const VOID = new Set(['br', 'img', 'input', 'hr', 'meta', 'link', 'source', 'wbr', 'col', 'area', 'base', 'embed', 'track', 'param']);

/** Wraps the first occurrence of each glossary term in the page's text with a clickable keyword. */
export function linkTerms(html: string): string {
  const used = new Set<string>();
  const stack: { tag: string; skip: boolean }[] = [];
  return html.split(/(<[^>]+>)/).map(part => {
    if (part.startsWith('<')) {
      const m = part.match(/^<\s*(\/)?\s*([a-zA-Z0-9]+)/);
      if (!m || part.startsWith('<!')) return part;
      const tag = m[2].toLowerCase();
      if (m[1]) { // closing tag: pop back to its opener
        const i = stack.map(x => x.tag).lastIndexOf(tag);
        if (i >= 0) stack.length = i;
      } else if (!VOID.has(tag) && !part.endsWith('/>')) {
        stack.push({ tag, skip: SKIP.has(tag) || /class="[^"]*lesson-nav/.test(part) });
      }
      return part;
    }
    if (!part.trim() || stack.some(x => x.skip)) return part;
    let out = '', rest = part;
    for (;;) {
      let best: { id: string; index: number; text: string } | null = null;
      for (const { id, re } of matchers()) {
        if (used.has(id)) continue;
        const r = re.exec(rest);
        if (r && (!best || r.index < best.index)) best = { id, index: r.index, text: r[1] };
      }
      if (!best) return out + rest;
      used.add(best.id);
      out += rest.slice(0, best.index) + `<button type="button" class="gloss-term" data-term="${best.id}">${best.text}</button>`;
      rest = rest.slice(best.index + best.text.length);
    }
  }).join('');
}
