import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
	{
		// Depends on the signed-in user, which only exists in the browser.
		path: 'profile',
		renderMode: RenderMode.Client,
	},
	{
		// Opens the print dialog on load, which only the browser can do.
		path: 'theory/print/:mode',
		renderMode: RenderMode.Client,
	},
	{
		path: '**',
		renderMode: RenderMode.Prerender,
	},
];
