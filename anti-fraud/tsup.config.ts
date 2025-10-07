import { defineConfig } from 'tsup'

export default defineConfig({
	entry: ['src/index.ts'],
	format: ['cjs', 'esm'],
	splitting: true,
	sourcemap: true,
	clean: true,
	dts: true,
	outDir: 'dist',
	legacyOutput: true,
	minify: 'terser',
	terserOptions: {
		mangle: true,
		compress: {
			drop_debugger: true,
		},
		format: {
			comments: false,
		},
		sourceMap: true,
	},
})
