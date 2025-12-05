import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AlertCircle,
  ArrowLeftRight,
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
  User,
  UserPlus,
} from 'lucide-react';

import AuthLayout from '@/components/layout/AuthLayout';
import type { AuthHighlight } from '@/components/layout/AuthLayout';
import BrandLogo from '@/components/common/BrandLogo';
import LanguageToggle from '@/components/ui/language-toggle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const Signup: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mirrored, setMirrored] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const { signup, isAuthenticated, loading: authLoading } = useAuth();
  const { t, isRTL, language } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, authLoading, navigate]);

  const heroCopy = useMemo(() => {
    if (isRTL) {
      return {
        badge: 'انطلاقة مساحة عملك',
        headline: 'ابدأ مركز تشغيلك القانوني الآمن',
        subheadline:
          'سجّل مكتبك، وادعُ الشركاء، ونظّم القضايا من منصة موحدة ومشفرة تدعم نموك.',
        highlights: [
          { icon: ShieldCheck, text: 'حماية بمستوى المؤسسات مع مراقبة امتثال مستمرة.' },
          { icon: Sparkles, text: 'تهيئة موجهة وفق حجم مكتبك وتدفقات عملك.' },
          { icon: UserPlus, text: 'حسابات تعاونية للشركاء والعملاء والمساعدين من اليوم الأول.' },
        ],
        stats: [
          { value: '٣ دقائق', label: 'متوسط التسجيل' },
          { value: '٢٤/٧', label: 'دعم تهيئة متخصص' },
        ],
      };
    }

    return {
      badge: 'Launch your workspace',
      headline: 'Start your secure legal operations hub',
      subheadline:
        'Register your firm, invite partners, and orchestrate matters from a centralized, encrypted platform.',
      highlights: [
        { icon: ShieldCheck, text: 'Enterprise-grade security with continuous compliance monitoring.' },
        { icon: Sparkles, text: 'Guided onboarding tailored to your practice size and workflows.' },
        { icon: UserPlus, text: 'Collaborative accounts ready for partners, clients, and assistants.' },
      ],
      stats: [
        { value: '3 min', label: 'Average signup time' },
        { value: '24/7', label: 'Specialist onboarding support' },
      ],
    };
  }, [isRTL]);

  const shouldReverse = useMemo(() => (isRTL ? !mirrored : mirrored), [isRTL, mirrored]);

  const heroHighlights: AuthHighlight[] = heroCopy.highlights.map(({ icon, text }) => ({ icon, text }));

  const heroStats = heroCopy.stats;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setFormError(null);

    if (password !== confirmPassword) {
      setFormError(t('auth.validation.password_mismatch'));
      return;
    }

    if (password.length < 6) {
      setFormError(t('auth.validation.password_length'));
      return;
    }

    setLoading(true);

    try {
      await signup(email, password, name);
      toast({
        title: t('auth.signup.success_title'),
        description: t('auth.signup.success_message'),
      });
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: t('common.error'),
        description: error instanceof Error ? error.message : t('auth.signup.error_message'),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const cardIcon = (
    <div
      className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl"
      style={{
        background: 'hsla(var(var(--primary)) / 0.12)',
        color: 'hsl(var(var(--primary)))',
      }}
    >
      <BrandLogo variant="icon" className="h-8 w-8" lang={language} />
    </div>
  );

  const toolbar = (
    <>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="border-border/50 bg-background/70 text-xs font-medium backdrop-blur"
        onClick={() => setMirrored((prev) => !prev)}
        aria-pressed={mirrored}
        aria-label={t('auth.login.swap_layout_aria')}
      >
        <ArrowLeftRight className="h-4 w-4" />
        <span>{t('auth.login.swap_layout')}</span>
      </Button>
      <LanguageToggle />
    </>
  );

  // Show loading state while checking auth
  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  // Don't render signup page if authenticated (will redirect)
  if (isAuthenticated) {
    return null;
  }

  return (
    <AuthLayout
      heroSide={shouldReverse ? 'right' : 'left'}
      toolbar={toolbar}
      hero={{
        badge: (
          <>
            <Sparkles className="h-4 w-4" style={{ color: 'hsl(var(var(--gold-light)))' }} />
            <span>{heroCopy.badge}</span>
          </>
        ),
        title: heroCopy.headline,
        description: heroCopy.subheadline,
        highlights: heroHighlights,
        stats: heroStats,
      }}
      card={{
        icon: cardIcon,
        title: t('auth.signup.title'),
        description: t('auth.signup.subtitle'),
        content: (
          <>
            {formError ? (
              <div
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm"
                style={{
                  color: 'hsl(var(var(--destructive)))',
                  background: 'hsla(var(var(--destructive)) / 0.12)',
                  border: '1px solid hsla(var(var(--destructive)) / 0.35)',
                }}
              >
                <AlertCircle className="h-4 w-4" />
                <span>{formError}</span>
              </div>
            ) : null}

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div className="space-y-2">
                <Label htmlFor="name">{t('auth.signup.name')}</Label>
                <div className="relative">
                  <User
                    className={cn(
                      'absolute top-3 h-4 w-4 text-muted-foreground',
                      isRTL ? 'right-3' : 'left-3'
                    )}
                  />
                  <Input
                    id="name"
                    type="text"
                    placeholder={t('auth.signup.name_placeholder')}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={cn(isRTL ? 'pr-10' : 'pl-10')}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">{t('auth.signup.email')}</Label>
                <div className="relative">
                  <Mail
                    className={cn(
                      'absolute top-3 h-4 w-4 text-muted-foreground',
                      isRTL ? 'right-3' : 'left-3'
                    )}
                  />
                  <Input
                    id="email"
                    type="email"
                    placeholder={t('auth.signup.email_placeholder')}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={cn(isRTL ? 'pr-10' : 'pl-10')}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">{t('auth.signup.password')}</Label>
                <div className="relative">
                  <Lock
                    className={cn(
                      'absolute top-3 h-4 w-4 text-muted-foreground',
                      isRTL ? 'right-3' : 'left-3'
                    )}
                  />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder={t('auth.signup.password_placeholder')}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={cn(isRTL ? 'pl-12 pr-10' : 'pl-10 pr-12')}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className={cn(
                      'absolute top-0 h-full px-3 py-2 hover:bg-transparent',
                      isRTL ? 'left-0' : 'right-0'
                    )}
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-pressed={showPassword}
                    aria-label={
                      showPassword ? t('auth.login.hide_password') : t('auth.login.show_password')
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">{t('auth.signup.confirm_password')}</Label>
                <div className="relative">
                  <Lock
                    className={cn(
                      'absolute top-3 h-4 w-4 text-muted-foreground',
                      isRTL ? 'right-3' : 'left-3'
                    )}
                  />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder={t('auth.signup.confirm_password_placeholder')}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={cn(isRTL ? 'pl-12 pr-10' : 'pl-10 pr-12')}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className={cn(
                      'absolute top-0 h-full px-3 py-2 hover:bg-transparent',
                      isRTL ? 'left-0' : 'right-0'
                    )}
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    aria-pressed={showConfirmPassword}
                    aria-label={
                      showConfirmPassword
                        ? t('auth.login.hide_password')
                        : t('auth.login.show_password')
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              <Button type="submit" className="w-full glow-effect" disabled={loading}>
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-b-2 border-white" />
                    {t('common.loading')}
                  </span>
                ) : (
                  <>
                    {t('auth.signup.submit')}
                    <ArrowRight className={`ml-2 h-4 w-4 ${isRTL ? 'rotate-180' : ''}`} />
                  </>
                )}
              </Button>
            </form>

            <div className="space-y-2 text-center text-sm text-[hsl(var(var(--slate-light)))]">
              <p>
                {t('auth.signup.have_account')}{' '}
                <Link to="/login" className="font-medium text-primary hover:underline">
                  {t('auth.login.submit')}
                </Link>
              </p>
              <p>
                <Link to="/" className="font-medium text-primary hover:underline">
                  {t('auth.signup.back_to_home')}
                </Link>
              </p>
            </div>

            <div
              className={cn(
                'flex items-center gap-3 rounded-2xl border border-dashed p-4 backdrop-blur',
                isRTL ? 'flex-row-reverse text-right' : 'text-left'
              )}
              style={{
                borderColor: 'hsla(var(var(--primary)) / 0.4)',
                background: 'hsla(var(var(--primary)) / 0.05)',
              }}
            >
              <div
                className="flex h-12 w-12 items-center justify-center rounded-xl"
                style={{
                  background: 'hsla(var(var(--primary)) / 0.12)',
                  color: 'hsl(var(var(--primary)))',
                }}
              >
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div className="space-y-1 text-xs sm:text-sm">
                <p className="font-semibold text-[hsl(var(var(--foreground)))]">{t('auth.signup.security_title')}</p>
                <p className="text-[hsl(var(var(--slate-light)))]">{t('auth.signup.security_description')}</p>
              </div>
            </div>
          </>
        ),
      }}
    />
  );
};

export default Signup;
