import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  Calendar, 
  Megaphone, 
  UserCog,
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { NavLink } from './NavLink';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from './ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const Sidebar = ({ isOpen, onToggle }: SidebarProps) => {
  const { t, direction } = useLanguage();

  const menuItems = [
    { icon: LayoutDashboard, label: t('dashboard'), path: '/dashboard' },
    { icon: Users, label: t('clients'), path: '/clients' },
    { icon: Briefcase, label: t('cases'), path: '/cases' },
    { icon: Calendar, label: t('sessions'), path: '/sessions' },
    { icon: Megaphone, label: t('announcements'), path: '/announcements' },
    { icon: UserCog, label: t('lawyers'), path: '/lawyers' },
    { icon: Settings, label: t('settings'), path: '/settings' },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onToggle}
            className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          width: isOpen ? '16rem' : '4.5rem',
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
          <div className="flex items-center justify-end border-b border-sidebar-border p-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggle}
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
          <nav className="flex-1 space-y-1 p-3">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
                  'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                  !isOpen && 'justify-center'
                )}
                activeClassName="bg-sidebar-accent text-accent shadow-gold"
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
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
            ))}
          </nav>
        </div>
      </motion.aside>
    </>
  );
};
