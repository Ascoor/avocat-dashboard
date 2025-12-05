import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import PageHeader from '@/components/common/PageHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PagesManager from './components/PagesManager';
import TeamManager from './components/TeamManager';
import AchievementsManager from './components/AchievementsManager';
import SettingsManager from './components/SettingsManager';
import ArticlesManager from './components/ArticlesManager';
import TestimonialsManager from './components/TestimonialsManager';

const TABS = ['pages', 'team', 'achievements', 'settings'] as const;
type TabValue = (typeof TABS)[number];

const resolveTab = (value: string | undefined): TabValue => {
  return (TABS as readonly string[]).includes(value ?? '')
    ? (value as TabValue)
    : 'pages';
};

const AdminWebsitePage: React.FC = () => {
  const { section } = useParams<{ section?: string }>();
  const navigate = useNavigate();

  const activeTab = useMemo(() => resolveTab(section), [section]);

  return (
    <div className="space-y-8">
      <PageHeader
        iconKey="database"
        title="Website Management"
        subtitle="Update hero copy, marketing modules, team profiles, and landing page settings without touching the codebase."
      />

      <Tabs
        value={activeTab}
        onValueChange={(value) => {
          navigate(`/dashboard/website/${value}`, { replace: true });
        }}
        className="space-y-6"
      >
        <TabsList className="grid w-full gap-2 sm:w-auto sm:grid-cols-4">
          <TabsTrigger value="pages">Pages</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="pages" className="space-y-6">
          <PagesManager />
          <ArticlesManager />
          <TestimonialsManager />
        </TabsContent>

        <TabsContent value="team" className="space-y-6">
          <TeamManager />
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6">
          <AchievementsManager />
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <SettingsManager />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminWebsitePage;
