'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/landing/Header';
import Hero from '@/components/landing/Hero';
import Benefits from '@/components/landing/Benefits';
import Warning from '@/components/landing/Warning';
import Usage from '@/components/landing/Usage';
import Testimonials from '@/components/landing/Testimonials';
import PersonalizedTestimonial from '@/components/landing/PersonalizedTestimonial';
import CTA from '@/components/landing/CTA';
import FAQ from '@/components/landing/FAQ';
import Footer from '@/components/landing/Footer';
import OrderDialog from '@/components/landing/OrderDialog';

export default function Home() {
  const [isOrderSheetOpen, setIsOrderSheetOpen] = useState(false);
  const [isHeaderButtonVisible, setIsHeaderButtonVisible] = useState(false);

  const handleOpenOrderSheet = () => {
    setIsOrderSheetOpen(true);
  };

  useEffect(() => {
    const handleScroll = () => {
      // Show button after scrolling past 500px, which is roughly the hero section height
      if (window.scrollY > 500) {
        setIsHeaderButtonVisible(true);
      } else {
        setIsHeaderButtonVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header onOrderNow={handleOpenOrderSheet} showButton={isHeaderButtonVisible} />
      <main className="flex-grow">
        <Hero onOrderNow={handleOpenOrderSheet} />
        <Benefits />
        <Warning />
        <Usage />
        <Testimonials />
        <PersonalizedTestimonial />
        <CTA onOrderNow={handleOpenOrderSheet} />
        <FAQ />
      </main>
      <Footer />
      <OrderDialog open={isOrderSheetOpen} onOpenChange={setIsOrderSheetOpen} />
    </div>
  );
}
