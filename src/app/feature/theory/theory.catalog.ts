import indexData from '../../../data/theory/theories-index.json';
import { TheoryGroup, TheoryIndexItem } from './theory.interface';

/**
 * Every theory's number, slug and title, in order. Small enough for the routes and the hub; the text
 * itself is in theory.data.ts, loaded only by the pages that show it. Both are generated from content/theories.
 */
export const THEORY_INDEX = indexData as TheoryIndexItem[];

/** Hub blocks, in display order; every theory number belongs to exactly one block. */
export const THEORY_GROUPS: TheoryGroup[] = [
	{ id: 'forces', label: 'Forces and vectors', from: 1, to: 9 },
	{ id: 'statics', label: 'Statics', from: 10, to: 20 },
	{ id: 'friction', label: 'Friction', from: 21, to: 25 },
	{ id: 'motion', label: 'Motion', from: 26, to: 30 },
	{ id: 'energy', label: 'Work, energy and momentum', from: 31, to: 36 },
	{ id: 'rotation', label: 'Rotational dynamics', from: 37, to: 40 },
	{ id: 'machines', label: 'Simple machines and gears', from: 41, to: 52 },
	{ id: 'drives', label: 'Drives and mechanisms', from: 53, to: 60 },
	{ id: 'strength', label: 'Strength of materials', from: 61, to: 76 },
	{ id: 'materials', label: 'Materials', from: 77, to: 80 },
	{ id: 'design', label: 'Machine design', from: 81, to: 91 },
	{ id: 'systems', label: 'Fluid power, engines and practice', from: 92, to: 100 },
];

export function groupOf(n: number): TheoryGroup {
	return THEORY_GROUPS.find((group) => n >= group.from && n <= group.to)!;
}

export function theoryByNumber(n: number): TheoryIndexItem | undefined {
	return THEORY_INDEX.find((item) => item.n === n);
}

export const THEORY_INTRO: string[] = [
	'Every theory has two versions. The short one gives the idea in a few minutes. The full one adds the origin, the key formulas, how to apply them, a worked example and the limits of the model.',
	'Read the short version first, then open Read more. Try the example by hand before you check the numbers.',
	'The formulas describe idealized cases. Check material strength, connections and safety margins before you build anything that carries a load.',
];
