import { Link } from 'react-router-dom';
import Logo from '../components/Logo';

/** Временная заглушка кабинета — настоящий кабинет с входом появится на этапе 5. */
export default function Admin() {
  return (
    <main
      style={{ minHeight: '100vh', padding: 20, display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 480, margin: '0 auto' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Logo size={22} />
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.2em', color: 'var(--muted-2)' }}>КАБИНЕТ</span>
      </div>
      <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 24, margin: 0 }}>Кабинет скоро будет</h1>
      <p style={{ color: 'var(--muted)', margin: 0 }}>Здесь появятся заказы, цены и фото работ.</p>
      <Link to="/">← На сайт</Link>
    </main>
  );
}
