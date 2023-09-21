import { API_URL } from '$env/static/private';
import type { RequestEvent } from '@sveltejs/kit';
import { error } from '@sveltejs/kit';

export const registered = async (data: any, event: RequestEvent) => {
	const { cookies, fetch } = event;
	const userToken: string = cookies.get('AuthorizationToken')?.split(' ')[1] ?? '';

	const bodyData = {
		username: data.username,
		password: data.password,
		name: data.name,
		surname: data.surname,
		email: data.email
	};

	const res = await fetch(`${API_URL}/auth/signup`, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${userToken}`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(bodyData)
	});

	if (!res.ok) {
		return { error: res.status };
	}

	const string = await res.text();
	const result = string === '' ? {} : JSON.parse(string);
	return { result };
};

export const logout = async (event: RequestEvent) => {
	const { cookies, fetch } = event;
	const userToken: string = cookies.get('AuthorizationToken')?.split(' ')[1] ?? '';

	const res = await fetch(`${API_URL}/auth/logout`, {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${userToken}`,
			'Content-Type': 'application/json'
		}
	});

	if (!res.ok) {
		throw error(res.status, 'Could not logout');
	}

	const string = await res.text();
	const result = string === '' ? {} : JSON.parse(string);
	return { result };
};
