import type { Actions, PageServerLoad } from './$types';
import { fail, error } from '@sveltejs/kit';
import { superValidate, setError } from 'sveltekit-superforms/server';
import { findByID, stores, deleted } from '$lib/server/users/fetch';
import { registerSchema, deleteSchema } from '@schema/users/form';

export const load = (async (event) => {
	const { params } = event;
	const mode = params.stores === 'add' ? 'add' : 'edit';

	const ids = params.stores.split('/');

	if (ids[0] !== 'add' && ids[0] !== 'edit') {
		throw error(404, 'Not found');
	} else {
		if (params.stores.includes('edit')) {
			if (ids.length < 2 || ids.length > 2) {
				throw error(404, 'Not found');
			}
		}
	}

	// fetch data from api
	const getItem = async () => {
		if (mode === 'add') {
			return {};
		} else {
			const item = await findByID(event, ids[1]);
			return item;
		}
	};

	const item = await getItem();

	// init store form
	const registerStoreForm = await superValidate(event, registerSchema, {
		id: 'registerStoreForm',
		errors: false
	});

	registerStoreForm.data = {
		mode: mode,
		id: item._id ?? 'generated',
		username: item.username ?? '',
		name: item.name ?? '',
		surname: item.surname ?? '',
		email: item.email ?? '',
		password: mode === 'add' ? '' : 'UpdatePass@1234',
		confirm: mode === 'add' ? '' : 'UpdatePass@1234',
		role: item.role ?? 'guest',
		privacy: true,
		status: item.status !== undefined ? item.status.toString() : 'false'
	};

	// init delete form
	const deleteForm = await superValidate(event, deleteSchema, {
		id: 'deleteForm',
		errors: false
	});

	deleteForm.data = {
		mode: 'delete',
		target: 'users',
		id: item._id ?? ''
	};

	return {
		mode: mode,
		item: item,
		registerStoreForm,
		deleteForm
	};
}) satisfies PageServerLoad;

export const actions = {
	registerStore: async (event) => {
		const registerStoreForm = await superValidate(event, registerSchema, {
			id: 'registerStoreForm'
		});

		if (!registerStoreForm.valid) {
			return fail(400, { registerStoreForm });
		}

		const { mode } = registerStoreForm.data;
		const updated = await stores(mode, registerStoreForm.data, event);

		if (updated !== undefined) {
			if ('error' in updated && updated.error === 500) {
				setError(
					registerStoreForm,
					'username',
					'Username, Email already exists or service has gone away'
				);
				setError(
					registerStoreForm,
					'email',
					'Username, Email already exists or service has gone away'
				);

				return fail(400, { registerStoreForm });
			}

			if (mode === 'add') {
				registerStoreForm.data.id = 'add-success';
				return { registerStoreForm };
			}
		}

		return { registerStoreForm };
	},
	deleteItem: async (event) => {
		const deleteForm = await superValidate(event, deleteSchema, {
			id: 'deleteForm'
		});

		if (!deleteForm.valid) {
			return fail(400, {
				deleteForm
			});
		}

		const updated = await deleted(deleteForm.data, event);
		if (updated !== undefined) {
			if ('error' in updated && updated.error === 500) {
				return fail(400, { deleteForm });
			}

			return { deleteForm };
		}

		return { deleteForm };
	}
} satisfies Actions;
