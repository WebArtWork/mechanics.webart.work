import { afterNextRender, Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { I18nService } from '../../feature/i18n/i18n.service';
import { TPipe } from '../../feature/i18n/t.pipe';
import { THEORIES } from '../../feature/theory/theory.data';
import { FULL_KEYS } from '../../feature/theory/theory.interface';
import { langOf } from '../../feature/theory/theory.util';

/** Every theory in one document, short or full by the route's `mode`. */
@Component({
	imports: [RouterLink, TPipe],
	templateUrl: './theory-print.component.html',
})
export class TheoryPrintComponent {
	private readonly _i18n = inject(I18nService);
	protected readonly mode = inject(ActivatedRoute).snapshot.data['mode'] as 'short' | 'full';
	protected readonly theories = THEORIES;
	protected readonly keys = FULL_KEYS;
	protected readonly lang = computed(() => langOf(this._i18n.language()));

	constructor() {
		// opens the print dialog once the page is on screen
		afterNextRender(() => setTimeout(() => window.print(), 300));
	}

	protected print() {
		window.print();
	}
}
