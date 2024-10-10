import { defineConfig } from 'vite';
import { createHtmlPlugin } from 'vite-plugin-html';

export default defineConfig({
  base: '/mon-ip/',
  plugins: [
    createHtmlPlugin({
      minify: true,
    }),
  ],
});