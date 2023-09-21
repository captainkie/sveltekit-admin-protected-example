import type { LayoutServerLoad } from './$types';

export const load = (async (event) => {
	return {
		userProfile: event.locals.user
	};
}) satisfies LayoutServerLoad;
