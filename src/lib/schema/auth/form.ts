import { z } from 'zod';

export const loginSchema = z.object({
	username: z
		.string()
		.min(5)
		.max(30)
		.regex(/^[a-z0-9]+$/i),
	password: z
		.string()
		.min(8)
		.max(24)
		.regex(
			/^(?!.*\s)(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[~`!@#$%^&*()--+={}\[\]|\\:;"'<>,.?/_₹]).{8,24}$/,
			{
				message:
					'Password must be contain at least one uppercase letter, one lowercase letter, one number and one special character.'
			}
		)
});

export const registerSchema = z
	.object({
		username: z
			.string()
			.min(5)
			.max(30)
			.regex(/^[a-z0-9]+$/i),
		name: z.string().min(1),
		surname: z.string().min(1),
		email: z.string().email().min(7),
		password: z
			.string()
			.min(8)
			.max(24)
			.regex(
				/^(?!.*\s)(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[~`!@#$%^&*()--+={}\[\]|\\:;"'<>,.?/_₹]).{8,24}$/,
				{
					message:
						'Password must be contain at least one uppercase letter, one lowercase letter, one number and one special character.'
				}
			),
		confirm: z.string().min(1),
		privacy: z
			.boolean()
			.default(true)
			.refine((v) => v === true, {
				message: 'You must accept the privacy policy'
			})
	})
	.refine((data) => data.password === data.confirm, {
		message: "Passwords don't match",
		path: ['confirm']
	});

export type loginSchema = typeof loginSchema;
export type registerSchema = typeof registerSchema;
