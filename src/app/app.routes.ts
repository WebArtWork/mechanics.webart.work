import { Routes } from '@angular/router';
import { buildRouteMeta } from '@wawjs/ngx-default';
import { authGuard, guestGuard } from './feature/auth/auth.guard';
import { companyProfile } from './feature/company/company.data';
import { THEORY_INDEX as THEORIES } from './feature/theory/theory.catalog';

const page = (path: string, pageName: string) => ({
	pageName,
	meta: buildRouteMeta(companyProfile, path),
});

export const routes: Routes = [
	{
		// the home page
		path: '',
		pathMatch: 'full',
		data: {
			pageName: 'Dashboard',
			meta: {
				...buildRouteMeta(companyProfile, '/'),
				title: companyProfile.title,
				titleSuffix: '',
			},
		},
		loadComponent: () =>
			import('./pages/dashboard/dashboard.component').then((m) => m.DashboardComponent),
	},
	{ path: 'dashboard', redirectTo: '' },
	{
		path: 'theory',
		children: [
			{
				path: '',
				pathMatch: 'full',
				data: page('/theory', 'Theory'),
				loadComponent: () => import('./pages/theory/theory.component').then((m) => m.TheoryComponent),
			},
			{
				path: 'print/short',
				data: { ...page('/theory/print/short', 'Short theories'), mode: 'short' },
				loadComponent: () =>
					import('./pages/theory-print/theory-print.component').then((m) => m.TheoryPrintComponent),
			},
			{
				path: 'print/full',
				data: { ...page('/theory/print/full', 'Full theories'), mode: 'full' },
				loadComponent: () =>
					import('./pages/theory-print/theory-print.component').then((m) => m.TheoryPrintComponent),
			},
			// one prerendered page per theory
			...THEORIES.map((theory) => ({
				path: theory.slug,
				data: { ...page(`/theory/${theory.slug}`, theory.title.en), theory: theory.slug },
				loadComponent: () =>
					import('./pages/theory-lesson/theory-lesson.component').then((m) => m.TheoryLessonComponent),
			})),
		],
	},
	{
		path: 'privacy',
		data: page('/privacy', 'Privacy'),
		loadComponent: () => import('./pages/privacy/privacy.component').then((m) => m.PrivacyComponent),
	},
	{
		path: 'support',
		data: page('/support', 'Support'),
		loadComponent: () => import('./pages/support/support.component').then((m) => m.SupportComponent),
	},
	{
		path: 'licenses',
		data: page('/licenses', 'Licenses'),
		loadComponent: () => import('./pages/licenses/licenses.component').then((m) => m.LicensesComponent),
	},
	{
		path: 'sign-in',
		canActivate: [guestGuard],
		data: page('/sign-in', 'Sign in'),
		loadComponent: () =>
			import('./pages/sign-in/sign-in.component').then((m) => m.SignInComponent),
	},
	{
		path: 'profile',
		canActivate: [authGuard],
		data: page('/profile', 'Profile'),
		loadComponent: () =>
			import('./pages/profile/profile.component').then((m) => m.ProfileComponent),
	},
	{
		path: '**',
		redirectTo: '',
	},
];
