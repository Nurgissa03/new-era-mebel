// Имена и фото — заглушки. Пришлите данные, и я их вставлю.
const PEOPLE = [
  { name: '[Имя отца]', role: 'Мастер · [N] лет опыта', photo: null as string | null },
  { name: '[Имя брата]', role: 'Мастер · заказы и связь', photo: null as string | null },
];

export default function About() {
  return (
    <section className="sec sec-center" data-scene="table" data-side="left" style={{ minHeight: '80vh' }}>
      <div className="wrap split">
        <div className="stage" style={{ height: 520 }} />
        <div>
          <div className="kicker">07 — О НАС</div>
          <h2 className="h2" style={{ marginBottom: 20 }}>
            Отец и сын
          </h2>
          <p className="lead" style={{ maxWidth: 'none', marginBottom: 32, lineHeight: 1.7 }}>
            Мы не компания с диспетчерами — мы семья. Приезжаем сами, собираем сами и отвечаем за каждый шуруп.
          </p>
          <div className="g2">
            {PEOPLE.map((p) => (
              <div key={p.name} className="card person">
                <div className="person-photo">{p.photo ? <img src={p.photo} alt={p.name} loading="lazy" /> : '[ФОТО]'}</div>
                <b>{p.name}</b>
                <span>{p.role}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
