
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

export function DriverStandingsWidget({ standings }: { standings: StandingsList | null }) {
  const topDrivers = standings?.DriverStandings?.slice(0, 10);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="font-headline">Driver Standings</CardTitle>
        <CardDescription>Top 10 drivers in the championship.</CardDescription>
      </CardHeader>
      <CardContent>
        {topDrivers && topDrivers.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">Pos</TableHead>
              <TableHead>Driver</TableHead>
              <TableHead className="text-right">Points</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {topDrivers.map((standing) => (
              <TableRow key={standing.Driver.driverId}>
                <TableCell className="font-medium">{standing.position}</TableCell>
                <TableCell>{standing.Driver.code}</TableCell>
                <TableCell className="text-right font-bold">{standing.points}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        ) : (
            <p className="text-muted-foreground">No driver standings available.</p>
        )}
      </CardContent>
    </Card>
  );
}
