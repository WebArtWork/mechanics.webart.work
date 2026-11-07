import { theoryByNumber } from './theory.catalog';
import { THEORIES } from './theory.data';
import { Lang, Theory } from './theory.interface';

export interface RelatedPart {
	/** The theory's title as written, e.g. "Force and Its Units". */
	text: string;
	/** Its slug when the number points to a theory. */
	slug?: string;
}

/** "Force and Its Units (#2); Moment of a Force (#10)" as separate parts, each linked when its number exists. */
export function relatedParts(text: string): RelatedPart[] {
	return text
		.split(/;\s*/)
		.filter(Boolean)
		.map((item) => {
			const match = /^(.*?)\s*\(#(\d+)\)\s*$/.exec(item);
			if (!match) return { text: item };
			return { text: match[1], slug: theoryByNumber(Number(match[2]))?.slug };
		});
}

export function langOf(code: string | undefined): Lang {
	return code === 'ua' ? 'ua' : 'en';
}

export function neighbours(theory: Theory): { prev?: Theory; next?: Theory } {
	const i = THEORIES.indexOf(theory);
	return { prev: THEORIES[i - 1], next: THEORIES[i + 1] };
}
