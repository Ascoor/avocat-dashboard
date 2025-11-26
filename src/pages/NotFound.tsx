import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { language } = useLanguage();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="text-center">
        <div className="mb-8 text-9xl font-bold text-gradient-gold">404</div>
        <h1 className="mb-4 text-3xl font-bold md:text-4xl">
          {language === 'ar' ? 'الصفحة غير موجودة' : 'Page Not Found'}
        </h1>
        <p className="mb-8 text-lg text-muted-foreground">
          {language === 'ar' 
            ? 'عذراً، الصفحة التي تبحث عنها غير موجودة'
            : 'Sorry, the page you are looking for does not exist'}
        </p>
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Button
            size="lg"
            onClick={() => navigate('/')}
            className="bg-accent text-accent-foreground shadow-gold hover:shadow-xl"
          >
            <Home className="h-4 w-4 ltr:mr-2 rtl:ml-2" />
            {language === 'ar' ? 'العودة للرئيسية' : 'Go Home'}
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4 ltr:mr-2 rtl:ml-2" />
            {language === 'ar' ? 'رجوع' : 'Go Back'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
