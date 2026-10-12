// Lesson HTML contains root-relative links/images (e.g. src="/soil-and-nutrition/..."); prefix them with the basePath.
const base = process.env.NEXT_PUBLIC_BASE_PATH || '';
export const withBase = (html: string) => html.replace(/(src|href)="\//g, `$1="${base}/`);
