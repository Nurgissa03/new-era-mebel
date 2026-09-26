// GitHub Pages не знает про адреса вроде /admin и отдаёт для них 404.html.
// Копируем index.html в 404.html — тогда любой адрес откроет наше приложение,
// а React Router сам покажет нужную страницу.
import { copyFileSync } from 'node:fs';

copyFileSync('dist/index.html', 'dist/404.html');
console.log('spa-fallback: dist/404.html создан');
