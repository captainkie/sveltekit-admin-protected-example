import type { Actions, PageServerLoad } from './$types';
import { fail, error, redirect } from '@sveltejs/kit';
import { message, superValidate, setError } from 'sveltekit-superforms/server';
import { findByID } from '$lib/server/users/fetch';
import { changePasswordSchema } from '@schema/users/form';

export const load = (async (event) => {
	const { params, url } = event;
	const getItems = async () => {
		const item = await findByID(event, params?.id);

		return item;
	};

	// init form
	const form = await superValidate(event, changePasswordSchema, {
		id: 'form',
		errors: false
	});

	return {
		items: await getItems(),
		form
	};
}) satisfies PageServerLoad;

export const actions = {
	default: async (event) => {
		const form = await superValidate(event, changePasswordSchema);

		if (!form.valid) {
			return fail(400, { form });
		}

		// const registerd = await registered(form.data, event);
		// if (registerd.error) {
		// 	setError(form, 'username', 'Username already exists or service has gone away');
		// 	return message(form, 'Username already exists or service has gone away', {
		// 		status: 400
		// 	});
		// }

		return { form };
	}
} satisfies Actions;
