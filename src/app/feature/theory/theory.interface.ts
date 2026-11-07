export type Lang = 'en' | 'ua';

/** Text in both languages. */
export type Bilingual<T = string> = Record<Lang, T>;

/** The seven parts of a full theory, in display order. */
export const FULL_KEYS = ['origin', 'core', 'components', 'apply', 'example', 'limits', 'related'] as const;
export type FullKey = (typeof FULL_KEYS)[number];

/** One theory as generated from content/theories by tools/theory/import-md.mjs. */
export interface Theory {
	n: number;
	slug: string;
	title: Bilingual;
	/** The short version: one idea in a few minutes. */
	short: Bilingual;
	/** The label of each part of the full version, per language, in FULL_KEYS order. */
	labels: Bilingual<string[]>;
	/** The full version: the parts in FULL_KEYS order. */
	full: Bilingual<Record<FullKey, string>>;
}

/** What the routes and the hub need of a theory; the text is in Theory. */
export interface TheoryIndexItem {
	n: number;
	slug: string;
	title: Bilingual;
}

export interface TheoryGroup {
	id: string;
	label: string;
	/** First and last theory number in the block. */
	from: number;
	to: number;
}
