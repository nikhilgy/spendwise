import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

export interface CardData {
  id: string;
  cardholder: string;
  number: string;
  expiry: string;
  balance: number;
}

const mockCards: CardData[] = [
  {
    id: '1',
    cardholder: 'Akmal Nasrulloh',
    number: '**** 5678',
    expiry: '12/24',
    balance: 120000,
  },
  {
    id: '2',
    cardholder: 'Akmal Nasrulloh',
    number: '**** 1234',
    expiry: '11/25',
    balance: 80000,
  },
];

const CardCarousel: React.FC = () => {
  return (
    <div className="w-full">
      <Swiper
        spaceBetween={24}
        slidesPerView={1}
        className="w-[280px] h-[170px]"
      >
        {mockCards.map((card, idx) => (
          <SwiperSlide key={card.id}>
            <div className="relative w-[280px] h-[170px] rounded-2xl overflow-hidden shadow-lg bg-gradient-to-b from-[#00002C] via-[#081044] to-[#A6CDBB] p-6 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 bg-white rounded-full" />
                <div className="w-6 h-6 bg-white rounded-full" />
              </div>
              <div>
                <div className="text-neutral-000 text-lg font-semibold tracking-widest mb-2">{card.number}</div>
                <div className="flex justify-between text-xs text-neutral-000">
                  <span>{card.cardholder}</span>
                  <span>{card.expiry}</span>
                </div>
              </div>
            </div>
            <div className="text-center text-xs text-neutral-500 mt-2">My Cards: {idx + 1} / {mockCards.length}</div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default CardCarousel; 