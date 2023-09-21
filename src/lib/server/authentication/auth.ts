import type { RequestEvent } from '@sveltejs/kit';
import { API_URL, API_JWT_SECRET } from '$env/static/private';
import jwt from 'jsonwebtoken';

export const authenticateUser = async (event: RequestEvent) => {
	const { cookies } = event;
	const userToken: string = cookies.get('AuthorizationToken')?.split(' ')[1] ?? '';

	if (!userToken) {
		return null;
	}

	if (userToken) {
		try {
			const jwtUser = jwt.verify(userToken, API_JWT_SECRET);
			if (typeof jwtUser === 'string') {
				return null;
			}

			const res = await fetch(`${API_URL}/users/${jwtUser.sub}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${userToken}`
				}
			});

			if (!res.ok) {
				return null;
			}

			const string = await res.text();
			const data = string === '' ? {} : JSON.parse(string);

			return data;
		} catch (error) {
			return null;
		}
	}
};
