const STEPS = [
  ['Заявка', 'Выберите мебель, дату и прикрепите фото коробок — одна минута.'],
  ['Звонок', 'Перезвоним, уточним детали и назовём точную цену.'],
  ['Сборка', 'Приезжаем в назначенное время со своим инструментом.'],
  ['Проверка', 'Проверяем двери и ящики вместе с вами. Оплата — после.'],
];

export default function HowItWorks() {
  return (
    <section className="sec sec-center" data-scene="bed" data-side="left" style={{ minHeight: '80vh' }}>
      <div className="wrap split">
        <div className="stage" style={{ height: 520 }} />
        <div>
          <div className="kicker">02 — КАК ЭТО РАБОТАЕТ</div>
          <h2 className="h2">Четыре шага — и мебель стоит</h2>
          <ol className="steps">
            {STEPS.map(([title, text], i) => (
              <li key={title}>
                <span className="num">{String(i + 1).padStart(2, '0')}</span>
                <span>
                  <b>{title}</b>
                  <span>{text}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
