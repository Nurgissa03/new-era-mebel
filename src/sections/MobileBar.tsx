import { IconPhone } from '../components/Icons';
import { useSiteData } from '../data/SiteDataContext';
import { telHref } from '../lib/phone';

/** Закреплённые снизу кнопки на телефоне. */
export default function MobileBar() {
  const phone = useSiteData()?.settings.phone ?? '';
  return (
    <div className="mobbar">
      <a className="ghost" href={telHref(phone)}>
        <IconPhone />
        Позвонить
      </a>
      <a className="btn" href="#order">
        Заявка
      </a>
    </div>
  );
}
