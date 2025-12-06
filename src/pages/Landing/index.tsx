import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import LandingNavbar from "./LandingNavbar";
import Hero from "./Hero";
import About from "./About";
import PracticeAreas from "./PracticeAreas";
import Services from "./Services";
import Capabilities from "./Capabilities";
import Achievements from "./Achievements";
import Team from "./Team";
import Testimonials from "./Testimonials";
import FAQ from "./FAQ";
import CallToAction from "./CallToAction";
import Contact from "./Contact";
import Footer from "./Footer";
import ScrollToTopButton from "@/components/common/ScrollToTopButton";

const LandingPage: React.FC = () => { 
  const { direction } = useLanguage();
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, loading, navigate]);

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  // Don't render landing page if authenticated (will redirect)
  if (isAuthenticated) {
    return null;
  }
 
  return (
    <div className="flex min-h-screen flex-col bg-background" dir={direction}>
      <LandingNavbar />

      <main className="flex flex-1 flex-col">
        <Hero />
        <About />
        <PracticeAreas />
        <Services />
        <Capabilities /> 
        <Achievements />
        <Team />
        <Testimonials />
        <FAQ />
        <CallToAction />
        <Contact />
      </main>

      <Footer />
      <ScrollToTopButton />
    </div>
  );
};

export default LandingPage;
