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

export function DriverStandingsTable({ standings }: { standings: StandingsList | null }) {
  if (!standings?.DriverStandings) {
    return <p>No driver standings available for this season.</p>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Driver Standings</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Position</TableHead>
              <TableHead>Driver</TableHead>
              <TableHead>Nationality</TableHead>
              <TableHead>Constructor</TableHead>
              <TableHead className="text-right">Points</TableHead>
              <TableHead className="text-right">Wins</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {standings.DriverStandings.map((standing) => (
              <TableRow key={standing.Driver.driverId}>
                <TableCell className="font-medium">{standing.position}</TableCell>
                <TableCell>{`${standing.Driver.givenName} ${standing.Driver.familyName}`}</TableCell>
                <TableCell>{standing.Driver.nationality}</TableCell>
                <TableCell>{standing.Constructors[0]?.name || 'N/A'}</TableCell>
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
