import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useLanguage } from '@/contexts/LanguageContext';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Search, Plus, Phone, Mail, Briefcase, Building2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function Clients() {
  const { t, language } = useLanguage();

  const clients = [
    {
      id: 1,
      name: language === 'ar' ? 'شركة النور للتجارة' : 'Al-Nour Trading Company',
      type: language === 'ar' ? 'شركة' : 'Company',
      phone: '+966 50 123 4567',
      email: 'contact@alnour.com',
      casesCount: 5,
      status: language === 'ar' ? 'نشط' : 'Active',
      initials: 'AN',
    },
    {
      id: 2,
      name: language === 'ar' ? 'محمد أحمد' : 'Mohamed Ahmed',
      type: language === 'ar' ? 'فرد' : 'Individual',
      phone: '+966 55 234 5678',
      email: 'm.ahmed@email.com',
      casesCount: 2,
      status: language === 'ar' ? 'نشط' : 'Active',
      initials: 'MA',
    },
    {
      id: 3,
      name: language === 'ar' ? 'فاطمة خالد' : 'Fatima Khaled',
      type: language === 'ar' ? 'فرد' : 'Individual',
      phone: '+966 56 345 6789',
      email: 'f.khaled@email.com',
      casesCount: 1,
      status: language === 'ar' ? 'نشط' : 'Active',
      initials: 'FK',
    },
    {
      id: 4,
      name: language === 'ar' ? 'شركة البناء الحديثة' : 'Modern Construction Co.',
      type: language === 'ar' ? 'شركة' : 'Company',
      phone: '+966 50 456 7890',
      email: 'info@modernconstruction.com',
      casesCount: 3,
      status: language === 'ar' ? 'نشط' : 'Active',
      initials: 'MC',
    },
    {
      id: 5,
      name: language === 'ar' ? 'عبدالله سالم' : 'Abdullah Salem',
      type: language === 'ar' ? 'فرد' : 'Individual',
      phone: '+966 55 567 8901',
      email: 'a.salem@email.com',
      casesCount: 1,
      status: language === 'ar' ? 'غير نشط' : 'Inactive',
      initials: 'AS',
    },
    {
      id: 6,
      name: language === 'ar' ? 'بنك الوطني' : 'National Bank',
      type: language === 'ar' ? 'شركة' : 'Company',
      phone: '+966 50 678 9012',
      email: 'legal@nationalbank.com',
      casesCount: 7,
      status: language === 'ar' ? 'نشط' : 'Active',
      initials: 'NB',
    },
  ];

  const getStatusColor = (status: string) => {
    if (status === 'نشط' || status === 'Active') {
      return 'bg-green-500/10 text-green-500';
    }
    return 'bg-gray-500/10 text-gray-500';
  };

  const getTypeColor = (type: string) => {
    if (type === 'شركة' || type === 'Company') {
      return 'bg-blue-500/10 text-blue-500';
    }
    return 'bg-purple-500/10 text-purple-500';
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
            <h1 className="text-3xl font-bold">{t('clients')}</h1>
            <p className="text-muted-foreground">
              {language === 'ar' ? 'إدارة بيانات العملاء' : 'Manage client information'}
            </p>
          </div>
          <Button className="bg-accent text-accent-foreground shadow-gold hover:shadow-xl">
            <Plus className="h-4 w-4 ltr:mr-2 rtl:ml-2" />
            {language === 'ar' ? 'عميل جديد' : 'New Client'}
          </Button>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-4">
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute top-3 h-4 w-4 text-muted-foreground ltr:left-3 rtl:right-3" />
                <Input
                  placeholder={t('search') + '...'}
                  className="ltr:pl-9 rtl:pr-9"
                />
              </div>
              <Button variant="outline">
                {t('filter')}
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Clients Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {clients.map((client, index) => (
            <motion.div
              key={client.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.05 }}
            >
              <Card className="group p-6 transition-all hover:shadow-custom-lg hover:shadow-gold/10">
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12 border-2 border-accent/20">
                      <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground">
                        {client.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{client.name}</h3>
                      <Badge className={getTypeColor(client.type)} variant="secondary">
                        {client.type === 'شركة' || client.type === 'Company' ? (
                          <Building2 className="h-3 w-3 ltr:mr-1 rtl:ml-1" />
                        ) : (
                          <span className="ltr:mr-1 rtl:ml-1">👤</span>
                        )}
                        {client.type}
                      </Badge>
                    </div>
                  </div>
                  <Badge className={getStatusColor(client.status)}>
                    {client.status}
                  </Badge>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span dir="ltr">{client.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span className="truncate" dir="ltr">{client.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Briefcase className="h-4 w-4" />
                    <span>
                      {client.casesCount} {language === 'ar' ? 'قضية' : 'cases'}
                    </span>
                  </div>
                </div>

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
