import { useMemo } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

type CasesByStatusDatum = {
  name: string;
  value: number;
};

type CasesByStatusChartProps = {
  data?: CasesByStatusDatum[];
  title?: string;
};

const DEFAULT_CASE_STATUS_DATA: CasesByStatusDatum[] = [
  { name: 'Open', value: 45 },
  { name: 'In Progress', value: 30 },
  { name: 'Closed', value: 18 },
  { name: 'On Hold', value: 12 },
];

const COLORS = ['#f4b400', '#4285f4', '#db4437', '#0f9d58'];

const CasesByStatusChart = ({
  data = DEFAULT_CASE_STATUS_DATA,
  title = 'Cases by Status',
}: CasesByStatusChartProps) => {
  return (
    <Card className="h-full min-h-[320px]">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="h-[260px] sm:h-[300px]">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              outerRadius="70%"
              innerRadius="45%"
              paddingAngle={4}
            >
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default CasesByStatusChart;
