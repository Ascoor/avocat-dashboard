import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Settings as SettingsIcon, User, Bell, Lock, Globe } from 'lucide-react';

export default function Settings() {
  const { t, language } = useLanguage();

  const settingsSections = [
    {
      icon: User,
      title: language === 'ar' ? 'الملف الشخصي' : 'Profile',
      description: language === 'ar' ? 'إدارة بياناتك الشخصية' : 'Manage your personal information',
    },
    {
      icon: Bell,
      title: language === 'ar' ? 'الإشعارات' : 'Notifications',
      description: language === 'ar' ? 'إعدادات التنبيهات والإشعارات' : 'Alerts and notifications settings',
    },
    {
      icon: Lock,
      title: language === 'ar' ? 'الأمان' : 'Security',
      description: language === 'ar' ? 'كلمة المرور والأمان' : 'Password and security',
    },
    {
      icon: Globe,
      title: language === 'ar' ? 'اللغة والمنطقة' : 'Language & Region',
      description: language === 'ar' ? 'تفضيلات اللغة والمنطقة' : 'Language and region preferences',
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold">{t('settings')}</h1>
          <p className="text-muted-foreground">
            {language === 'ar' ? 'إدارة إعدادات النظام' : 'Manage system settings'}
          </p>
        </motion.div>

        {/* Settings Sections */}
        <div className="grid gap-6 md:grid-cols-2">
          {settingsSections.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="group cursor-pointer p-6 transition-all hover:shadow-custom-lg hover:shadow-gold/10">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-md transition-transform group-hover:scale-110">
                    <section.icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="mb-2 text-lg font-semibold">{section.title}</h3>
                    <p className="text-sm text-muted-foreground">{section.description}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Placeholder Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-12 text-center">
            <SettingsIcon className="mx-auto mb-4 h-12 w-12 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground">
              {language === 'ar' 
                ? 'صفحة الإعدادات قيد التطوير' 
                : 'Settings page under development'}
            </p>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
