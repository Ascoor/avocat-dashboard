import { 
  LayoutDashboard, 
  Briefcase, 
  Calendar, 
  FileText,
  Users, 
  UserX,
  Archive,
  Search,
  FileEdit,
  UsersRound,
  Trophy,
  Settings as SettingsIcon,
  Building2,
  Scale,
  UserCog,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Folder,
  Headphones,
  Globe
} from 'lucide-react';
import { NavLink } from './NavLink';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { useSidebar } from '@/contexts/SidebarContext';

interface MenuItem {
  icon: React.ElementType;
  label: string;
  path: string;
}

interface MenuGroup {
  id: string;
  icon: React.ElementType;
  label: string;
  items: MenuItem[];
}

export const Sidebar = () => {
  const { t, direction } = useLanguage();
  const { isCollapsed, toggleCollapsed } = useSidebar();
  const [openGroups, setOpenGroups] = useState<string[]>(['services', 'system']);

  const isOpen = !isCollapsed;

  const toggleGroup = (groupId: string) => {
    setOpenGroups(prev => 
      prev.includes(groupId) 
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  };

  // Main menu items (no group)
  const mainItems: MenuItem[] = [
    { icon: LayoutDashboard, label: t('dashboard'), path: '/dashboard' },
    { icon: Briefcase, label: t('cases'), path: '/cases' },
  ];

  // Service groups
  const serviceGroups: MenuGroup[] = [
    {
      id: 'workFollow',
      icon: Folder,
      label: t('workFollowUp'),
      items: [
        { icon: Calendar, label: t('sessions'), path: '/sessions' },
        { icon: FileText, label: t('procedures'), path: '/procedures' },
      ]
    },
    {
      id: 'customerService',
      icon: Headphones,
      label: t('customerService'),
      items: [
        { icon: Users, label: t('clients'), path: '/clients' },
        { icon: UserX, label: t('clientsNoAgency'), path: '/clients-no-agency' },
        { icon: Archive, label: t('archive'), path: '/archive' },
        { icon: Search, label: t('courtSearch'), path: '/court-search' },
      ]
    },
    {
      id: 'siteManagement',
      icon: Globe,
      label: t('siteManagement'),
      items: [
        { icon: FileEdit, label: t('sitePages'), path: '/site-pages' },
        { icon: UsersRound, label: t('team'), path: '/team' },
        { icon: Trophy, label: t('achievements'), path: '/achievements' },
        { icon: SettingsIcon, label: t('siteSettings'), path: '/site-settings' },
      ]
    },
  ];

  // System group
  const systemItems: MenuItem[] = [
    { icon: SettingsIcon, label: t('settings'), path: '/settings' },
    { icon: Building2, label: t('officeSettings'), path: '/office-settings' },
    { icon: Scale, label: t('courtSettings'), path: '/court-settings' },
    { icon: UserCog, label: t('lawyers'), path: '/lawyers' },
    { icon: ShieldCheck, label: t('usersPermissions'), path: '/users-permissions' },
  ];

  const renderMenuItem = (item: MenuItem, isSubItem = false) => (
    <NavLink
      key={item.path}
      to={item.path}
      className={cn(
        'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
        'text-sidebar-foreground hover:bg-sidebar-item-hover-bg',
        isSubItem && 'py-2 text-xs',
        !isOpen && 'justify-center px-2'
      )}
      activeClassName="bg-sidebar-item-active-bg text-accent shadow-[var(--sidebar-item-active-shadow)]"
    >
      <item.icon className={cn('flex-shrink-0', isSubItem ? 'h-4 w-4' : 'h-5 w-5')} />
      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 'auto' }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.2 }}
            className="truncate"
          >
            {item.label}
          </motion.span>
        )}
      </AnimatePresence>
    </NavLink>
  );

  const renderSubGroup = (group: MenuGroup) => (
    <Collapsible
      key={group.id}
      open={isOpen && openGroups.includes(group.id)}
      onOpenChange={() => isOpen && toggleGroup(group.id)}
    >
      <CollapsibleTrigger asChild>
        <button
          className={cn(
            'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all',
            'text-sidebar-text-muted hover:bg-sidebar-subitem-hover-bg hover:text-sidebar-hover-foreground',
            !isOpen && 'justify-center px-2'
          )}
        >
          <group.icon className="h-4 w-4 flex-shrink-0" />
          <AnimatePresence mode="wait">
            {isOpen && (
              <>
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 truncate text-start"
                >
                  {group.label}
                </motion.span>
                <motion.div
                  initial={{ rotate: 0 }}
                  animate={{ rotate: openGroups.includes(group.id) ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="h-4 w-4" />
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className={cn('space-y-0.5', direction === 'rtl' ? 'pr-4' : 'pl-4')}
        >
          {group.items.map(item => renderMenuItem(item, true))}
        </motion.div>
      </CollapsibleContent>
    </Collapsible>
  );

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleCollapsed}
            className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          width: isOpen ? '17rem' : '4.5rem',
          x: 0,
        }}
        className={cn(
          'fixed top-16 z-50 h-[calc(100vh-4rem)] border-border/40 bg-sidebar shadow-custom-lg transition-all duration-300',
          'lg:static lg:translate-x-0',
          !isOpen && 'max-lg:-translate-x-full',
          direction === 'rtl' ? 'right-0 border-l' : 'left-0 border-r'
        )}
      >
        <div className="flex h-full flex-col">
          {/* Toggle Button */}
          <div className="flex items-center justify-end border-b border-sidebar-border p-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleCollapsed}
              className="h-8 w-8 text-sidebar-foreground hover:bg-sidebar-accent"
            >
              {direction === 'rtl' ? (
                isOpen ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />
              ) : (
                isOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 space-y-1 overflow-y-auto p-3">
            {/* Main Items */}
            <div className="space-y-1">
              {mainItems.map(item => renderMenuItem(item))}
            </div>

            {/* Services Section */}
            <Collapsible
              open={isOpen && openGroups.includes('services')}
              onOpenChange={() => isOpen && toggleGroup('services')}
              className="mt-4"
            >
              <CollapsibleTrigger asChild>
                <button
                  className={cn(
                    'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-all',
                    'text-brand-primary hover:bg-sidebar-item-hover-bg',
                    !isOpen && 'justify-center px-2'
                  )}
                >
                  <Briefcase className="h-5 w-5 flex-shrink-0" />
                  <AnimatePresence mode="wait">
                    {isOpen && (
                      <>
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex-1 truncate text-start"
                        >
                          {t('services')}
                        </motion.span>
                        <motion.div
                          initial={{ rotate: 0 }}
                          animate={{ rotate: openGroups.includes('services') ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronDown className="h-4 w-4" />
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="mt-1 space-y-1"
                >
                  {serviceGroups.map(group => renderSubGroup(group))}
                </motion.div>
              </CollapsibleContent>
            </Collapsible>

            {/* System Section */}
            <Collapsible
              open={isOpen && openGroups.includes('system')}
              onOpenChange={() => isOpen && toggleGroup('system')}
              className="mt-4"
            >
              <CollapsibleTrigger asChild>
                <button
                  className={cn(
                    'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-all',
                    'text-brand-primary hover:bg-sidebar-item-hover-bg',
                    !isOpen && 'justify-center px-2'
                  )}
                >
                  <SettingsIcon className="h-5 w-5 flex-shrink-0" />
                  <AnimatePresence mode="wait">
                    {isOpen && (
                      <>
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex-1 truncate text-start"
                        >
                          {t('system')}
                        </motion.span>
                        <motion.div
                          initial={{ rotate: 0 }}
                          animate={{ rotate: openGroups.includes('system') ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronDown className="h-4 w-4" />
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={cn('mt-1 space-y-0.5', direction === 'rtl' ? 'pr-2' : 'pl-2')}
                >
                  {systemItems.map(item => renderMenuItem(item, true))}
                </motion.div>
              </CollapsibleContent>
            </Collapsible>
          </nav>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
