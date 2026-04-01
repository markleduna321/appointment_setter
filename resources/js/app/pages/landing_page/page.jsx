import HeaderSection from './_sections/header-section';
import HeroSection from './_sections/hero-section';
import StatsSection from './_sections/stats-section';
import ServicesSection from './_sections/services-section';
import HowItWorksSection from './_sections/how-it-works-section';
import FeaturesSection from './_sections/features-section';
import DoctorsSection from './_sections/doctors-section';
import TestimonialsSection from './_sections/testimonials-section';
import CtaSection from './_sections/cta-section';
import FooterSection from './_sections/footer-section';

export default function LandingPage() {
    return (
        <div className="min-h-screen">
            <HeaderSection />
            <HeroSection />
            <StatsSection />
            <ServicesSection />
            <HowItWorksSection />
            <FeaturesSection />
            <DoctorsSection />
            <TestimonialsSection />
            <CtaSection />
            <FooterSection />
        </div>
    );
}
