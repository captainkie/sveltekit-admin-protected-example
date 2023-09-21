import type { RequestEvent } from "@sveltejs/kit";

export const handleLoginRedirect = async (event: RequestEvent) => {
	const redirectTo = event.url.pathname + event.url.search;	
	return `/login?redirectTo=${redirectTo}`;
}