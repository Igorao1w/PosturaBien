'use client';

import React, { useState } from 'react';
import Header from '@/components/landing/Header';
import Hero from '@/components/landing/Hero';
import Benefits from '@/components/landing/Benefits';
import Warning from '@/components/landing/Warning';
import Usage from '@/components/landing/Usage';
import Testimonials from '@/components/landing/Testimonials';
import PersonalizedTestimonial from '@/components/landing/PersonalizedTestimonial';
import CTA from '@/components/landing/CTA';
import Footer from '@/components/landing/Footer';
import OrderSheet from '@/components/landing/OrderSheet';

export default function Home() {
  const [isOrderSheetOpen, setIsOrderSheetOpen] = useState(false);

  const handleOpenOrderSheet = () => {
    setIsOrderSheetOpen(true);
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header onOrderNow={handleOpenOrderSheet} />
      <main className="flex-grow">
        <Hero onOrderNow={handleOpenOrderSheet} />
        <Benefits />
        <Warning />
        <Usage />
        <Testimonials />
        <PersonalizedTestimonial />
        <CTA onOrderNow={handleOpenOrderSheet} />
      </main>
      <Footer />
      <OrderSheet open={isOrderSheetOpen} onOpenChange={setIsOrderSheetOpen} />
    </div>
  );
}
