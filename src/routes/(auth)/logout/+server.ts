import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async (event) => {
	const { cookies } = event;
	// remove the jwt token cookie
	cookies.delete('AuthorizationToken');

	throw redirect(303, '/');
};
