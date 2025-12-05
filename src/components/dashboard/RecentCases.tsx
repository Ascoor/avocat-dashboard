import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface Props {
  title?: string;
  cases?: { id: number; title: string; client: string; category: string; statusColor: string }[];
}

export default function RecentCases({ title = 'Recent Cases', cases = [] }: Props) {
  const hasCases = cases.length > 0;

  return (
    <Card>
      <CardHeader><CardTitle>{title}</CardTitle></CardHeader>

      <CardContent>
        {hasCases ? (
          <ul className="space-y-4">
            {cases.map((c) => (
              <li key={c.id} className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{c.title}</p>
                  <p className="text-sm text-muted-foreground">{c.client} • {c.category}</p>
                </div>
                <span className={`h-3 w-3 rounded-full ${c.statusColor}`} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">No recent cases available.</p>
        )}
      </CardContent>

      <CardFooter className="justify-end">
        <Button variant="premium" asChild>
          <Link to="/cases">View All</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
