import type { RequestHandler } from './$types';
import { error } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import jwt from 'jsonwebtoken';
import { API_URL, API_TOKEN, API_USER, API_CREDENTIALS, API_JWT_SECRET } from '$env/static/private';

export const GET = (async (event) => {
	const { params, url, fetch } = event;
	const token = url.searchParams.get('token') ?? '';

	if (token !== '' && token === API_TOKEN) {
		// logged to api
		const res = await fetch(`${API_URL}/auth/signin`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				username: API_USER,
				password: API_CREDENTIALS
			})
		});

		if (!res.ok) {
			throw error(400, 'Incorrect credentials');
		}

		const data = await res.json();

		if (data.accessToken !== undefined) {
			// login success, then decryption jwt
			const jwtUser = jwt.verify(data.accessToken, API_JWT_SECRET);

			if (typeof jwtUser === 'string') {
				throw error(400, 'Opps!!, something went wrong');
			}

			// get brands active list
			const res = await fetch(`${API_URL}/brands/`, {
				headers: {
					Authorization: `Bearer ${data.accessToken}`
				}
			});

			if (!res.ok) {
				throw error(res.status, 'Could not get items');
			}

			const string = await res.text();
			const items = string === '' ? {} : JSON.parse(string);

			if ('brands' in items && items.brands.length > 0) {
				const syncAll = async (brands: any) => {
					let sync = [];
					sync = await Promise.all(
						brands.map(async (brand: any) => {
							if (brand.status) {
								// get social active by brand
								const res = await fetch(`${API_URL}/sync/queue/${brand.slug}`, {
									method: 'POST',
									headers: {
										'Content-Type': 'application/json',
										Authorization: `Bearer ${data.accessToken}`
									}
								});

								if (!res.ok) {
									return { brand: brand.name, status: true, sync: false };
								}

								return { brand: brand.name, status: true, sync: true };
							} else {
								return { brand: brand.name, status: false, sync: false };
							}
						})
					);

					return Promise.resolve(sync);
				};

				const call = await syncAll(items.brands);

				return json(call);
			} else {
				return json({ status: false, sync: false });
			}
		}
	}

	return new Response(String('Access Denied'));
}) satisfies RequestHandler;
