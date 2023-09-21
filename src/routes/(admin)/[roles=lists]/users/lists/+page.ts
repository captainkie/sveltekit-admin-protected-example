import type { PageLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load = (async () => {
	throw redirect(303, `/admin/users/lists/1`);
}) satisfies PageLoad;
