import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Settings, Sun, Moon, Globe, Bell, Shield, Smartphone,
  Key, Monitor, Laptop, History, LogOut
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

type Theme = "light" | "dark";

const SettingsPage: React.FC = () => {
  const { isRTL, language, setLanguage } = useLanguage();
  const { theme, setTheme } = useTheme();
  
  const [activeTab, setActiveTab] = useState("appearance");
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    caseUpdates: true,
    taskReminders: true,
    invoiceAlerts: true
  });

  const labels = {
    title: isRTL ? "الإعدادات" : "Settings",
    subtitle: isRTL ? "تخصيص تجربتك وإدارة حسابك" : "Customize your experience and manage your account",
    tabs: {
      appearance: isRTL ? "المظهر" : "Appearance",
      language: isRTL ? "اللغة" : "Language",
      notifications: isRTL ? "الإشعارات" : "Notifications",
      security: isRTL ? "الأمان" : "Security"
    },
    theme: {
      title: isRTL ? "المظهر" : "Theme",
      description: isRTL ? "اختر المظهر المفضل لديك" : "Choose your preferred theme",
      light: isRTL ? "فاتح" : "Light",
      dark: isRTL ? "داكن" : "Dark"
    },
    language: {
      title: isRTL ? "اللغة" : "Language",
      description: isRTL ? "اختر لغة الواجهة" : "Choose interface language",
      arabic: "العربية",
      english: "English",
      current: isRTL ? "اللغة الحالية" : "Current Language"
    },
    notifications: {
      title: isRTL ? "إعدادات الإشعارات" : "Notification Settings",
      description: isRTL ? "تحكم في كيفية استلام الإشعارات" : "Control how you receive notifications",
      channels: {
        email: isRTL ? "البريد الإلكتروني" : "Email",
        push: isRTL ? "إشعارات الدفع" : "Push Notifications",
        sms: isRTL ? "الرسائل النصية" : "SMS Messages"
      },
      types: {
        caseUpdates: isRTL ? "تحديثات القضايا" : "Case Updates",
        taskReminders: isRTL ? "تذكيرات المهام" : "Task Reminders",
        invoiceAlerts: isRTL ? "تنبيهات الفواتير" : "Invoice Alerts"
      }
    },
    security: {
      title: isRTL ? "الأمان" : "Security",
      twoFactor: {
        title: isRTL ? "المصادقة الثنائية" : "Two-Factor Authentication",
        description: isRTL ? "أضف طبقة حماية إضافية لحسابك" : "Add an extra layer of security to your account",
        enabled: isRTL ? "مفعّل" : "Enabled"
      },
      sessions: {
        title: isRTL ? "الجلسات النشطة" : "Active Sessions",
        description: isRTL ? "الأجهزة المتصلة بحسابك حالياً" : "Devices currently connected to your account",
        current: isRTL ? "الجلسة الحالية" : "Current Session",
        lastActive: isRTL ? "آخر نشاط" : "Last Active",
        terminate: isRTL ? "إنهاء الجلسة" : "Terminate",
        terminateAll: isRTL ? "إنهاء جميع الجلسات" : "Terminate All Sessions"
      },
      auditLog: {
        title: isRTL ? "سجل النشاطات" : "Audit Log",
        description: isRTL ? "سجل الأنشطة الأخيرة على حسابك" : "Recent activities on your account",
        viewAll: isRTL ? "عرض الكل" : "View All"
      }
    }
  };

  const sessions = [
    { 
      id: 1, 
      device: "MacBook Pro", 
      browser: "Chrome", 
      location: isRTL ? "الرياض، السعودية" : "Riyadh, Saudi Arabia",
      lastActive: isRTL ? "الآن" : "Now",
      current: true,
      icon: Laptop
    },
    { 
      id: 2, 
      device: "iPhone 14 Pro", 
      browser: "Safari", 
      location: isRTL ? "الرياض، السعودية" : "Riyadh, Saudi Arabia",
      lastActive: isRTL ? "منذ ساعتين" : "2 hours ago",
      current: false,
      icon: Smartphone
    },
    { 
      id: 3, 
      device: "Windows PC", 
      browser: "Firefox", 
      location: isRTL ? "جدة، السعودية" : "Jeddah, Saudi Arabia",
      lastActive: isRTL ? "منذ يوم" : "1 day ago",
      current: false,
      icon: Monitor
    }
  ];

  const auditLogs = [
    { 
      id: 1, 
      action: isRTL ? "تسجيل دخول" : "Login",
      details: isRTL ? "تسجيل دخول ناجح" : "Successful login",
      timestamp: isRTL ? "منذ 5 دقائق" : "5 minutes ago",
      ip: "192.168.1.1"
    },
    { 
      id: 2, 
      action: isRTL ? "تحديث الملف الشخصي" : "Profile Update",
      details: isRTL ? "تم تحديث البريد الإلكتروني" : "Email updated",
      timestamp: isRTL ? "منذ ساعة" : "1 hour ago",
      ip: "192.168.1.1"
    },
    { 
      id: 3, 
      action: isRTL ? "تغيير كلمة المرور" : "Password Change",
      details: isRTL ? "تم تغيير كلمة المرور بنجاح" : "Password changed successfully",
      timestamp: isRTL ? "منذ يومين" : "2 days ago",
      ip: "192.168.1.2"
    }
  ];

  const ThemeOption: React.FC<{ value: Theme; icon: React.ReactNode; label: string }> = ({ value, icon, label }) => (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => setTheme(value)}
      className={cn(
        "flex flex-col items-center gap-3 p-6 rounded-xl border-2 transition-all duration-300",
        theme === value 
          ? "border-primary bg-primary/5 shadow-lg" 
          : "border-border hover:border-primary/50 hover:bg-muted/50"
      )}
    >
      <div className={cn(
        "p-4 rounded-full transition-colors",
        theme === value ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
      )}>
        {icon}
      </div>
      <span className={cn(
        "font-medium",
        theme === value ? "text-primary" : "text-foreground"
      )}>
        {label}
      </span>
      {theme === value && (
        <Badge className="bg-primary text-primary-foreground">
          {isRTL ? "مفعّل" : "Active"}
        </Badge>
      )}
    </motion.button>
  );

  const LanguageOption: React.FC<{ value: "ar" | "en"; label: string; nativeLabel: string }> = ({ value, label, nativeLabel }) => (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => setLanguage(value)}
      className={cn(
        "flex flex-col items-center gap-3 p-6 rounded-xl border-2 transition-all duration-300",
        language === value 
          ? "border-primary bg-primary/5 shadow-lg" 
          : "border-border hover:border-primary/50 hover:bg-muted/50"
      )}
    >
      <div className={cn(
        "text-3xl font-bold",
        language === value ? "text-primary" : "text-foreground"
      )}>
        {value === "ar" ? "ع" : "En"}
      </div>
      <div className="text-center">
        <p className={cn(
          "font-medium",
          language === value ? "text-primary" : "text-foreground"
        )}>
          {nativeLabel}
        </p>
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
      {language === value && (
        <Badge className="bg-primary text-primary-foreground">
          {labels.language.current}
        </Badge>
      )}
    </motion.button>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">{labels.title}</h1>
        <p className="text-muted-foreground">{labels.subtitle}</p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-2 lg:grid-cols-4 w-full lg:w-auto">
          <TabsTrigger value="appearance" className="gap-2">
            <Sun className="h-4 w-4" />
            <span className="hidden sm:inline">{labels.tabs.appearance}</span>
          </TabsTrigger>
          <TabsTrigger value="language" className="gap-2">
            <Globe className="h-4 w-4" />
            <span className="hidden sm:inline">{labels.tabs.language}</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">{labels.tabs.notifications}</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">{labels.tabs.security}</span>
          </TabsTrigger>
        </TabsList>

        {/* Appearance Tab */}
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sun className="h-5 w-5" />
                {labels.theme.title}
              </CardTitle>
              <CardDescription>{labels.theme.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md">
                <ThemeOption 
                  value="light" 
                  icon={<Sun className="h-6 w-6" />} 
                  label={labels.theme.light} 
                />
                <ThemeOption 
                  value="dark" 
                  icon={<Moon className="h-6 w-6" />} 
                  label={labels.theme.dark} 
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Language Tab */}
        <TabsContent value="language">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                {labels.language.title}
              </CardTitle>
              <CardDescription>{labels.language.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md">
                <LanguageOption 
                  value="ar" 
                  label="Arabic"
                  nativeLabel={labels.language.arabic} 
                />
                <LanguageOption 
                  value="en" 
                  label="English"
                  nativeLabel={labels.language.english} 
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  {labels.notifications.title}
                </CardTitle>
                <CardDescription>{labels.notifications.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Notification Channels */}
                <div className="space-y-4">
                  <h4 className="font-medium text-foreground">{isRTL ? "قنوات الإشعارات" : "Notification Channels"}</h4>
                  {Object.entries(labels.notifications.channels).map(([key, label]) => (
                    <div key={key} className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                      <Label htmlFor={key} className="cursor-pointer">{label}</Label>
                      <Switch 
                        id={key}
                        checked={notifications[key as keyof typeof notifications]}
                        onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, [key]: checked }))}
                      />
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Notification Types */}
                <div className="space-y-4">
                  <h4 className="font-medium text-foreground">{isRTL ? "أنواع الإشعارات" : "Notification Types"}</h4>
                  {Object.entries(labels.notifications.types).map(([key, label]) => (
                    <div key={key} className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                      <Label htmlFor={`type-${key}`} className="cursor-pointer">{label}</Label>
                      <Switch 
                        id={`type-${key}`}
                        checked={notifications[key as keyof typeof notifications]}
                        onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, [key]: checked }))}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security">
          <div className="space-y-6">
            {/* 2FA */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Key className="h-5 w-5" />
                      {labels.security.twoFactor.title}
                    </CardTitle>
                    <CardDescription>{labels.security.twoFactor.description}</CardDescription>
                  </div>
                  <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">
                    {labels.security.twoFactor.enabled}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="gap-2">
                  <Shield className="h-4 w-4" />
                  {isRTL ? "إدارة المصادقة الثنائية" : "Manage 2FA"}
                </Button>
              </CardContent>
            </Card>

            {/* Active Sessions */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Monitor className="h-5 w-5" />
                      {labels.security.sessions.title}
                    </CardTitle>
                    <CardDescription>{labels.security.sessions.description}</CardDescription>
                  </div>
                  <Button variant="destructive" size="sm" className="gap-2">
                    <LogOut className="h-4 w-4" />
                    {labels.security.sessions.terminateAll}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {sessions.map((session, index) => (
                    <motion.div
                      key={session.id}
                      initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={cn(
                        "flex items-center justify-between p-4 rounded-lg",
                        session.current ? "bg-primary/5 border border-primary/20" : "bg-muted/30"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "p-2 rounded-full",
                          session.current ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                        )}>
                          <session.icon className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-foreground">{session.device}</p>
                            {session.current && (
                              <Badge variant="secondary" className="text-xs">
                                {labels.security.sessions.current}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {session.browser} • {session.location}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {labels.security.sessions.lastActive}: {session.lastActive}
                          </p>
                        </div>
                      </div>
                      {!session.current && (
                        <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                          {labels.security.sessions.terminate}
                        </Button>
                      )}
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Audit Log */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <History className="h-5 w-5" />
                      {labels.security.auditLog.title}
                    </CardTitle>
                    <CardDescription>{labels.security.auditLog.description}</CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    {labels.security.auditLog.viewAll}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {auditLogs.map((log, index) => (
                    <motion.div
                      key={log.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/30"
                    >
                      <div>
                        <p className="font-medium text-foreground">{log.action}</p>
                        <p className="text-sm text-muted-foreground">{log.details}</p>
                      </div>
                      <div className="text-end">
                        <p className="text-sm text-muted-foreground">{log.timestamp}</p>
                        <p className="text-xs text-muted-foreground font-mono">{log.ip}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default SettingsPage;
