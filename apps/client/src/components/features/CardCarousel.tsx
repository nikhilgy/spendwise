import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Card } from '../../types';
import { DzenCard } from '../ui/Card';
import 'swiper/css';

interface CardCarouselProps {
  cards: Card[];
}

const CardCarousel: React.FC<CardCarouselProps> = ({ cards }) => {
  if (!cards || cards.length === 0) {
    return (
      <div style={{ width: '100%' }}>
        <DzenCard style={{ width: 280, height: 170, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--dzen-gray100)' }}>
          <p style={{ color: 'var(--dzen-gray500)', fontSize: 14 }}>No cards added yet</p>
        </DzenCard>
      </div>
    );
  }

  return (
    <div style={{ width: '100%' }}>
      <Swiper spaceBetween={24} slidesPerView={1} style={{ width: 280, height: 170 }}>
        {cards.map((card, idx) => (
          <SwiperSlide key={card.id}>
            <DzenCard style={{ width: 280, height: 170, padding: 24, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: 'radial-gradient(circle at bottom left, #D52B2B 0%, var(--dzen-red) 100%)', color: 'var(--dzen-white)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ width: 32, height: 32, background: 'var(--dzen-white)', borderRadius: 'var(--dzen-radius-full)' }} />
                <div style={{ width: 24, height: 24, background: 'var(--dzen-white)', borderRadius: 'var(--dzen-radius-full)' }} />
              </div>
              <div>
                <div style={{ color: 'var(--dzen-white)', fontSize: 18, fontWeight: 700, letterSpacing: 2, marginBottom: 8 }}>**** {card.last_four}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--dzen-white)' }}>
                  <span>{card.name}</span>
                  <span>{card.card_type}</span>
                </div>
              </div>
            </DzenCard>
            <div style={{ textAlign: 'center', fontSize: 12, color: 'var(--dzen-gray500)', marginTop: 8 }}>My Cards: {idx + 1} / {cards.length}</div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default CardCarousel; 