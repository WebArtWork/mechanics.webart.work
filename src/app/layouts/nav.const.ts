import { IconName } from '../components/icon/icon.data';

export interface NavLink {
	label: string;
	path: string;
	icon: IconName;
	/** URL prefixes that mark this link as current; defaults to `path`. */
	matches?: string[];
}

export const NAV_LINKS: NavLink[] = [
	{ label: 'Home', path: '/', icon: 'library', matches: ['/'] },
	{ label: 'Theory', path: '/theory', icon: 'study' },
];
