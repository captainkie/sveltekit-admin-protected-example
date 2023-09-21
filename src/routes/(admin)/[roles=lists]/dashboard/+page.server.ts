import type { PageServerLoad } from './$types';
import { findAll } from '$lib/server/brands/fetch';

export const load = (async (event) => {
	const { params, url } = event;
	const getBrands = async () => {
		const item = await findAll(event);

		return item;
	};

	return {
		brands: await getBrands()
	};
}) satisfies PageServerLoad;
