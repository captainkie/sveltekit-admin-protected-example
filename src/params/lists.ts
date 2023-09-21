import type { ParamMatcher } from '@sveltejs/kit';
import { PUBLIC_ADMIN_PATH } from '$env/static/public';

export const match = ((param) => {
	const adminPath = PUBLIC_ADMIN_PATH;
  return adminPath.includes(param)
}) satisfies ParamMatcher;