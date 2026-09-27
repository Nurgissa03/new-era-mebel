import { useSiteData } from '../data/SiteDataContext';
import { telHref, waHref } from '../lib/phone';

export default function Footer() {
  const s = useSiteData()?.settings;
  return (
    <footer className="foot">
      <div className="wrap">
        <div className="foot-in">
          <div>
            <div className="foot-brand">
              NEW ERA <span className="accent">MEBEL</span>
            </div>
            <div className="foot-sub">Сборка мебели · Туркестан</div>
          </div>
          <div className="foot-cols">
            <div>
              <div className="lbl">ТЕЛЕФОН</div>
              {s ? <a href={telHref(s.phone)}>{s.phone}</a> : '…'}
            </div>
            <div>
              <div className="lbl">WHATSAPP</div>
              {s ? (
                <a href={waHref(s.whatsapp)} target="_blank" rel="noopener noreferrer">
                  Написать
                </a>
              ) : (
                '…'
              )}
            </div>
            <div>
              <div className="lbl">РАБОТАЕМ</div>
              <span style={{ color: '#DDE1E7' }}>{s?.work_hours ?? '…'}</span>
            </div>
          </div>
        </div>
        <div className="foot-copy">© {new Date().getFullYear()} New Era Mebel</div>
      </div>
    </footer>
  );
}
