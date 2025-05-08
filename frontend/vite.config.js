import { defineConfig } from 'vite';
import fs from 'fs';
import path from 'path';

export default defineConfig({
  server: {
    https: {
      key: fs.readFileSync(path.resolve('C:/Users/Tulio/localhost.key')),
      cert: fs.readFileSync(path.resolve('C:/Users/Tulio/localhost.crt')),
    },
    port: 5500,
    open: '/index.html'
  },
  root: '.',
});