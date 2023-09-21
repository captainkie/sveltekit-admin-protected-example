import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/kit/vite';
import path from 'path';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter(),
		alias: {
			'@components': path.resolve('./src/lib/components'),
			'@layouts': path.resolve('./src/lib/layouts'),
			'@utils': path.resolve('./src/lib/utils'),
			'@stores': path.resolve('./src/lib/stores'),
			'@schema': path.resolve('./src/lib/schema')
		},
		csrf: {
			checkOrigin: false
		}
	}
};

export default config;
