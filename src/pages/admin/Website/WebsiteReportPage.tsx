import PageHeader from '@/components/common/PageHeader';
import ReportWidget from './components/ReportWidget';

const WebsiteReportPage: React.FC = () => {
  return (
    <div className="space-y-8">
      <PageHeader
        iconKey="chart"
        title="Website content report"
        subtitle="Monitor publishing progress, outstanding drafts, and API connectivity for the marketing site."
      />

      <ReportWidget />
    </div>
  );
};

export default WebsiteReportPage;
