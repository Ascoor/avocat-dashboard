import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useLanguage } from '@/contexts/LanguageContext';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Plus, Briefcase, Award, Phone, Mail } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function Lawyers() {
  const { t, language } = useLanguage();

  const lawyers = [
    {
      id: 1,
      name: language === 'ar' ? 'أحمد محمود' : 'Ahmed Mahmoud',
      specialization: language === 'ar' ? 'قانون تجاري' : 'Commercial Law',
      position: language === 'ar' ? 'شريك' : 'Partner',
      casesCount: 18,
      phone: '+966 50 123 4567',
      email: 'ahmed.m@avocat.com',
      status: language === 'ar' ? 'متاح' : 'Available',
      initials: 'AM',
      color: 'from-blue-500 to-blue-600',
    },
    {
      id: 2,
      name: language === 'ar' ? 'سارة علي' : 'Sarah Ali',
      specialization: language === 'ar' ? 'قانون عمالي' : 'Labor Law',
      position: language === 'ar' ? 'محامية' : 'Lawyer',
      casesCount: 12,
      phone: '+966 55 234 5678',
      email: 'sarah.a@avocat.com',
      status: language === 'ar' ? 'في جلسة' : 'In Session',
      initials: 'SA',
      color: 'from-purple-500 to-purple-600',
    },
    {
      id: 3,
      name: language === 'ar' ? 'محمد حسن' : 'Mohamed Hassan',
      specialization: language === 'ar' ? 'قانون جنائي' : 'Criminal Law',
      position: language === 'ar' ? 'شريك' : 'Partner',
      casesCount: 22,
      phone: '+966 56 345 6789',
      email: 'm.hassan@avocat.com',
      status: language === 'ar' ? 'متاح' : 'Available',
      initials: 'MH',
      color: 'from-red-500 to-red-600',
    },
    {
      id: 4,
      name: language === 'ar' ? 'ليلى أحمد' : 'Layla Ahmed',
      specialization: language === 'ar' ? 'أحوال شخصية' : 'Family Law',
      position: language === 'ar' ? 'محامية' : 'Lawyer',
      casesCount: 9,
      phone: '+966 50 456 7890',
      email: 'layla.a@avocat.com',
      status: language === 'ar' ? 'خارج المكتب' : 'Out of Office',
      initials: 'LA',
      color: 'from-pink-500 to-pink-600',
    },
    {
      id: 5,
      name: language === 'ar' ? 'خالد سالم' : 'Khaled Salem',
      specialization: language === 'ar' ? 'قانون عقاري' : 'Real Estate Law',
      position: language === 'ar' ? 'محامي' : 'Lawyer',
      casesCount: 15,
      phone: '+966 55 567 8901',
      email: 'khaled.s@avocat.com',
      status: language === 'ar' ? 'متاح' : 'Available',
      initials: 'KS',
      color: 'from-green-500 to-green-600',
    },
    {
      id: 6,
      name: language === 'ar' ? 'منى يوسف' : 'Mona Youssef',
      specialization: language === 'ar' ? 'قانون ضريبي' : 'Tax Law',
      position: language === 'ar' ? 'محامية متدربة' : 'Associate Lawyer',
      casesCount: 6,
      phone: '+966 50 678 9012',
      email: 'mona.y@avocat.com',
      status: language === 'ar' ? 'متاح' : 'Available',
      initials: 'MY',
      color: 'from-orange-500 to-orange-600',
    },
  ];

  const getStatusColor = (status: string) => {
    const map: { [key: string]: string } = {
      'متاح': 'bg-green-500/10 text-green-500',
      'Available': 'bg-green-500/10 text-green-500',
      'في جلسة': 'bg-blue-500/10 text-blue-500',
      'In Session': 'bg-blue-500/10 text-blue-500',
      'خارج المكتب': 'bg-orange-500/10 text-orange-500',
      'Out of Office': 'bg-orange-500/10 text-orange-500',
    };
    return map[status] || 'bg-gray-500/10 text-gray-500';
  };

  const getPositionColor = (position: string) => {
    if (position === 'شريك' || position === 'Partner') {
      return 'bg-accent/10 text-accent';
    }
    return 'bg-primary/10 text-primary';
  };

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
            <h1 className="text-3xl font-bold">{t('lawyers')}</h1>
            <p className="text-muted-foreground">
              {language === 'ar' ? 'فريق المحامين والمستشارين' : 'Team of lawyers and consultants'}
            </p>
          </div>
          <Button className="bg-accent text-accent-foreground shadow-gold hover:shadow-xl">
            <Plus className="h-4 w-4 ltr:mr-2 rtl:ml-2" />
            {language === 'ar' ? 'محامي جديد' : 'New Lawyer'}
          </Button>
        </motion.div>

        {/* Lawyers Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {lawyers.map((lawyer, index) => (
            <motion.div
              key={lawyer.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="group overflow-hidden p-6 transition-all hover:shadow-custom-lg hover:shadow-gold/10">
                {/* Header with Avatar */}
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-16 w-16 border-2 border-accent/20">
                      <AvatarFallback className={`bg-gradient-to-br ${lawyer.color} text-xl font-bold text-white`}>
                        {lawyer.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-lg font-semibold">{lawyer.name}</h3>
                      <Badge className={getPositionColor(lawyer.position)} variant="secondary">
                        <Award className="h-3 w-3 ltr:mr-1 rtl:ml-1" />
                        {lawyer.position}
                      </Badge>
                    </div>
                  </div>
                  <Badge className={getStatusColor(lawyer.status)}>
                    {lawyer.status}
                  </Badge>
                </div>

                {/* Specialization */}
                <div className="mb-4">
                  <p className="text-sm text-muted-foreground">
                    {language === 'ar' ? 'التخصص' : 'Specialization'}
                  </p>
                  <p className="font-medium">{lawyer.specialization}</p>
                </div>

                {/* Cases Count */}
                <div className="mb-4 rounded-lg bg-muted/50 p-3">
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-accent" />
                    <span className="text-sm text-muted-foreground">
                      {language === 'ar' ? 'القضايا المسندة' : 'Assigned Cases'}
                    </span>
                  </div>
                  <p className="mt-1 text-2xl font-bold text-accent">{lawyer.casesCount}</p>
                </div>

                {/* Contact Info */}
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span dir="ltr">{lawyer.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span className="truncate" dir="ltr">{lawyer.email}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-4 flex gap-2 border-t border-border/50 pt-4">
                  <Button variant="outline" size="sm" className="flex-1">
                    {t('view')}
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    {t('edit')}
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
