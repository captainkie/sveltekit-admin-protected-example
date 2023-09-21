import { NODE_ENV, API_URL, API_JWT_SECRET } from '$env/static/private';
import jwt from 'jsonwebtoken';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { message, setError, superValidate } from 'sveltekit-superforms/server';
import { loginSchema } from '@schema/auth/form';

export const load = (async (event) => {
	const form = await superValidate(event, loginSchema, { errors: false });
	return {
		form
	};
}) satisfies PageServerLoad;

export const actions = {
	login: async (event) => {
		const form = await superValidate(event, loginSchema);

		if (!form.valid) {
			return fail(400, { form });
		}

		// authenication use api & jwt
		const { username, password } = form.data;

		// call api
		const res = await fetch(`${API_URL}/auth/signin`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				username: username,
				password: password
			})
		});

		// connect server error or invalid response
		if (!res.ok) {
			let msg = '';
			if (res.status === 400) {
				setError(form, 'username', 'Username is incorrect');
				setError(form, 'password', 'Password is incorrect');
				msg = 'Invalid username & password or account status does not active';
			} else {
				msg = 'Sorry, service is not available, please try again later.';
			}

			return message(form, msg, {
				status: 400
			});
		}

		const data = await res.json();

		if (data.accessToken !== undefined) {
			// login success, then decryption jwt
			const jwtUser = jwt.verify(data.accessToken, API_JWT_SECRET);

			// check jwtUser is object
			if (typeof jwtUser === 'string') {
				setError(form, 'username', 'Username is incorrect');
				setError(form, 'password', 'Password is incorrect');

				return message(form, 'Invalid username & password or account status does not active', {
					status: 400
				});
			}

			// login successfull
			event.cookies.set('AuthorizationToken', `Bearer ${data.accessToken}`, {
				httpOnly: true,
				path: '/',
				secure: NODE_ENV === 'production',
				sameSite: 'strict',
				maxAge: jwtUser.exp
			});

			return { form };
		}
	}
} satisfies Actions;
