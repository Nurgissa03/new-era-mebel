import { useState } from 'react';
import DotsCanvas from '../components/DotsCanvas';
import { SiteDataProvider } from '../data/SiteDataContext';
import type { ItemType } from '../data/types';
import { CALC_DEFAULT, type CalcState } from '../lib/calc';
import { load, save } from '../lib/storage';
import About from '../sections/About';
import Calculator from '../sections/Calculator';
import Faq from '../sections/Faq';
import Footer from '../sections/Footer';
import Header from '../sections/Header';
import Hero from '../sections/Hero';
import HowItWorks from '../sections/HowItWorks';
import MobileBar from '../sections/MobileBar';
import OrderForm from '../sections/OrderForm';
import OrderStatus, { type LastOrder } from '../sections/OrderStatus';
import Reviews from '../sections/Reviews';
import Services from '../sections/Services';
import Works from '../sections/Works';
import '../styles/site.css';

const LAST_ORDER_KEY = 'nem:lastOrder';

export default function Home() {
  // Калькулятор и заявка связаны: «Оформить заявку» переносит выбор в форму
  const [calc, setCalc] = useState<CalcState>(CALC_DEFAULT);
  const [orderItem, setOrderItem] = useState<ItemType>(CALC_DEFAULT.type);
  const [lastOrder, setLastOrder] = useState<LastOrder | null>(() => load<LastOrder>(LAST_ORDER_KEY));

  const onSent = (o: LastOrder) => {
    setLastOrder(o);
    save(LAST_ORDER_KEY, o);
  };

  return (
    <SiteDataProvider>
      <div className="site">
        <DotsCanvas />
        <Header />
        <main id="top">
          <Hero />
          <Services />
          <HowItWorks />
          <Calculator calc={calc} setCalc={setCalc} onOrder={() => setOrderItem(calc.type)} />
          <Works />
          <OrderStatus lastOrder={lastOrder} />
          <Reviews />
          <About />
          <Faq />
          <OrderForm calc={calc} item={orderItem} setItem={setOrderItem} onSent={onSent} />
          <Footer />
        </main>
        <MobileBar />
      </div>
    </SiteDataProvider>
  );
}
