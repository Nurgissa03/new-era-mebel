import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Сайт живёт по адресу nurgissa03.github.io/new-era-mebel/ — отсюда base.
// Если позже подключим свой домен, поменяем на '/'.
export default defineConfig({
  base: '/new-era-mebel/',
  plugins: [react()],
});
