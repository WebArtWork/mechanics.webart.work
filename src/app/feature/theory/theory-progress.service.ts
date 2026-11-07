import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID, Service, signal } from '@angular/core';

const STORAGE_KEY = 'mechanics_theory';

/** Which theories the reader marked as studied, by slug, kept in the browser. */
@Service()
export class TheoryProgressService {
	private readonly _isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
	readonly studied = signal<Record<string, boolean>>(this._load());

	isStudied(slug: string): boolean {
		return !!this.studied()[slug];
	}

	toggle(slug: string) {
		const next = { ...this.studied() };
		if (next[slug]) delete next[slug];
		else next[slug] = true;
		this.studied.set(next);
		if (!this._isBrowser) return;
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
		} catch {
			// storage full or blocked: the mark lasts for this visit only
		}
	}

	private _load(): Record<string, boolean> {
		if (!this._isBrowser) return {};
		try {
			const raw = localStorage.getItem(STORAGE_KEY);
			return raw ? (JSON.parse(raw) as Record<string, boolean>) : {};
		} catch {
			return {};
		}
	}
}
