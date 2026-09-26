import Logo from '../components/Logo';

/** Временная главная — этап 2. Полный дизайн появится на этапе 3. */
export default function Home() {
  return (
    <main
      className="wrap"
      style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 24 }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Logo />
        <span style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 16 }}>NEW ERA</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.32em', color: 'var(--muted-2)', marginTop: 4 }}>
            MEBEL
          </span>
        </span>
      </div>
      <h1
        style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 800,
          fontSize: 'clamp(40px, 7vw, 72px)',
          lineHeight: 1.02,
          letterSpacing: '-0.035em',
          margin: 0,
        }}
      >
        Соберём мебель
        <br />
        точно<span style={{ color: 'var(--accent)' }}>.</span>
      </h1>
      <p style={{ color: 'var(--text-soft)', fontSize: 19, lineHeight: 1.6, margin: 0, maxWidth: 500 }}>
        Сайт в разработке. Скоро здесь будет всё: цены, калькулятор и заявка.
      </p>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--muted-3)', letterSpacing: '0.1em' }}>
        ТУРКЕСТАН · СБОРКА МЕБЕЛИ
      </div>
    </main>
  );
}
