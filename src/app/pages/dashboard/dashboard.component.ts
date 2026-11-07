import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../feature/auth/auth.service';
import { I18nService } from '../../feature/i18n/i18n.service';
import { TPipe } from '../../feature/i18n/t.pipe';
import { THEORY_GROUPS, groupOf } from '../../feature/theory/theory.catalog';
import { THEORIES } from '../../feature/theory/theory.data';
import { TheoryProgressService } from '../../feature/theory/theory-progress.service';
import { langOf } from '../../feature/theory/theory.util';

/**
 * The home page. A guest sees the landing: what the app teaches, a sample theory and a sign-in button.
 * A signed-in reader sees the dashboard: progress through the theories and the next one to read.
 */
@Component({
	imports: [RouterLink, TPipe],
	templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
	private readonly _auth = inject(AuthService);
	private readonly _progress = inject(TheoryProgressService);
	private readonly _i18n = inject(I18nService);

	protected readonly user = this._auth.user;
	protected readonly ready = computed(() => this.user() !== undefined);
	protected readonly isGuest = computed(() => this.user() === null);

	protected readonly total = THEORIES.length;
	protected readonly lang = computed(() => langOf(this._i18n.language()));
	protected readonly sample = THEORIES[0];

	protected readonly studiedCount = computed(() => THEORIES.filter((theory) => this._progress.isStudied(theory.slug)).length);
	protected readonly percent = computed(() => Math.round((this.studiedCount() / this.total) * 100));

	/** The first theory not yet studied; null when all are. */
	protected readonly next = computed(() => THEORIES.find((theory) => !this._progress.isStudied(theory.slug)) ?? null);
	protected readonly nextGroup = computed(() => {
		const next = this.next();
		return next ? groupOf(next.n).label : '';
	});

	/** Progress per hub block. */
	protected readonly blocks = computed(() =>
		THEORY_GROUPS.map((group) => {
			const items = THEORIES.filter((theory) => groupOf(theory.n) === group);
			return {
				id: group.id,
				label: group.label,
				done: items.filter((theory) => this._progress.isStudied(theory.slug)).length,
				total: items.length,
			};
		}),
	);
}
