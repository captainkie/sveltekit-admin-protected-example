import type { RequestHandler } from './$types';
import { error } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import jwt from 'jsonwebtoken';
import { API_URL, API_USER, API_CREDENTIALS, API_JWT_SECRET } from '$env/static/private';

export const POST = (async (event) => {
	const { params, request, fetch } = event;
	if (params.brand !== undefined) {
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

			const body = await request.json();

			// if body is object
			if (typeof body === 'object' && body.events !== undefined) {
				if (body.events.length && body.events[0].type === 'message') {
					// sync to api
					const bodyData = {
						brand: params.brand,
						provider: 'line',
						destination: body.destination,
						source_type: body.events[0].source.type,
						source_user_id: body.events[0].source?.userId ?? '',
						source_room_id: body.events[0].source?.roomId ?? '',
						source_group_id: body.events[0].source?.groupId ?? '',
						type: body.events[0].type,
						message: body.events[0].message.text,
						message_type: body.events[0].message.type,
						timestamp: Number(body.events[0].timestamp)
					};

					const res = await fetch(`${API_URL}/social-hooks`, {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
							Authorization: `Bearer ${data.accessToken}`
						},
						body: JSON.stringify(bodyData)
					});

					if (res.ok) {
						return json({ status: true, sync: true });
					}
				}
			}
		}
	}

	return json({ status: false, sync: false });
}) satisfies RequestHandler;
