import { useState } from 'react';
import Logo from '../components/Logo';
import { IconClose, IconMenu } from '../components/Icons';

const LINKS = [
  ['#services', 'Услуги'],
  ['#calc', 'Цены'],
  ['#works', 'Работы'],
  ['#status', 'Мой заказ'],
  ['#faq', 'Вопросы'],
];

export default function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="hdr">
      <div className="wrap hdr-in">
        <a href="#top" className="brand" onClick={() => setOpen(false)}>
          <Logo />
          <span className="brand-txt">
            <span className="brand-1">NEW ERA</span>
            <span className="brand-2">MEBEL</span>
          </span>
        </a>
        <nav className="nav" aria-label="Разделы">
          {LINKS.map(([href, label]) => (
            <a key={href} className="nl" href={href}>
              {label}
            </a>
          ))}
        </nav>
        <div className="hdr-right">
          <a className="btn btn-sm hdr-cta" href="#order">
            Оставить заявку
          </a>
          <button
            type="button"
            className="icon-btn"
            aria-label={open ? 'Закрыть меню' : 'Меню'}
            aria-expanded={open}
            aria-controls="mnav"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <IconClose /> : <IconMenu />}
          </button>
        </div>
      </div>
      <nav id="mnav" className={'mnav' + (open ? ' open' : '')} aria-label="Меню">
        {LINKS.map(([href, label]) => (
          <a key={href} href={href} onClick={() => setOpen(false)}>
            {label}
          </a>
        ))}
        <a href="#order" onClick={() => setOpen(false)}>
          Оставить заявку
        </a>
      </nav>
    </header>
  );
}
