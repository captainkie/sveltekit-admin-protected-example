import '$lib/i18n';
import { locale, waitLocale } from 'svelte-i18n';
import type { LayoutLoad } from './$types';
import { browser } from '$app/environment';

export const load = (async () => {
	if (browser) {
		locale.set('en');
	}

	await waitLocale();

	return {};
}) satisfies LayoutLoad;
