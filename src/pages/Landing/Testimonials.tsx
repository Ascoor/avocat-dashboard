import React, { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import SectionTitle from "@/components/SectionTitle";
import { Star, Quote } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useWebsiteContent } from "@/hooks/useWebsiteContent";
import type { ContentBlock, Locale } from "@/types/website";

type TestimonialType = "firm" | "individual";

interface TestimonialCopy {
  id: number;
  name: string;
  position: string;
  company: string;
  avatar: string;
  rating: number;
  quote: string;
  type: TestimonialType;
}

/* ------------------------------------------------------ */
const Testimonials: React.FC = () => {
  const { language, direction } = useLanguage();
  const locale: Locale = language.startsWith("ar") ? "ar" : "en";
  const { contentBlocks } = useWebsiteContent("testimonials");
  const testimonials = useMemo(
    () => extractTestimonials(contentBlocks, locale),
    [contentBlocks, locale]
  );

  if (!testimonials.length) return null;

  return (
    <section className="py-20 md:py-24 bg-gradient-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-gold-light text-gold-muted font-semibold text-sm mb-4">
            {direction === "rtl" ? "آراء العملاء" : "Client Reviews"}
          </span>
          <SectionTitle className="mx-auto font-cairo" glowIntensity={0.75}>
            {direction === "rtl"
              ? "ماذا يقول عملاؤنا"
              : "What Our Clients Say"}
          </SectionTitle>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {direction === "rtl"
              ? "آراء حقيقية من محامين ومكاتب قانونية تستخدم حلولنا يومياً"
              : "Real feedback from lawyers and law firms using our solutions daily"}
          </p>
        </div>

        {/* ✅ Responsive Grid (بدون motion) */}
        <div
          className="grid gap-6 sm:gap-8 md:gap-10 
                     grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {testimonials.map((t) => (
            <TestimonialCard key={t.id} testimonial={t} />
          ))}
        </div>

        {/* Trust Badges */}
        <div className="mt-16 text-center">
          <p className="text-muted-foreground mb-8 text-base sm:text-lg">
            {direction === "rtl"
              ? "موثوق به من قبل كبرى المكاتب القانونية"
              : "Trusted by Leading Law Firms"}
          </p>
          <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-8 opacity-70">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="w-28 sm:w-32 h-14 sm:h-16 bg-muted rounded-lg flex items-center justify-center"
              >
                <span className="text-sm sm:text-base font-semibold text-muted-foreground">
                  LOGO {i}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

/* ------------------------------------------------------ */
const TestimonialCard = ({
  testimonial,
}: {
  testimonial: TestimonialCopy;
}) => {
  const renderStars = (rating: number) =>
    Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 sm:h-5 sm:w-5 ${
          i < rating ? "text-accent fill-accent" : "text-muted-foreground/40"
        }`}
      />
    ));

  return (
    <Card className="border-none shadow-md hover:shadow-lg transition-all bg-card/80 backdrop-blur-sm rounded-2xl text-center flex flex-col justify-between">
      <CardContent className="p-6 sm:p-8 flex flex-col items-center h-full">
        <div className="w-14 h-14 sm:w-16 sm:h-16 mb-4 rounded-full bg-gradient-gold flex items-center justify-center text-2xl sm:text-3xl shadow-gold">
          {testimonial.avatar}
        </div>

        <div className="space-y-1 mb-4">
          <h4 className="font-semibold text-foreground text-base sm:text-lg">
            {testimonial.name}
          </h4>
          <p className="text-xs sm:text-sm text-muted-foreground">
            {testimonial.position}
          </p>
          <p className="text-xs sm:text-sm font-medium text-accent">
            {testimonial.company}
          </p>
        </div>

        <div className="flex justify-center gap-1 mb-4">
          {renderStars(testimonial.rating)}
        </div>

        <div className="relative flex flex-col items-center mt-auto">
          <Quote className="w-6 h-6 sm:w-8 sm:h-8 text-gold/20 absolute -top-6 opacity-30" />
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed italic max-w-xs mx-auto">
            “{testimonial.quote}”
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

/* ------------------------------------------------------ */
function extractTestimonials(
  blocks: ContentBlock[],
  locale: Locale
): TestimonialCopy[] {
  return blocks
    .filter((block) => /^testimonial_\d+$/.test(block.key))
    .map((block) => {
      const value = block.value as {
        ar?: Partial<TestimonialCopy> | null;
        en?: Partial<TestimonialCopy> | null;
      };
      const base = value.en ?? {};
      const localized = value[locale] ?? {};
      const merged: Partial<TestimonialCopy> = { ...base, ...localized };

      return {
        id: Number(block.key.replace("testimonial_", "")),
        name: merged.name ?? "",
        position: merged.position ?? "",
        company: merged.company ?? "",
        avatar: merged.avatar ?? "👤",
        rating: Number(merged.rating ?? 5),
        quote: merged.quote ?? "",
        type: (merged.type ?? "firm") as TestimonialType,
      };
    })
    .filter((t) => t.quote && t.name)
    .sort((a, b) => a.id - b.id);
}

export default Testimonials;
