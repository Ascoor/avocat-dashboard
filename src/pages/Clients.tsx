import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useLanguage } from '@/contexts/LanguageContext';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Search, Plus, Phone, Mail, Briefcase, Building2, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ClientDetailCard } from '@/components/details';

export default function Clients() {
  const { t, language } = useLanguage();
  const [selectedClient, setSelectedClient] = useState<any>(null);

  const clients = [
    {
      id: '1',
      name: language === 'ar' ? 'شركة النور للتجارة' : 'Al-Nour Trading Company',
      type: 'company' as const,
      phone: '+966 50 123 4567',
      email: 'contact@alnour.com',
      address: language === 'ar' ? 'الرياض، حي العليا' : 'Riyadh, Olaya District',
      nationalId: '1234567890',
      casesCount: 5,
      status: 'active' as const,
      joinDate: '2023-05-15',
      initials: 'AN',
      cases: [
        { id: '1', title: language === 'ar' ? 'نزاع عقد تجاري' : 'Commercial Contract Dispute', status: language === 'ar' ? 'قيد الإجراء' : 'In Progress' },
        { id: '2', title: language === 'ar' ? 'تحصيل ديون' : 'Debt Collection', status: language === 'ar' ? 'جديدة' : 'New' },
      ],
    },
    {
      id: '2',
      name: language === 'ar' ? 'محمد أحمد' : 'Mohamed Ahmed',
      type: 'individual' as const,
      phone: '+966 55 234 5678',
      email: 'm.ahmed@email.com',
      address: language === 'ar' ? 'جدة، حي الروضة' : 'Jeddah, Rawdah District',
      nationalId: '1122334455',
      casesCount: 2,
      status: 'active' as const,
      joinDate: '2023-08-20',
      initials: 'MA',
      cases: [
        { id: '3', title: language === 'ar' ? 'قضية عمالية' : 'Labor Dispute', status: language === 'ar' ? 'جديدة' : 'New' },
      ],
    },
    {
      id: '3',
      name: language === 'ar' ? 'فاطمة خالد' : 'Fatima Khaled',
      type: 'individual' as const,
      phone: '+966 56 345 6789',
      email: 'f.khaled@email.com',
      nationalId: '2233445566',
      casesCount: 1,
      status: 'active' as const,
      joinDate: '2024-01-10',
      initials: 'FK',
      cases: [
        { id: '4', title: language === 'ar' ? 'استئناف حكم مدني' : 'Civil Judgment Appeal', status: language === 'ar' ? 'قيد الإجراء' : 'In Progress' },
      ],
    },
    {
      id: '4',
      name: language === 'ar' ? 'شركة البناء الحديثة' : 'Modern Construction Co.',
      type: 'company' as const,
      phone: '+966 50 456 7890',
      email: 'info@modernconstruction.com',
      address: language === 'ar' ? 'الدمام، حي الفيصلية' : 'Dammam, Faisaliyah District',
      nationalId: '9876543210',
      casesCount: 3,
      status: 'active' as const,
      joinDate: '2023-03-01',
      initials: 'MC',
      cases: [],
    },
    {
      id: '5',
      name: language === 'ar' ? 'عبدالله سالم' : 'Abdullah Salem',
      type: 'individual' as const,
      phone: '+966 55 567 8901',
      email: 'a.salem@email.com',
      casesCount: 1,
      status: 'inactive' as const,
      joinDate: '2022-11-15',
      initials: 'AS',
      cases: [],
    },
    {
      id: '6',
      name: language === 'ar' ? 'بنك الوطني' : 'National Bank',
      type: 'company' as const,
      phone: '+966 50 678 9012',
      email: 'legal@nationalbank.com',
      address: language === 'ar' ? 'الرياض، حي الملك فهد' : 'Riyadh, King Fahd District',
      nationalId: '5544332211',
      casesCount: 7,
      status: 'active' as const,
      joinDate: '2022-06-01',
      initials: 'NB',
      cases: [],
    },
  ];

  const getStatusColor = (status: string) => {
    if (status === 'active') {
      return 'bg-legal-success-500/20 text-legal-success-500';
    }
    return 'bg-muted text-muted-foreground';
  };

  const getTypeColor = (type: string) => {
    if (type === 'company') {
      return 'bg-exclusive/20 text-exclusive';
    }
    return 'bg-neon/20 text-neon';
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
          <Button className="bg-gradient-to-r from-brand-primary to-gold text-white shadow-lg hover:opacity-90">
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
          <Card className="p-4 bg-gradient-to-r from-surface/50 to-card border-border/50">
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute top-3 h-4 w-4 text-muted-foreground ltr:left-3 rtl:right-3" />
                <Input
                  placeholder={t('search') + '...'}
                  className="ltr:pl-9 rtl:pr-9 bg-background/50"
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
              <Card className="group p-6 transition-all hover:shadow-custom-lg hover:shadow-gold/10 bg-gradient-to-br from-card to-surface/50 border-border/50">
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12 border-2 border-gold/30">
                      <AvatarFallback className="bg-gradient-to-br from-brand-primary to-gold text-white font-semibold">
                        {client.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-foreground">{client.name}</h3>
                      <Badge className={getTypeColor(client.type)} variant="secondary">
                        {client.type === 'company' ? (
                          <Building2 className="h-3 w-3 ltr:mr-1 rtl:ml-1" />
                        ) : (
                          <span className="ltr:mr-1 rtl:ml-1">👤</span>
                        )}
                        {client.type === 'company' 
                          ? (language === 'ar' ? 'شركة' : 'Company')
                          : (language === 'ar' ? 'فرد' : 'Individual')
                        }
                      </Badge>
                    </div>
                  </div>
                  <Badge className={getStatusColor(client.status)}>
                    {client.status === 'active' 
                      ? (language === 'ar' ? 'نشط' : 'Active')
                      : (language === 'ar' ? 'غير نشط' : 'Inactive')
                    }
                  </Badge>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-4 w-4 text-brand-primary" />
                    <span dir="ltr">{client.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-4 w-4 text-gold" />
                    <span className="truncate" dir="ltr">{client.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Briefcase className="h-4 w-4 text-exclusive" />
                    <span>
                      {client.casesCount} {language === 'ar' ? 'قضية' : 'cases'}
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex gap-2 border-t border-border/50 pt-4">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 hover:bg-brand-primary/10 hover:text-brand-primary hover:border-brand-primary/30"
                    onClick={() => setSelectedClient(client)}
                  >
                    <Eye className="h-4 w-4 ltr:mr-1 rtl:ml-1" />
                    {t('view')}
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 hover:bg-gold/10 hover:text-gold hover:border-gold/30">
                    {t('edit')}
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Client Detail Modal */}
      {selectedClient && (
        <ClientDetailCard
          client={selectedClient}
          open={!!selectedClient}
          onClose={() => setSelectedClient(null)}
        />
      )}
    </DashboardLayout>
  );
}
