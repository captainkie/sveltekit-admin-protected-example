import type { Handle } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { authenticateUser } from '$lib/server/authentication/auth';
import { handleLoginRedirect } from '$lib/utils/redirect';
import { ADMIN_DEFAULT_LANG } from '$env/static/private';

const handleDetectLocale = (async ({ event, resolve }) => {
	return resolve(event, {
		transformPageChunk: ({ html }) => html.replace('%lang%', ADMIN_DEFAULT_LANG)
	});
}) satisfies Handle;

const handleAuthenticate = (async ({ event, resolve }) => {
	// get login user cookies
	event.locals.user = await authenticateUser(event);
	return resolve(event);
}) satisfies Handle;

const handleProtected = (async ({ event, resolve }) => {
	// get login user cookies
	event.locals.user = await authenticateUser(event);
	const redirectTo = await handleLoginRedirect(event);

	// =========== not logged =========== //
	// not logged & protected route
	if (!event.locals.user && event.route.id?.includes('(admin)')) {
		// not logged redirect to login page
		if (!event.locals.user) {
			throw redirect(303, `${redirectTo}`);
		}
	}

	// =========== logged =========== //
	// logged redirect to dashboard page
	if (event.locals.user && event.route.id === '/') {
		// redirect case role admin
		if (['superadmin', 'admin', 'management'].includes(event.locals.user.role)) {
			throw redirect(303, `/admin/dashboard`);
		}

		if (['guest'].includes(event.locals.user.role)) {
			throw redirect(303, `/access-denied`);
		}
	}

	// after logged redirect to endpoint
	if (event.locals.user && event.route.id === '/(auth)/login') {
		if (['superadmin', 'admin', 'management'].includes(event.locals.user.role)) {
			throw redirect(303, `admin/dashboard`);
		}

		if (['guest'].includes(event.locals.user.role)) {
			throw redirect(303, `/access-denied`);
		}
	}

	// check role
	if (event.locals.user && event.route.id?.includes('(admin)')) {
		if (!['superadmin', 'admin', 'management'].includes(event.locals.user.role)) {
			throw redirect(303, `/access-denied`);
		}
	}

	return await resolve(event);
}) satisfies Handle;

const handlePerformance = (async ({ event, resolve }) => {
	const route: URL = event.url;
	const start: number = performance.now();
	const response: Response = await resolve(event);
	const end: number = performance.now();
	const responseTime: number = end - start;

	if (responseTime > 2000) {
		console.log(`performance speed => 🐢 page: ${route} took ${responseTime.toFixed(2)} ms`);
	}

	if (responseTime < 1000) {
		console.log(`performance speed => 🚀 page: ${route} took ${responseTime.toFixed(2)} ms`);
	}

	return response;
}) satisfies Handle;

const handleAllowedCors = (async ({ event, resolve }) => {
	// Apply CORS header for API routes
	if (event.url.pathname.startsWith('/api')) {
		// Required for CORS to work
		if (event.request.method === 'OPTIONS') {
			return new Response(null, {
				headers: {
					'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
					'Access-Control-Allow-Origin': '*',
					'Access-Control-Allow-Headers': '*'
				}
			});
		}
	}

	const response = await resolve(event);
	if (event.url.pathname.startsWith('/api')) {
		response.headers.append('Access-Control-Allow-Origin', `*`);
	}

	return response;
}) satisfies Handle;

export const handle = sequence(
	handleDetectLocale,
	handleAuthenticate,
	handleProtected,
	handleAllowedCors,
	handlePerformance
);
