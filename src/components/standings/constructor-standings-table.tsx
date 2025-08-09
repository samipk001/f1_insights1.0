import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { StandingsList } from '@/lib/types';

export function ConstructorStandingsTable({ standings }: { standings: StandingsList | null }) {
  if (!standings?.ConstructorStandings) {
    return <p>No constructor standings available for this season.</p>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Constructor Standings</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Position</TableHead>
              <TableHead>Constructor</TableHead>
              <TableHead>Nationality</TableHead>
              <TableHead className="text-right">Points</TableHead>
              <TableHead className="text-right">Wins</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {standings.ConstructorStandings.map((standing) => (
              <TableRow key={standing.Constructor.constructorId}>
                <TableCell className="font-medium">{standing.position}</TableCell>
                <TableCell>{standing.Constructor.name}</TableCell>
                <TableCell>{standing.Constructor.nationality}</TableCell>
                <TableCell className="text-right font-bold">{standing.points}</TableCell>
                <TableCell className="text-right">{standing.wins}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
