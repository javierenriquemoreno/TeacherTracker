import { resolve } from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	server: {
		proxy: {
			'/api': {
				target: 'http://localhost:8080',
				changeOrigin: true
			},
			'/user': {
				target: 'http://localhost:8080'
			}
		}
	},
	resolve: {
		alias: {
			'@': resolve(__dirname, './src'),
			'@apis': resolve(__dirname, './src/api/index'),
			'@assets': resolve(__dirname, './src/assets'),
			'@icons': resolve(__dirname, './src/assets/icons/index'),
			'@illustrations': resolve(__dirname, './src/assets/illustrations'),
			'@components': resolve(__dirname, './src/components'),
			'@hooks': resolve(__dirname, './src/hooks/index'),
			'@pages': resolve(__dirname, './src/pages/index'),
			'@sections': resolve(__dirname, './src/sections/index')
		}
	}
});