// Builds src/data/theory/theories.json from content/theories/NNN.md.
// Each file: "## N. English title / Ukrainian title", then four sections:
// "### EN — Short", "### EN — Detailed", "### UA — Коротко", "### UA — Детально".
// Detailed sections are bullet lists of "- **Label:** text". Run: npm run theories:import
import { readdirSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const source = join(root, 'content', 'theories');
const target = join(root, 'src', 'data', 'theory', 'theories.json');

const KEYS = ['origin', 'core', 'components', 'apply', 'example', 'limits', 'related'];

function bullets(text, file, lang) {
	const items = text
		.split('\n')
		.filter((line) => line.startsWith('- '))
		.map((line) => {
			const match = /^- \*\*(.+?):\*\*\s*(.*)$/.exec(line);
			if (!match) throw new Error(`${file} ${lang}: bad bullet: ${line.slice(0, 60)}`);
			return { label: match[1], text: match[2].trim() };
		});
	if (items.length !== KEYS.length) throw new Error(`${file} ${lang}: expected ${KEYS.length} bullets, got ${items.length}`);
	return items;
}

const files = readdirSync(source).filter((name) => /^\d{3}\.md$/.test(name)).sort();
const theories = files.map((file) => {
	const raw = readFileSync(join(source, file), 'utf8').replace(/\r\n/g, '\n');
	const head = /^## (\d+)\. (.+?) \/ (.+)$/m.exec(raw);
	if (!head) throw new Error(`${file}: no title line`);
	const n = Number(head[1]);
	if (n !== Number(file.slice(0, 3))) throw new Error(`${file}: number mismatch`);
	const parts = raw.split(/^### /m).slice(1);
	if (parts.length !== 4) throw new Error(`${file}: expected 4 sections`);
	const body = (part) => part.slice(part.indexOf('\n') + 1).trim();
	const [enShort, enFull, uaShort, uaFull] = parts.map(body);
	const labels = { en: bullets(enFull, file, 'en'), ua: bullets(uaFull, file, 'ua') };
	const pick = (lang) => Object.fromEntries(labels[lang].map((item, i) => [KEYS[i], item.text]));
	return {
		n,
		slug: String(n).padStart(3, '0') + '-' + head[2].toLowerCase().replace(/['’]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 48).replace(/-$/, ''),
		title: { en: head[2].trim(), ua: head[3].trim() },
		short: { en: enShort, ua: uaShort },
		labels: { en: labels.en.map((i) => i.label), ua: labels.ua.map((i) => i.label) },
		full: { en: pick('en'), ua: pick('ua') },
	};
});

mkdirSync(dirname(target), { recursive: true });
writeFileSync(target, JSON.stringify(theories, null, '\t') + '\n');
// The light index (number, slug, title) is what routes and the hub need; the text loads with the pages.
writeFileSync(
	join(dirname(target), 'theories-index.json'),
	JSON.stringify(
		theories.map(({ n, slug, title }) => ({ n, slug, title })),
		null,
		'\t',
	) + '\n',
);
console.log(`Wrote ${theories.length} theories to ${target}`);
