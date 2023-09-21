import type { PageServerLoad } from './$types';
import { findAll } from '$lib/server/users/fetch';

const pageLimit = 10;

export const load = (async (event) => {
	const { params, url } = event;
	const getItems = async () => {
		// paginate
		const page = Number(params.page);
		const limit = url.searchParams.get('limit') || pageLimit;
		// filters
		const q = url.searchParams.get('q') || '';
		const filters: any = {};

		if (q !== '') {
			filters['name'] = filters['surname'] = filters['email'] = q;
		}

		const item = await findAll(event, page, Number(limit), filters);

		return item;
	};

	return {
		items: await getItems(),
		limit: url.searchParams.get('limit') || pageLimit
	};
}) satisfies PageServerLoad;
