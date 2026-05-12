import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	// Ottimizza Three.js per il dev server — evita re-import costosi
	optimizeDeps: {
		include: ['three', 'gsap']
	}
});
