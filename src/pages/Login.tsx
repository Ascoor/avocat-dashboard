import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { AlertCircle, Scale, Shield, Sparkles, UserCheck } from "lucide-react";
import BrandLogo from "@/components/common/BrandLogo";

const emailRegex = /\S+@\S+\.\S+/;

type AuthTab = "signin" | "signup";

type SigninFormState = {
  email: string;
  password: string;
};

type SignupFormState = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const Login: React.FC = () => {
  const { t } = useTranslation();
  const { isRTL, language } = useLanguage();
  const { login, signup, loading, user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [activeTab, setActiveTab] = useState<AuthTab>("signin");
  const [signinForm, setSigninForm] = useState<SigninFormState>({ email: "", password: "" });
  const [signupForm, setSignupForm] = useState<SignupFormState>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (user && isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, isAuthenticated, navigate]);

  useEffect(() => {
    if (searchParams.get("registered") === "1") {
      toast({ title: t("common.success"), description: t("auth.login.after_register") });
    }
    if (searchParams.get("session") === "expired") {
      toast({ title: t("common.info"), description: t("auth.session_expired") });
    }
  }, [searchParams, toast, t]);

  const validateEmail = (email: string) => emailRegex.test(email.trim());

  const handleSignIn = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError(null);

    if (!signinForm.email.trim() || !signinForm.password.trim()) {
      setFormError(t("auth.validation.required"));
      return;
    }

    if (!validateEmail(signinForm.email)) {
      setFormError(t("auth.validation.email_invalid"));
      return;
    }

    try {
      await login(signinForm.email.trim(), signinForm.password.trim());
      toast({ title: t("common.success"), description: t("auth.login.success") });
      const nextUrl = searchParams.get("next") || "/dashboard";
      navigate(nextUrl, { replace: true });
    } catch (err) {
      const description =
        (err as { message?: string })?.message ||
        t("auth.errors.invalid_credentials") ||
        t("auth.login.error");
      setFormError(description);
      toast({ title: t("common.error"), description, variant: "destructive" });
    }
  };

  const handleSignUp = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError(null);

    if (!signupForm.name.trim()) {
      setFormError(t("auth.validation.required"));
      return;
    }

    if (!validateEmail(signupForm.email)) {
      setFormError(t("auth.validation.email_invalid"));
      return;
    }

    if (!signupForm.password.trim() || signupForm.password.length < 6) {
      setFormError(t("auth.validation.password_length"));
      return;
    }

    if (signupForm.password !== signupForm.confirmPassword) {
      setFormError(t("auth.validation.password_mismatch"));
      return;
    }

    try {
      await signup(signupForm.email.trim(), signupForm.password.trim(), signupForm.name.trim());
      toast({ title: t("common.success"), description: t("auth.signup.success_message") });
      navigate("/dashboard", { replace: true });
    } catch (err) {
      const description =
        (err as { message?: string })?.message ||
        t("auth.signup.error_message") ||
        t("common.error");
      setFormError(description);
      toast({ title: t("common.error"), description, variant: "destructive" });
    }
  };

  const disableSigninButton =
    loading || !signinForm.email.trim() || !signinForm.password.trim();
  const disableSignupButton =
    loading ||
    !signupForm.name.trim() ||
    !signupForm.email.trim() ||
    !signupForm.password.trim() ||
    !signupForm.confirmPassword.trim();

  return (
    <div
      className="relative min-h-screen bg-[radial-gradient(circle_at_top,hsl(var(var(--primary))/0.12),transparent_60%)]"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="absolute inset-0 bg-[linear-gradient(130deg,hsl(var(var(--background)))_20%,hsl(var(var(--secondary)))_100%)]" />
      <div className="absolute inset-0" style={{ backgroundImage: "var(var(--gradient-subtle))" }} />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
        <div className="w-full max-w-lg space-y-8">

          <div className="rounded-3xl border border-[hsl(var(var(--border)))] bg-[hsl(var(var(--card)))]/95 p-8 shadow-[var(var(--shadow-card))] backdrop-blur">
            <div className="flex flex-col items-center text-center">
          <div className="text-center">
<BrandLogo variant="icon" className="h-24"/>
          </div>
 
<BrandLogo variant="text" className="h-16"/>
 
              <p className="mt-2 text-sm text-[hsl(var(var(--slate-light)))]">
                {activeTab === "signin" ? t("auth.login.subtitle") : t("auth.signup.subtitle")}
              </p>
            </div>

            {formError ? (
              <div className="mt-6 flex items-center gap-2 rounded-lg border border-[hsl(var(var(--destructive)))]/40 bg-[hsl(var(var(--destructive)))]/10 px-3 py-2 text-sm text-[hsl(var(var(--destructive)))]">
                <AlertCircle className="h-4 w-4" />
                <span>{formError}</span>
              </div>
            ) : null}

            <Tabs
              value={activeTab}
              onValueChange={(value) => setActiveTab(value as AuthTab)}
              className="mt-6 w-full"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin" className="flex items-center gap-2">
                  <UserCheck className="h-4 w-4" />
                  {language === "ar" ? "تسجيل الدخول" : "Sign In"}
                </TabsTrigger>
                <TabsTrigger value="signup" className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  {language === "ar" ? "إنشاء حساب" : "Sign Up"}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="signin" className="mt-6">
                <form onSubmit={handleSignIn} className="space-y-4" noValidate>
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">{t("auth.login.email")}</Label>
                    <Input
                      id="signin-email"
                      type="email"
                      value={signinForm.email}
                      onChange={(event) =>
                        setSigninForm((prev) => ({ ...prev, email: event.target.value }))
                      }
                      placeholder={t("auth.login.email_placeholder")}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signin-password">{t("auth.login.password")}</Label>
                    <Input
                      id="signin-password"
                      type="password"
                      value={signinForm.password}
                      onChange={(event) =>
                        setSigninForm((prev) => ({ ...prev, password: event.target.value }))
                      }
                      placeholder={t("auth.login.password_placeholder")}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={disableSigninButton}>
                    {loading ? t("common.loading") : t("auth.login.submit")}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup" className="mt-6">
                <form onSubmit={handleSignUp} className="space-y-4" noValidate>
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">{t("auth.signup.name")}</Label>
                    <Input
                      id="signup-name"
                      type="text"
                      value={signupForm.name}
                      onChange={(event) =>
                        setSignupForm((prev) => ({ ...prev, name: event.target.value }))
                      }
                      placeholder={t("auth.signup.name_placeholder")}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">{t("auth.signup.email")}</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      value={signupForm.email}
                      onChange={(event) =>
                        setSignupForm((prev) => ({ ...prev, email: event.target.value }))
                      }
                      placeholder={t("auth.signup.email_placeholder")}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">{t("auth.signup.password")}</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      value={signupForm.password}
                      onChange={(event) =>
                        setSignupForm((prev) => ({ ...prev, password: event.target.value }))
                      }
                      placeholder={t("auth.signup.password_placeholder")}
                      required
                      minLength={6}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-confirm">{t("auth.signup.confirm_password")}</Label>
                    <Input
                      id="signup-confirm"
                      type="password"
                      value={signupForm.confirmPassword}
                      onChange={(event) =>
                        setSignupForm((prev) => ({ ...prev, confirmPassword: event.target.value }))
                      }
                      placeholder={t("auth.signup.confirm_password_placeholder")}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={disableSignupButton}>
                    {loading ? t("common.loading") : t("auth.signup.submit")}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-8 text-center text-sm text-[hsl(var(var(--slate-light)))]">
 
              <Link to="/" className="mt-3 inline-block transition-colors hover:text-[hsl(var(var(--primary)))]">
                {language === "ar" ? "← العودة إلى الصفحة الرئيسية" : "← Back to home"}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
