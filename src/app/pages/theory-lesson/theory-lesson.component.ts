import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { I18nService } from '../../feature/i18n/i18n.service';
import { TPipe } from '../../feature/i18n/t.pipe';
import { groupOf } from '../../feature/theory/theory.catalog';
import { THEORIES } from '../../feature/theory/theory.data';
import { FULL_KEYS } from '../../feature/theory/theory.interface';
import { TheoryProgressService } from '../../feature/theory/theory-progress.service';
import { langOf, neighbours, relatedParts } from '../../feature/theory/theory.util';

/** One theory, picked by the route's `theory` data: the short version, then the full one under Read more. */
@Component({
	imports: [RouterLink, TPipe],
	templateUrl: './theory-lesson.component.html',
})
export class TheoryLessonComponent {
	private readonly _slug = inject(ActivatedRoute).snapshot.data['theory'] as string;
	private readonly _progress = inject(TheoryProgressService);
	private readonly _i18n = inject(I18nService);

	protected readonly theory = THEORIES.find((item) => item.slug === this._slug)!;
	protected readonly group = groupOf(this.theory.n);
	protected readonly near = neighbours(this.theory);
	protected readonly keys = FULL_KEYS;

	protected readonly lang = computed(() => langOf(this._i18n.language()));
	protected readonly expanded = signal(false);
	/** Which version a print click asked for; the page shows exactly that one while printing. */
	protected readonly printing = signal<'short' | 'full' | null>(null);
	protected readonly showFull = computed(() => this.printing() === 'full' || (this.expanded() && this.printing() !== 'short'));
	protected readonly studied = computed(() => this._progress.isStudied(this._slug));

	protected readonly related = computed(() => relatedParts(this.theory.full[this.lang()].related));

	protected toggleStudied() {
		this._progress.toggle(this._slug);
	}

	protected print(mode: 'short' | 'full') {
		this.printing.set(mode);
		const done = () => {
			this.printing.set(null);
			window.removeEventListener('afterprint', done);
		};
		window.addEventListener('afterprint', done);
		// let the page render the chosen version first
		setTimeout(() => window.print(), 50);
	}
}
