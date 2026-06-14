import * as path from 'path';
import { defineConfig } from '@rspress/core';

export default defineConfig({
  root: path.join(__dirname, 'docs'),
  base: '/',
  title: "Nana's Notebook",
  description: "Welcome to Nana's Notebook~",
  head: [
    ['script', { src: '/javascripts/mathjax.js' }],
    ['script', { src: 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js', async: 'true' }],
  ],
  themeConfig: {
    socialLinks: [
      { icon: 'github', mode: 'link', content: 'https://github.com/cagoya/cagoya.github.io' },
    ],
  },
});
