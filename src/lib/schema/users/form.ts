import { z } from 'zod';

export const registerSchema = z
	.object({
		mode: z.string().min(1),
		id: z.string().default('generate'),
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
		role: z.string().min(1).default('guest'),
		status: z.string().default('false'),
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

export const changePasswordSchema = z
	.object({
		old_password: z
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
		confirm: z.string().min(1)
	})
	.refine((data) => data.password === data.confirm, {
		message: "Passwords don't match",
		path: ['confirm']
	});

export const deleteSchema = z.object({
	mode: z.any(),
	target: z.string().min(1),
	id: z.string().min(1)
});

export type registerSchema = typeof registerSchema;
export type changePasswordSchema = typeof changePasswordSchema;
export type deleteSchema = typeof deleteSchema;
