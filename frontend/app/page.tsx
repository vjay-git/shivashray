import { Hero, Features, LocationAmenities, RoomsPreview, Services, ExclusiveDeals, Testimonials, CTA } from '@/components/home';

export default function Home() {
  return (
    <div>
      <Hero />
      <Features />
      <LocationAmenities />
      <RoomsPreview />
      <Services />
      <ExclusiveDeals />
      <Testimonials />
      <CTA />
    </div>
  );
}
