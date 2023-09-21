// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
type User = {
	_id: string;
	username: string;
	password: string;
	name: string;
	surname: string;
	status: boolean;
	role: string;
	__v: number;
	refreshToken: string;
};

type ExtractProps<T> = InstanceType<T>['$props'];

type DotPrefix<T extends string> = T extends '' ? '' : `.${T}`;

type DotNestedKeys<T> = (
	T extends object
		? {
				[K in Exclude<keyof T, symbol>]: `${K}${DotPrefix<DotNestedKeys<T[K]>>}`;
		  }[Exclude<keyof T, symbol>]
		: ''
) extends infer D
	? Extract<D, string>
	: never;

declare global {
	namespace App {
		interface Locals {
			user: User | null;
		}
		// interface Error {}
		// interface PageData {}
		// interface Platform {}
	}
}

declare module '@ckeditor/ckeditor5-build-classic';
declare module '@ckeditor/ckeditor5-build-balloon-block';
declare module '@ckeditor/ckeditor5-build-balloon';
declare module '@ckeditor/ckeditor5-build-decoupled-document';
declare module '@ckeditor/ckeditor5-build-inline';
declare module '@woden/svelte-simplebar';
declare module 'svelte-apexcharts';

declare module 'tailwindcss/lib/util/color' {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
	const parseColor = (value: string): { color: Array<string> } => {};
	export { parseColor };
}

declare module 'tailwind-config' {
	const config: Config;
	export default config;
}

export {};
