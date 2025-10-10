import Hero from "@/components/Hero/Hero";
import BestSellers from "@/components/Sections/BestSellers";
import { CounterSection } from "@/components/Sections/CounterSection";
import WhyUs from "@/components/Sections/WhyUs";

const Page = () => {
  return (
    <div className="min-h-screen custom-size-minmax">
      {/* main image + h1 */}
      <Hero />
      <WhyUs />
      <BestSellers />
      <CounterSection />
    </div>
  );
};

export default Page;