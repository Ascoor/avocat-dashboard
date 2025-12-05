import { useLanguage } from '@/contexts/LanguageContext';

const Index = () => {
  const { t } = useLanguage();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-foreground sm:text-5xl">
          {t('home.title')}
        </h1>
        <p className="text-lg text-muted-foreground sm:text-xl">
          {t('home.subtitle')}
        </p>
      </div>
    </div>
  );
};

export default Index;
