import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { I18nService } from '../../feature/i18n/i18n.service';
import { TPipe } from '../../feature/i18n/t.pipe';
import { THEORY_GROUPS, THEORY_INDEX as THEORIES, THEORY_INTRO, groupOf } from '../../feature/theory/theory.catalog';
import { TheoryProgressService } from '../../feature/theory/theory-progress.service';
import { langOf } from '../../feature/theory/theory.util';

/** The Theory hub: every theory in its block, with the two print-all buttons. */
@Component({
	imports: [RouterLink, TPipe],
	templateUrl: './theory.component.html',
})
export class TheoryComponent {
	private readonly _progress = inject(TheoryProgressService);
	private readonly _i18n = inject(I18nService);

	protected readonly intro = THEORY_INTRO;
	protected readonly total = THEORIES.length;
	protected readonly studiedCount = computed(() => THEORIES.filter((theory) => this._progress.isStudied(theory.slug)).length);

	protected readonly groups = computed(() => {
		const lang = langOf(this._i18n.language());
		return THEORY_GROUPS.map((group) => ({
			...group,
			cards: THEORIES.filter((theory) => groupOf(theory.n) === group).map((theory) => ({
				n: theory.n,
				slug: theory.slug,
				title: theory.title[lang],
				studied: this._progress.isStudied(theory.slug),
			})),
		}));
	});
}
