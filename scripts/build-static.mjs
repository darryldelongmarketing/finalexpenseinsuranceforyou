import { readFile, writeFile, mkdir, cp, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import config from '../site.config.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const source = path.join(root, 'site');
const output = path.join(root, 'dist');
const escape = value => String(value).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const origin = config.siteUrl.replace(/\/$/, '');
if (origin && !/^https?:\/\//.test(origin)) throw new Error('SITE_URL must begin with https:// or http://.');
if (!/^[A-Za-z0-9_-]{11}$/.test(config.videoId)) throw new Error('The YouTube video ID must be 11 characters.');
if (!/^tel:\+\d{10,15}$/.test(config.phoneHref)) throw new Error('The telephone link must use international tel: format.');
const values = {
  BRAND: escape(config.brand), PHONE: escape(config.phone),
  PHONE_HREF: escape(config.phoneHref), VIDEO_ID: escape(config.videoId),
  VIDEO_URL: escape('https://www.youtube.com/watch?v=' + config.videoId),
  POLICY_UPDATED: escape(config.policyUpdated), YEAR: escape(config.year),
};
function render(template, extras = {}) {
  return template.replace(/\{\{([A-Z_]+)\}\}/g, (_, key) => {
    const value = { ...values, ...extras }[key];
    if (value === undefined) throw new Error('Unknown template value: ' + key);
    return value;
  });
}
const header = render(await readFile(path.join(source, 'partials/header.html'), 'utf8'));
const footer = render(await readFile(path.join(source, 'partials/footer.html'), 'utf8'));
const pages = [
  { file: 'index.html', route: '/', title: 'Final Expense Insurance | ' + config.brand,
    description: 'Help your loved ones prepare for funeral costs and other final expenses. Call (833) 307-1006 to ask about final expense insurance options.' },
  { file: 'privacy-policy/index.html', route: '/privacy-policy/', title: 'Privacy Policy | ' + config.brand,
    description: 'How information is handled when you browse Final Expense For You, play the featured YouTube video, or place a telephone call.' },
  { file: '404.html', route: '/404.html', title: 'Page Not Found | ' + config.brand,
    description: 'Return to Final Expense For You to explore final expense insurance information.' },
];
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await cp(path.join(source, 'assets'), path.join(output, 'assets'), { recursive: true });
await cp(path.join(source, 'favicon.svg'), path.join(output, 'favicon.svg'));
for (const page of pages) {
  const canonical = origin ? origin + page.route : '';
  const robots = config.indexable && page.file !== '404.html' ? 'index, follow' : 'noindex, nofollow';
  const head = [
    '<meta charset="UTF-8">',
    '<meta name="viewport" content="width=device-width, initial-scale=1">',
    '<meta name="theme-color" content="#234e42">',
    '<meta name="referrer" content="strict-origin-when-cross-origin">',
    '<title>' + escape(page.title) + '</title>',
    '<meta name="description" content="' + escape(page.description) + '">',
    '<meta name="robots" content="' + robots + '">',
    canonical ? '<link rel="canonical" href="' + escape(canonical) + '">' : '',
    '<meta property="og:type" content="website">',
    '<meta property="og:site_name" content="' + escape(config.brand) + '">',
    '<meta property="og:title" content="' + escape(page.title) + '">',
    '<meta property="og:description" content="' + escape(page.description) + '">',
    canonical ? '<meta property="og:url" content="' + escape(canonical) + '">' : '',
    origin ? '<meta property="og:image" content="' + escape(origin) + '/assets/family-hero.webp">' : '',
    '<link rel="icon" href="/favicon.svg" type="image/svg+xml">',
    '<link rel="stylesheet" href="/assets/styles.css">',
    '<!-- Meta Pixel Code -->',
    '<script src="/assets/meta-pixel.js"></script>',
    '<!-- End Meta Pixel Code -->',
  ].filter(Boolean).join('\n');
  const html = render(await readFile(path.join(source, page.file), 'utf8'), { HEAD: head, HEADER: header, FOOTER: footer });
  if (/\{\{[A-Z_]+\}\}/.test(html)) throw new Error('Unrendered placeholder in ' + page.file);
  const target = path.join(output, page.file);
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, html);
}
await cp(path.join(source, '_headers'), path.join(output, '_headers'));
await cp(path.join(source, '_redirects'), path.join(output, '_redirects'));
await writeFile(path.join(output, 'robots.txt'), 'User-agent: *\n' +
  (config.indexable ? 'Allow: /\n' : 'Disallow: /\n') +
  (config.indexable && origin ? 'Sitemap: ' + origin + '/sitemap.xml\n' : ''));
if (origin) await writeFile(path.join(output, 'sitemap.xml'),
  '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' +
  pages.filter(page => page.file !== '404.html').map(page => '<url><loc>' + escape(origin + page.route) + '</loc></url>').join('') +
  '</urlset>\n');
console.log('Built three pages and local assets in dist/.');
