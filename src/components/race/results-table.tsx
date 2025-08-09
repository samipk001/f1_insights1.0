import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Flame } from 'lucide-react';
import type { Race } from '@/lib/types';

export function ResultsTable({ race }: { race: Race | null }) {
  if (!race || !race.Results) {
    return <p>No race results available.</p>;
  }

  // Find the overall fastest lap in the race results
  const overallFastestLap = race.Results.reduce((fastest, result) => {
    if (!result.FastestLap) return fastest;
    if (!fastest || result.FastestLap.Time.time < fastest.time) {
      return { time: result.FastestLap.Time.time, driverId: result.Driver.driverId };
    }
    return fastest;
  }, null as { time: string; driverId: string } | null);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">{race.raceName} Results</CardTitle>
        <CardDescription>
          {race.Circuit.circuitName} - {new Date(race.date).toLocaleDateString()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Pos</TableHead>
              <TableHead>Driver</TableHead>
              <TableHead>Constructor</TableHead>
              <TableHead className="text-right">Laps</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Points</TableHead>
              <TableHead className="text-right">Fastest Lap</TableHead>
              <TableHead className="w-[80px] text-right">Lap</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {race.Results.map((result) => (
              <TableRow key={result.Driver.driverId} className={result.FastestLap?.Time.time === overallFastestLap?.time ? 'bg-primary/10' : ''}>
                <TableCell className="font-medium">{result.position}</TableCell>
                <TableCell>{`${result.Driver.givenName} ${result.Driver.familyName}`}</TableCell>
                <TableCell>{result.Constructor.name}</TableCell>
                <TableCell className="text-right">{result.laps}</TableCell>
                <TableCell>{result.status}</TableCell>
                <TableCell className="text-right font-bold">{result.points}</TableCell>
                <TableCell className="text-right font-mono">
                  <div className="flex items-center justify-end gap-2">
                    {result.FastestLap?.Time.time === overallFastestLap?.time && <Flame className="h-4 w-4 text-primary" />}
                    {result.FastestLap?.Time.time || 'N/A'}
                  </div>
                </TableCell>
                <TableCell className="text-right font-mono">{result.FastestLap?.lap || 'N/A'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
