import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { StandingsList } from '@/lib/types';

export function ConstructorStandingsWidget({ standings }: { standings: StandingsList | null }) {
  const topConstructors = standings?.ConstructorStandings?.slice(0, 10);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="font-headline">Constructor Standings</CardTitle>
        <CardDescription>Top 10 teams in the championship.</CardDescription>
      </CardHeader>
      <CardContent>
        {topConstructors && topConstructors.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">Pos</TableHead>
              <TableHead>Team</TableHead>
              <TableHead className="text-right">Points</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {topConstructors.map((standing) => (
              <TableRow key={standing.Constructor.constructorId}>
                <TableCell className="font-medium">{standing.position}</TableCell>
                <TableCell>{standing.Constructor.name}</TableCell>
                <TableCell className="text-right font-bold">{standing.points}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        ) : (
            <p className="text-muted-foreground">No constructor standings available.</p>
        )}
      </CardContent>
    </Card>
  );
}
