import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import path from 'path';
import { loadEnv } from 'vite';
import fs from 'fs';

export default defineConfig(({ mode }) => {
	const isProduction = mode === 'production';
	const env = loadEnv(mode, process.cwd(), '');

	return {
		plugins: [sveltekit()],
		test: {
			include: ['src/**/*.{test,spec}.{js,ts}']
		},
		build: {
			commonjsOptions: {
				include: ['tailwind.config.js', 'node_modules/**']
			}
		},
		optimizeDeps: {
			include: ['tailwind-config', 'svelte-navigator']
		},
		resolve: {
			alias: {
				'tailwind-config': path.resolve(__dirname, './tailwind.config.js')
			}
		},
		server: {
			port: env.SERVER_PORT,
			cors: isProduction,
			strictPort: false,
			proxy: {},
			hmr: {
				protocol: 'ws',
				port: 3001
			}
		},
		preview: {
			port: env.PREVIEW_PORT,
			strictPort: false
		}
	};
});
