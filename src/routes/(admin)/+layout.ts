import { browser } from '$app/environment';
import '$lib/i18n';
import { locale, waitLocale } from 'svelte-i18n';
import type { LayoutLoad } from './$types';

export const load = (async () => {
	if (browser) {
		// console.log(window.navigator.language);
		// locale.set('th')
	}
	await waitLocale();
}) satisfies LayoutLoad;
