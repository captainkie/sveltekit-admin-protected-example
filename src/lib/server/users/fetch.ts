import { API_URL } from '$env/static/private';
import type { RequestEvent } from '@sveltejs/kit';
import { error } from '@sveltejs/kit';
import qs from 'qs';

export const findAll = async (event: RequestEvent, page?: number, limit?: number, search?: any) => {
	const { cookies, fetch } = event;
	const userToken: string = cookies.get('AuthorizationToken')?.split(' ')[1] ?? '';

	const params = {
		page: page,
		limit: limit,
		filters: search
	};

	const res = await fetch(`${API_URL}/users/?${qs.stringify(params)}`, {
		headers: {
			Authorization: `Bearer ${userToken}`
		}
	});

	if (!res.ok) {
		throw error(res.status, 'Could not get items');
	}

	const string = await res.text();
	const item = string === '' ? {} : JSON.parse(string);

	return item;
};

export const findByID = async (event: RequestEvent, id: string) => {
	const { cookies, fetch } = event;
	const userToken: string = cookies.get('AuthorizationToken')?.split(' ')[1] ?? '';

	const res = await fetch(`${API_URL}/users/${id}`, {
		headers: {
			Authorization: `Bearer ${userToken}`
		}
	});

	if (!res.ok) {
		throw error(res.status, 'Could not get items');
	}

	const string = await res.text();
	const item = string === '' ? {} : JSON.parse(string);

	return item;
};

export const stores = async (mode: string, data: any, event: RequestEvent) => {
	const { cookies, fetch } = event;
	const userToken: string = cookies.get('AuthorizationToken')?.split(' ')[1] ?? '';

	const { id } = data;
	const target = mode === 'add' ? `${API_URL}/auth/signup` : `${API_URL}/users/${id}`;

	const bodyData =
		mode === 'add'
			? {
					username: data.username,
					password: data.password,
					name: data.name,
					surname: data.surname,
					email: data.email
			  }
			: {
					name: data.name,
					surname: data.surname,
					role: data.role,
					status: data.status === 'true' ? true : false
			  };

	const res = await fetch(`${target}`, {
		method: mode === 'add' ? 'POST' : 'PATCH',
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

export const deleted = async (data: any, event: RequestEvent) => {
	const { cookies, fetch } = event;
	const userToken: string = cookies.get('AuthorizationToken')?.split(' ')[1] ?? '';

	const { id, target } = data;

	const res = await fetch(`${API_URL}/${target}/${id}`, {
		method: 'DELETE',
		headers: {
			Authorization: `Bearer ${userToken}`,
			'Content-Type': 'application/json'
		}
	});

	if (!res.ok) {
		return { error: res.status };
	}

	const string = await res.text();
	const result = string === '' ? {} : JSON.parse(string);

	return { result };
};
