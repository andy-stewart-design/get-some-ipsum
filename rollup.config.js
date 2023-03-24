import svelte from "rollup-plugin-svelte"
import sveltePreprocess from "svelte-preprocess"
import resolve from "@rollup/plugin-node-resolve"
import commonjs from "@rollup/plugin-commonjs"
import typescript from "@rollup/plugin-typescript"
import html from "@rollup/plugin-html"
import terser from "@rollup/plugin-terser"
import svg from "rollup-plugin-svg"

// Post CSS
import postcss from "rollup-plugin-postcss"
import cssnano from "cssnano"
import tailwind from "tailwindcss"

const production = !process.env.ROLLUP_WATCH

/**
 * @type {import('rollup').RollupOptions}
 */
export default [
  {
    input: `src/main.ts`,
    output: {
      format: `iife`,
      name: `ui`,
      file: `dist/bundle.js`,
    },
    plugins: [
      typescript(),
      svelte({
        compilerOptions: {
          dev: !production,
        },
        preprocess: sveltePreprocess(),
      }),
      resolve({
        browser: true,
        dedupe: (importee) => importee === `svelte` || importee.startsWith(`svelte/`),
      }),
      commonjs(),
      svg(),
      postcss({
        extensions: [`.css`],
        plugins: [cssnano(), tailwind()],
      }),
      html({
        fileName: `ui.html`,
        template({ bundle }) {
          return `
          <!doctype html>
          <html lang="en">
            <head>
              <meta charset="utf-8">
              <title>Figma Plugin Example</title>
            </head>
            <body>
              <script>${bundle[`bundle.js`].code}</script>
            </body>
          </html>
          `
        },
      }),
      production && terser(),
    ],
    watch: {
      clearScreen: false,
    },
  },
  {
    input: `src/code.ts`,
    output: {
      file: `dist/code.js`,
      format: `cjs`,
      name: `code`,
    },
    plugins: [
      typescript(),
      commonjs(),
      resolve({
        browser: true,
      }),
      production && terser(),
    ],
  },
]
