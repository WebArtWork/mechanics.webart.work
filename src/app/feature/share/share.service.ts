import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID, Service, signal } from '@angular/core';
import { Router } from '@angular/router';
import { companyProfile } from '../company/company.data';

/**
 * Shares the current page by its public website URL.
 */
@Service()
export class ShareService {
	private readonly _router = inject(Router);
	private readonly _document = inject(DOCUMENT);
	private readonly _isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
	private _copiedTimer?: ReturnType<typeof setTimeout>;

	/** True for a moment after the link was copied, where no share sheet exists (most desktop browsers). */
	readonly copied = signal(false);

	/** The public URL of the page on screen, query included (a shared position keeps its ?fen=). */
	url(): string {
		return companyProfile.siteUrl + this._router.url;
	}

	/** Call straight from the click: browsers allow sharing and copying only during the tap itself. */
	share() {
		if (!this._isBrowser) return;
		const url = this.url();
		const title = this._document.title;
		if (navigator.share) {
			// closing the sheet is a choice, not a failure; anything else falls back to copying
			navigator.share({ title, url }).catch((error) => !_isCancel(error) && this._copy(url));
		} else {
			this._copy(url);
		}
	}

	private _copy(url: string) {
		const done = () => {
			this.copied.set(true);
			clearTimeout(this._copiedTimer);
			this._copiedTimer = setTimeout(() => this.copied.set(false), 2000);
		};
		navigator.clipboard.writeText(url).then(done, () => _legacyCopy(this._document, url) && done());
	}

}

function _isCancel(error: unknown): boolean {
	return (error as { name?: string })?.name === 'AbortError';
}

/** For browsers that refuse the Clipboard API (insecure origin, embedded views). */
function _legacyCopy(document: Document, text: string): boolean {
	const field = document.createElement('textarea');
	field.value = text;
	field.setAttribute('readonly', '');
	field.style.position = 'fixed';
	field.style.opacity = '0';
	document.body.append(field);
	field.select();
	try {
		return document.execCommand('copy');
	} catch {
		return false;
	} finally {
		field.remove();
	}
}
