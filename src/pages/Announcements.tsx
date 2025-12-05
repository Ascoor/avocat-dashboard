import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Megaphone, Plus, Pin, Calendar, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { AnnouncementDetailCard } from '@/components/details';

export default function Announcements() {
  const { t, language } = useLanguage();
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<any>(null);

  const announcements = [
    {
      id: '1',
      title: language === 'ar' ? 'تحديث نظام إدارة القضايا' : 'Case Management System Update',
      content: language === 'ar' 
        ? 'تم إضافة ميزات جديدة لتسهيل متابعة القضايا والجلسات. يرجى الاطلاع على الدليل الإرشادي للتعرف على التحديثات الجديدة والاستفادة من الميزات المضافة. شكراً لتعاونكم.'
        : 'New features added to facilitate case and session tracking. Please review the guide to learn about new updates and take advantage of added features. Thank you for your cooperation.',
      date: '2024-01-15',
      author: language === 'ar' ? 'إدارة النظام' : 'System Admin',
      isPinned: true,
      priority: 'important' as const,
      target: 'all' as const,
    },
    {
      id: '2',
      title: language === 'ar' ? 'اجتماع الفريق القانوني' : 'Legal Team Meeting',
      content: language === 'ar'
        ? 'اجتماع دوري يوم الأربعاء القادم الساعة 10 صباحاً لمناقشة القضايا المستعجلة وتوزيع المهام الجديدة. الحضور إلزامي لجميع المحامين.'
        : 'Regular meeting next Wednesday at 10 AM to discuss urgent cases and distribute new assignments. Attendance is mandatory for all lawyers.',
      date: '2024-01-14',
      author: language === 'ar' ? 'أحمد محمود' : 'Ahmed Mahmoud',
      isPinned: true,
      priority: 'urgent' as const,
      target: 'lawyers' as const,
    },
    {
      id: '3',
      title: language === 'ar' ? 'إجازة رسمية' : 'Official Holiday',
      content: language === 'ar'
        ? 'المكتب مغلق يوم الخميس القادم بمناسبة العطلة الرسمية. سيتم استئناف العمل يوم السبت.'
        : 'Office closed next Thursday for official holiday. Work will resume on Saturday.',
      date: '2024-01-12',
      author: language === 'ar' ? 'إدارة الموارد البشرية' : 'HR Department',
      isPinned: false,
      priority: 'normal' as const,
      target: 'all' as const,
    },
    {
      id: '4',
      title: language === 'ar' ? 'ورشة عمل قانونية' : 'Legal Workshop',
      content: language === 'ar'
        ? 'ورشة عمل حول التحديثات القانونية الأخيرة يوم السبت الساعة 2 مساءً في قاعة الاجتماعات الرئيسية.'
        : 'Workshop on recent legal updates Saturday at 2 PM in the main conference room.',
      date: '2024-01-10',
      author: language === 'ar' ? 'قسم التدريب' : 'Training Department',
      isPinned: false,
      priority: 'normal' as const,
      target: 'lawyers' as const,
    },
    {
      id: '5',
      title: language === 'ar' ? 'تحديث السياسات الداخلية' : 'Internal Policies Update',
      content: language === 'ar'
        ? 'تم تحديث دليل السياسات الداخلية. يرجى مراجعة النسخة الجديدة في قسم الموارد والتوقيع على الاطلاع.'
        : 'Internal policies guide updated. Please review the new version in Resources and sign acknowledgment.',
      date: '2024-01-08',
      author: language === 'ar' ? 'إدارة المكتب' : 'Office Management',
      isPinned: false,
      priority: 'important' as const,
      target: 'all' as const,
    },
  ];

  const getPriorityColor = (priority: string) => {
    const map: { [key: string]: string } = {
      'normal': 'bg-muted text-muted-foreground',
      'important': 'bg-gold/20 text-gold',
      'urgent': 'bg-legal-danger-500/20 text-legal-danger-500',
    };
    return map[priority] || 'bg-muted text-muted-foreground';
  };

  const getPriorityLabel = (priority: string) => {
    const labels: { [key: string]: { ar: string; en: string } } = {
      'normal': { ar: 'عادي', en: 'Normal' },
      'important': { ar: 'مهم', en: 'Important' },
      'urgent': { ar: 'عاجل', en: 'Urgent' },
    };
    return labels[priority] ? labels[priority][language === 'ar' ? 'ar' : 'en'] : priority;
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
          <Button className="bg-gradient-to-r from-gold to-exclusive text-white shadow-lg hover:opacity-90">
            <Plus className="h-4 w-4 ltr:mr-2 rtl:ml-2" />
            {language === 'ar' ? 'إعلان جديد' : 'New Announcement'}
          </Button>
        </motion.div>

        {/* Pinned Announcements */}
        {pinnedAnnouncements.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Pin className="h-5 w-5 text-gold" />
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
                <Card className="border-2 border-gold/30 bg-gradient-to-br from-gold/10 to-transparent p-6 shadow-lg transition-all hover:shadow-xl hover:shadow-gold/20">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-gold to-exclusive shadow-lg">
                      <Megaphone className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <Pin className="h-4 w-4 text-gold" />
                        <h3 className="text-lg font-semibold text-foreground">{announcement.title}</h3>
                        <Badge className={getPriorityColor(announcement.priority)}>
                          {getPriorityLabel(announcement.priority)}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground line-clamp-2">{announcement.content}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{announcement.date}</span>
                          </div>
                          <span>•</span>
                          <span>{announcement.author}</span>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-gold hover:text-gold hover:bg-gold/10"
                          onClick={() => setSelectedAnnouncement(announcement)}
                        >
                          <Eye className="h-4 w-4 ltr:mr-1 rtl:ml-1" />
                          {t('view')}
                        </Button>
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
              <Card className="p-6 transition-all hover:shadow-custom-lg hover:shadow-gold/10 bg-gradient-to-br from-card to-surface/50 border-border/50">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-brand-primary/20 to-exclusive/10 border border-brand-primary/20">
                    <Megaphone className="h-6 w-6 text-brand-primary" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-semibold text-foreground">{announcement.title}</h3>
                      <Badge className={getPriorityColor(announcement.priority)}>
                        {getPriorityLabel(announcement.priority)}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground line-clamp-2">{announcement.content}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>{announcement.date}</span>
                        </div>
                        <span>•</span>
                        <span>{announcement.author}</span>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-brand-primary hover:text-brand-primary hover:bg-brand-primary/10"
                        onClick={() => setSelectedAnnouncement(announcement)}
                      >
                        <Eye className="h-4 w-4 ltr:mr-1 rtl:ml-1" />
                        {t('view')}
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Announcement Detail Modal */}
      {selectedAnnouncement && (
        <AnnouncementDetailCard
          announcement={selectedAnnouncement}
          open={!!selectedAnnouncement}
          onClose={() => setSelectedAnnouncement(null)}
        />
      )}
    </DashboardLayout>
  );
}
