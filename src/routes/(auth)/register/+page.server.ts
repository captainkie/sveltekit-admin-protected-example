import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { message, setError, superValidate } from 'sveltekit-superforms/server';
import { registered } from '$lib/server/authentication/fetch';
import { registerSchema } from '@schema/auth/form';

export const load = (async (event) => {
	const form = await superValidate(event, registerSchema, { errors: false });
	return {
		form
	};
}) satisfies PageServerLoad;

export const actions = {
	default: async (event) => {
		const form = await superValidate(event, registerSchema);

		if (!form.valid) {
			return fail(400, { form });
		}

		const registerd = await registered(form.data, event);
		if (registerd.error) {
			setError(form, 'username', 'Username, Email already exists or service has gone away');
			setError(form, 'email', 'Username, Email already exists or service has gone away');
			return message(form, 'Username, Email already exists or service has gone away', {
				status: 400
			});
		}

		return message(form, 'registered');
	}
} satisfies Actions;
