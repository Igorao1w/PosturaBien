import Header from '@/components/landing/Header';
import Hero from '@/components/landing/Hero';
import Benefits from '@/components/landing/Benefits';
import Warning from '@/components/landing/Warning';
import Usage from '@/components/landing/Usage';
import Testimonials from '@/components/landing/Testimonials';
import PersonalizedTestimonial from '@/components/landing/PersonalizedTestimonial';
import CTA from '@/components/landing/CTA';
import Footer from '@/components/landing/Footer';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow">
        <Hero />
        <Benefits />
        <Warning />
        <Usage />
        <Testimonials />
        <PersonalizedTestimonial />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
