// USDA soil texture classes. Polygons are in (sand %, clay %) coordinates; silt = 100 − sand − clay.
// Boundaries follow the USDA class definitions (e.g. clay loam: 27–40% clay, 20–45% sand).
export type Texture = { name: string; poly: [number, number][]; color: string; label?: [number, number] };

export const TEXTURES: Texture[] = [
  { name: 'Sand', poly: [[100, 0], [85, 0], [90, 10]], color: '#f3e3b5', label: [92, 3] },
  { name: 'Loamy sand', poly: [[85, 0], [70, 0], [85, 15], [90, 10]], color: '#ead39a', label: [82, 6] },
  { name: 'Sandy loam', poly: [[70, 0], [50, 0], [43, 7], [52, 7], [52, 20], [80, 20], [85, 15]], color: '#e3c88f' },
  { name: 'Loam', poly: [[43, 7], [52, 7], [52, 20], [45, 27], [23, 27]], color: '#cfb58a' },
  { name: 'Silt loam', poly: [[50, 0], [20, 0], [8, 12], [0, 12], [0, 27], [23, 27]], color: '#d9d2b4' },
  { name: 'Silt', poly: [[20, 0], [0, 0], [0, 12], [8, 12]], color: '#e6e2cc' },
  { name: 'Sandy clay loam', poly: [[52, 20], [80, 20], [65, 35], [45, 35], [45, 27]], color: '#c9a67a' },
  { name: 'Clay loam', poly: [[45, 27], [45, 40], [20, 40], [20, 27]], color: '#b99a74' },
  { name: 'Silty clay loam', poly: [[20, 27], [20, 40], [0, 40], [0, 27]], color: '#c3b394' },
  { name: 'Sandy clay', poly: [[45, 35], [65, 35], [45, 55]], color: '#b48c66' },
  { name: 'Silty clay', poly: [[20, 40], [0, 60], [0, 40]], color: '#ad9a7d' },
  { name: 'Clay', poly: [[45, 40], [45, 55], [0, 100], [0, 60], [20, 40]], color: '#9d7f5f' },
];

// Rule-based classifier (USDA definitions); used for clicks, sliders and quiz grading.
export function classify(sand: number, clay: number): string {
  const silt = 100 - sand - clay;
  if (silt + 1.5 * clay < 15) return 'Sand';
  if (silt + 2 * clay < 30) return 'Loamy sand';
  if (clay >= 40) return sand > 45 ? 'Sandy clay' : silt >= 40 ? 'Silty clay' : 'Clay';
  if (clay >= 35 && sand > 45) return 'Sandy clay';
  if (clay >= 27) return sand > 45 ? 'Sandy clay loam' : sand > 20 ? 'Clay loam' : 'Silty clay loam';
  if (clay >= 20 && silt < 28 && sand > 45) return 'Sandy clay loam';
  if (silt >= 80 && clay < 12) return 'Silt';
  if (silt >= 50) return 'Silt loam';
  if (clay >= 7 && sand <= 52 && silt >= 28) return 'Loam';
  return 'Sandy loam';
}

export function centroid(poly: [number, number][]): [number, number] {
  let a = 0, x = 0, y = 0;
  for (let i = 0; i < poly.length; i++) {
    const [x0, y0] = poly[i], [x1, y1] = poly[(i + 1) % poly.length];
    const c = x0 * y1 - x1 * y0; a += c; x += (x0 + x1) * c; y += (y0 + y1) * c;
  }
  return [x / (3 * a), y / (3 * a)];
}
