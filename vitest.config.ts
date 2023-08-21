import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		globals: true,
		coverage: {
			enabled: true,
			reporter: ['text', 'lcov', 'clover'],
			provider: 'v8'
		},
		typecheck: {
			tsconfig: 'tests/tsconfig.json'
		}
	}
});
