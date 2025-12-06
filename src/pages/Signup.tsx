import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
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
import LanguageToggle from '@/components/ui/language-toggle';
import ThemeToggle from '@/components/ui/theme-toggle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
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
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mirrored, setMirrored] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const { signup, isAuthenticated, loading: authLoading } = useAuth();
  const { t, isRTL, language } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, authLoading, navigate]);

  const heroCopy = useMemo(() => {
    if (isRTL) {
      return {
        badge: 'انضم إلينا اليوم',
        headline: 'ابدأ رحلتك مع بوابتك القانونية الآمنة',
        subheadline: 'سجّل حسابك للوصول إلى خدماتنا القانونية المتميزة ومتابعة قضاياك بكل سهولة.',
        highlights: [
          { icon: ShieldCheck, text: 'حماية بيانات مشفرة بأعلى المعايير الدولية' },
          { icon: Sparkles, text: 'لوحة تحكم شخصية لمتابعة جميع قضاياك' },
          { icon: UserPlus, text: 'تواصل مباشر مع فريقنا القانوني المتخصص' },
        ],
        stats: [
          { value: '٣ دقائق', label: 'للتسجيل' },
          { value: 'مجاني', label: 'إنشاء الحساب' },
        ],
      };
    }

    return {
      badge: 'Join Us Today',
      headline: 'Start Your Journey with Our Secure Legal Portal',
      subheadline: 'Create your account to access our premium legal services and track your cases with ease.',
      highlights: [
        { icon: ShieldCheck, text: 'Enterprise-grade encryption protecting your sensitive data' },
        { icon: Sparkles, text: 'Personal dashboard to track all your cases' },
        { icon: UserPlus, text: 'Direct communication with our specialized legal team' },
      ],
      stats: [
        { value: '3 min', label: 'To Register' },
        { value: 'Free', label: 'Account Creation' },
      ],
    };
  }, [isRTL]);

  const shouldReverse = useMemo(() => (isRTL ? !mirrored : mirrored), [isRTL, mirrored]);

  const heroHighlights: AuthHighlight[] = heroCopy.highlights.map(({ icon: Icon, text }) => ({
    icon: <Icon className="w-5 h-5" />,
    text,
  }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!name.trim()) {
      setFormError(t('auth.validation.required'));
      return;
    }

    if (password !== confirmPassword) {
      setFormError(t('auth.validation.password_mismatch'));
      return;
    }

    if (password.length < 6) {
      setFormError(t('auth.validation.password_length'));
      return;
    }

    if (!agreeToTerms) {
      setFormError(language === 'ar' ? 'يرجى الموافقة على الشروط والأحكام' : 'Please agree to the terms and conditions');
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
      const message = error instanceof Error ? error.message : t('auth.signup.error_message');
      setFormError(message);
      toast({
        title: t('common.error'),
        description: message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const toolbar = (
    <>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="border-border/50 bg-background/70 text-xs font-medium backdrop-blur hidden sm:flex"
        onClick={() => setMirrored((prev) => !prev)}
        aria-pressed={mirrored}
        aria-label={t('auth.login.swap_layout_aria')}
      >
        <ArrowLeftRight className="h-4 w-4" />
        <span className="ml-1">{t('auth.login.swap_layout')}</span>
      </Button>
      <ThemeToggle tone="light" />
      <LanguageToggle />
    </>
  );

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

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
            <Sparkles className="h-4 w-4" />
            <span>{heroCopy.badge}</span>
          </>
        ),
        title: heroCopy.headline,
        description: heroCopy.subheadline,
        highlights: heroHighlights,
        stats: heroCopy.stats,
      }}
      card={{
        icon: (
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
            <UserPlus className="h-6 w-6 text-primary" />
          </div>
        ),
        title: t('auth.signup.title'),
        description: t('auth.signup.subtitle'),
        content: (
          <div className="space-y-5">
            {/* Error Message */}
            {formError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm bg-destructive/10 border border-destructive/30 text-destructive"
              >
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>{formError}</span>
              </motion.div>
            )}

            {/* Signup Form */}
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {/* Name Field */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  {t('auth.signup.name')}
                </Label>
                <div className="relative">
                  <User
                    className={cn(
                      'absolute top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground',
                      isRTL ? 'right-3' : 'left-3'
                    )}
                  />
                  <Input
                    id="name"
                    type="text"
                    placeholder={t('auth.signup.name_placeholder')}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={cn('h-11', isRTL ? 'pr-10' : 'pl-10')}
                    required
                    autoComplete="name"
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  {t('auth.signup.email')}
                </Label>
                <div className="relative">
                  <Mail
                    className={cn(
                      'absolute top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground',
                      isRTL ? 'right-3' : 'left-3'
                    )}
                  />
                  <Input
                    id="email"
                    type="email"
                    placeholder={t('auth.signup.email_placeholder')}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={cn('h-11', isRTL ? 'pr-10' : 'pl-10')}
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  {t('auth.signup.password')}
                </Label>
                <div className="relative">
                  <Lock
                    className={cn(
                      'absolute top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground',
                      isRTL ? 'right-3' : 'left-3'
                    )}
                  />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder={t('auth.signup.password_placeholder')}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={cn('h-11', isRTL ? 'pr-10 pl-12' : 'pl-10 pr-12')}
                    required
                    minLength={6}
                    autoComplete="new-password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className={cn(
                      'absolute top-1/2 -translate-y-1/2 h-8 w-8 p-0',
                      isRTL ? 'left-1' : 'right-1'
                    )}
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium">
                  {t('auth.signup.confirm_password')}
                </Label>
                <div className="relative">
                  <Lock
                    className={cn(
                      'absolute top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground',
                      isRTL ? 'right-3' : 'left-3'
                    )}
                  />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder={t('auth.signup.confirm_password_placeholder')}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={cn('h-11', isRTL ? 'pr-10 pl-12' : 'pl-10 pr-12')}
                    required
                    autoComplete="new-password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className={cn(
                      'absolute top-1/2 -translate-y-1/2 h-8 w-8 p-0',
                      isRTL ? 'left-1' : 'right-1'
                    )}
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Terms Agreement */}
              <div className="flex items-start gap-2">
                <Checkbox
                  id="terms"
                  checked={agreeToTerms}
                  onCheckedChange={(checked) => setAgreeToTerms(checked === true)}
                  className="mt-0.5"
                />
                <Label htmlFor="terms" className="text-xs text-muted-foreground cursor-pointer leading-relaxed">
                  {language === 'ar' ? (
                    <>
                      أوافق على{' '}
                      <Link to="/terms" className="text-primary hover:underline">
                        الشروط والأحكام
                      </Link>{' '}
                      و{' '}
                      <Link to="/privacy" className="text-primary hover:underline">
                        سياسة الخصوصية
                      </Link>
                    </>
                  ) : (
                    <>
                      I agree to the{' '}
                      <Link to="/terms" className="text-primary hover:underline">
                        Terms of Service
                      </Link>{' '}
                      and{' '}
                      <Link to="/privacy" className="text-primary hover:underline">
                        Privacy Policy
                      </Link>
                    </>
                  )}
                </Label>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full h-11 font-semibold"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
                    {t('common.loading')}
                  </span>
                ) : (
                  <>
                    {t('auth.signup.submit')}
                    <ArrowRight className={cn('ml-2 h-4 w-4', isRTL && 'rotate-180')} />
                  </>
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  {language === 'ar' ? 'أو' : 'or'}
                </span>
              </div>
            </div>

            {/* Links */}
            <div className="space-y-3 text-center text-sm">
              <p className="text-muted-foreground">
                {t('auth.signup.have_account')}{' '}
                <Link to="/login" className="font-medium text-primary hover:underline">
                  {t('auth.login.submit')}
                </Link>
              </p>
              <p>
                <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
                  {language === 'ar' ? '← العودة للصفحة الرئيسية' : '← Back to home'}
                </Link>
              </p>
            </div>

            {/* Security Notice */}
            <div className={cn(
              'flex items-center gap-3 rounded-xl border border-dashed border-primary/30 bg-primary/5 p-3 mt-4',
              isRTL ? 'flex-row-reverse text-right' : ''
            )}>
              <div className="flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <ShieldCheck className="h-5 w-5 text-primary" />
              </div>
              <div className="text-xs space-y-0.5">
                <p className="font-semibold text-foreground">
                  {language === 'ar' ? 'بياناتك في أمان' : 'Your Data is Safe'}
                </p>
                <p className="text-muted-foreground">
                  {language === 'ar'
                    ? 'نستخدم أحدث تقنيات التشفير لحماية بياناتك'
                    : 'We use the latest encryption to protect your data'
                  }
                </p>
              </div>
            </div>
          </div>
        ),
      }}
    />
  );
};

export default Signup;
