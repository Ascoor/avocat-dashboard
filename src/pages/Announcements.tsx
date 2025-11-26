import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Megaphone, Plus, Pin, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function Announcements() {
  const { t, language } = useLanguage();

  const announcements = [
    {
      id: 1,
      title: language === 'ar' ? 'تحديث نظام إدارة القضايا' : 'Case Management System Update',
      content: language === 'ar' 
        ? 'تم إضافة ميزات جديدة لتسهيل متابعة القضايا والجلسات. يرجى الاطلاع على الدليل الإرشادي.'
        : 'New features added to facilitate case and session tracking. Please review the guide.',
      date: '2024-01-15',
      author: language === 'ar' ? 'إدارة النظام' : 'System Admin',
      isPinned: true,
      category: language === 'ar' ? 'تقني' : 'Technical',
    },
    {
      id: 2,
      title: language === 'ar' ? 'اجتماع الفريق القانوني' : 'Legal Team Meeting',
      content: language === 'ar'
        ? 'اجتماع دوري يوم الأربعاء القادم الساعة 10 صباحاً لمناقشة القضايا المستعجلة.'
        : 'Regular meeting next Wednesday at 10 AM to discuss urgent cases.',
      date: '2024-01-14',
      author: language === 'ar' ? 'أحمد محمود' : 'Ahmed Mahmoud',
      isPinned: true,
      category: language === 'ar' ? 'اجتماعات' : 'Meetings',
    },
    {
      id: 3,
      title: language === 'ar' ? 'إجازة رسمية' : 'Official Holiday',
      content: language === 'ar'
        ? 'المكتب مغلق يوم الخميس القادم بمناسبة العطلة الرسمية.'
        : 'Office closed next Thursday for official holiday.',
      date: '2024-01-12',
      author: language === 'ar' ? 'إدارة الموارد البشرية' : 'HR Department',
      isPinned: false,
      category: language === 'ar' ? 'عام' : 'General',
    },
    {
      id: 4,
      title: language === 'ar' ? 'ورشة عمل قانونية' : 'Legal Workshop',
      content: language === 'ar'
        ? 'ورشة عمل حول التحديثات القانونية الأخيرة يوم السبت الساعة 2 مساءً.'
        : 'Workshop on recent legal updates Saturday at 2 PM.',
      date: '2024-01-10',
      author: language === 'ar' ? 'قسم التدريب' : 'Training Department',
      isPinned: false,
      category: language === 'ar' ? 'تدريب' : 'Training',
    },
    {
      id: 5,
      title: language === 'ar' ? 'تحديث السياسات الداخلية' : 'Internal Policies Update',
      content: language === 'ar'
        ? 'تم تحديث دليل السياسات الداخلية. يرجى مراجعة النسخة الجديدة في قسم الموارد.'
        : 'Internal policies guide updated. Please review the new version in Resources.',
      date: '2024-01-08',
      author: language === 'ar' ? 'إدارة المكتب' : 'Office Management',
      isPinned: false,
      category: language === 'ar' ? 'سياسات' : 'Policies',
    },
  ];

  const getCategoryColor = (category: string) => {
    const map: { [key: string]: string } = {
      'تقني': 'bg-blue-500/10 text-blue-500',
      'Technical': 'bg-blue-500/10 text-blue-500',
      'اجتماعات': 'bg-purple-500/10 text-purple-500',
      'Meetings': 'bg-purple-500/10 text-purple-500',
      'عام': 'bg-gray-500/10 text-gray-500',
      'General': 'bg-gray-500/10 text-gray-500',
      'تدريب': 'bg-green-500/10 text-green-500',
      'Training': 'bg-green-500/10 text-green-500',
      'سياسات': 'bg-orange-500/10 text-orange-500',
      'Policies': 'bg-orange-500/10 text-orange-500',
    };
    return map[category] || 'bg-gray-500/10 text-gray-500';
  };

  const pinnedAnnouncements = announcements.filter(a => a.isPinned);
  const regularAnnouncements = announcements.filter(a => !a.isPinned);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold">{t('announcements')}</h1>
            <p className="text-muted-foreground">
              {language === 'ar' ? 'آخر الأخبار والتحديثات' : 'Latest news and updates'}
            </p>
          </div>
          <Button className="bg-accent text-accent-foreground shadow-gold hover:shadow-xl">
            <Plus className="h-4 w-4 ltr:mr-2 rtl:ml-2" />
            {language === 'ar' ? 'إعلان جديد' : 'New Announcement'}
          </Button>
        </motion.div>

        {/* Pinned Announcements */}
        {pinnedAnnouncements.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Pin className="h-5 w-5 text-accent" />
              <h2 className="text-xl font-semibold">
                {language === 'ar' ? 'إعلانات مثبتة' : 'Pinned Announcements'}
              </h2>
            </div>
            
            {pinnedAnnouncements.map((announcement, index) => (
              <motion.div
                key={announcement.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="border-2 border-accent/20 bg-accent/5 p-6 shadow-gold/20 transition-all hover:shadow-custom-lg hover:shadow-gold/30">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-accent/20">
                      <Megaphone className="h-6 w-6 text-accent" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <Pin className="h-4 w-4 text-accent" />
                        <h3 className="text-lg font-semibold">{announcement.title}</h3>
                        <Badge className={getCategoryColor(announcement.category)}>
                          {announcement.category}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground">{announcement.content}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>{announcement.date}</span>
                        </div>
                        <span>•</span>
                        <span>{announcement.author}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Regular Announcements */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">
            {language === 'ar' ? 'جميع الإعلانات' : 'All Announcements'}
          </h2>
          
          {regularAnnouncements.map((announcement, index) => (
            <motion.div
              key={announcement.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: (pinnedAnnouncements.length + index) * 0.1 }}
            >
              <Card className="p-6 transition-all hover:shadow-custom-lg hover:shadow-gold/10">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary/10 to-accent/10">
                    <Megaphone className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-semibold">{announcement.title}</h3>
                      <Badge className={getCategoryColor(announcement.category)}>
                        {announcement.category}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground">{announcement.content}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{announcement.date}</span>
                      </div>
                      <span>•</span>
                      <span>{announcement.author}</span>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
