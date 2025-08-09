"use client";

import { useState, useTransition } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { getComparisonSummary } from '@/app/compare/actions';
import { useToast } from '@/hooks/use-toast';
import { Bot, Loader2 } from 'lucide-react';
import type { Driver } from '@/lib/types';

interface DriverComparisonProps {
  drivers: Driver[];
}

interface DriverStats {
  wins: number;
  podiums: number;
  qualiBattles: number;
  dnfs: number;
  teamHistory: string;
}

const MOCK_STATS: Record<string, DriverStats> = {
    verstappen: { wins: 58, podiums: 104, qualiBattles: 120, dnfs: 30, teamHistory: "Toro Rosso, Red Bull" },
    hamilton: { wins: 103, podiums: 197, qualiBattles: 150, dnfs: 28, teamHistory: "McLaren, Mercedes" },
    leclerc: { wins: 7, podiums: 32, qualiBattles: 75, dnfs: 15, teamHistory: "Sauber, Ferrari" },
    norris: { wins: 1, podiums: 17, qualiBattles: 60, dnfs: 8, teamHistory: "McLaren" },
    alonso: { wins: 32, podiums: 106, qualiBattles: 180, dnfs: 60, teamHistory: "Minardi, Renault, McLaren, Ferrari, Alpine, Aston Martin" },
    default: { wins: 0, podiums: 0, qualiBattles: 0, dnfs: 0, teamHistory: "N/A" }
};

export function DriverComparison({ drivers }: DriverComparisonProps) {
  const [driver1Id, setDriver1Id] = useState<string | null>(null);
  const [driver2Id, setDriver2Id] = useState<string | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const driver1 = drivers.find(d => d.driverId === driver1Id);
  const driver2 = drivers.find(d => d.driverId === driver2Id);

  const driver1Stats = driver1Id ? (MOCK_STATS[driver1Id] || MOCK_STATS.default) : null;
  const driver2Stats = driver2Id ? (MOCK_STATS[driver2Id] || MOCK_STATS.default) : null;

  const handleGenerateSummary = () => {
    if (!driver1 || !driver2 || !driver1Stats || !driver2Stats) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select two drivers to compare.",
      });
      return;
    }
    
    startTransition(async () => {
      setSummary(null);
      const result = await getComparisonSummary({
        driver1Name: `${driver1.givenName} ${driver1.familyName}`,
        driver2Name: `${driver2.givenName} ${driver2.familyName}`,
        wins1: driver1Stats.wins,
        wins2: driver2Stats.wins,
        podiums1: driver1Stats.podiums,
        podiums2: driver2Stats.podiums,
        qualiBattles1: driver1Stats.qualiBattles,
        qualiBattles2: driver2Stats.qualiBattles,
        dnfs1: driver1Stats.dnfs,
        dnfs2: driver2Stats.dnfs,
        teamHistory1: driver1Stats.teamHistory,
        teamHistory2: driver2Stats.teamHistory,
        season: new Date().getFullYear().toString(),
      });

      if (result) {
        setSummary(result);
      } else {
        toast({
            variant: "destructive",
            title: "AI Summary Failed",
            description: "Could not generate driver comparison summary. Please try again.",
        });
      }
    });
  };

  const renderStatRow = (label: string, value1: any, value2: any) => (
    <TableRow>
      <TableCell className="text-right">{value1 ?? 'N/A'}</TableCell>
      <TableCell className="text-center font-bold text-muted-foreground w-1/3">{label}</TableCell>
      <TableCell className="text-left">{value2 ?? 'N/A'}</TableCell>
    </TableRow>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Drivers</CardTitle>
        <CardDescription>Choose two drivers from the grid to compare their stats.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6 md:grid-cols-2">
        <Select onValueChange={setDriver1Id} value={driver1Id ?? undefined}>
          <SelectTrigger>
            <SelectValue placeholder="Select Driver 1" />
          </SelectTrigger>
          <SelectContent>
            {drivers.map(d => (
              <SelectItem key={d.driverId} value={d.driverId} disabled={d.driverId === driver2Id}>
                {d.givenName} {d.familyName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select onValueChange={setDriver2Id} value={driver2Id ?? undefined}>
          <SelectTrigger>
            <SelectValue placeholder="Select Driver 2" />
          </SelectTrigger>
          <SelectContent>
            {drivers.map(d => (
              <SelectItem key={d.driverId} value={d.driverId} disabled={d.driverId === driver1Id}>
                {d.givenName} {d.familyName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardContent>

      {driver1 && driver2 && driver1Stats && driver2Stats && (
        <>
            <CardHeader className="items-center">
                 <div className="grid grid-cols-3 items-center w-full gap-4">
                    <div className="flex flex-col items-center gap-2">
                        <Avatar className="h-24 w-24 border-4 border-primary">
                            <AvatarImage data-ai-hint="driver portrait" src={`https://placehold.co/100x100.png`} />
                            <AvatarFallback>{driver1.code}</AvatarFallback>
                        </Avatar>
                        <h3 className="text-xl font-bold font-headline">{driver1.givenName} {driver1.familyName}</h3>
                    </div>
                    <div className="text-center">
                        <span className="text-5xl font-bold text-primary font-headline">VS</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                         <Avatar className="h-24 w-24 border-4 border-accent">
                            <AvatarImage data-ai-hint="driver portrait" src={`https://placehold.co/100x100.png`} />
                            <AvatarFallback>{driver2.code}</AvatarFallback>
                        </Avatar>
                        <h3 className="text-xl font-bold font-headline">{driver2.givenName} {driver2.familyName}</h3>
                    </div>
                 </div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableBody>
                        {renderStatRow('Wins', driver1Stats.wins, driver2Stats.wins)}
                        {renderStatRow('Podiums', driver1Stats.podiums, driver2Stats.podiums)}
                        {renderStatRow('Quali Battles Won', driver1Stats.qualiBattles, driver2Stats.qualiBattles)}
                        {renderStatRow('DNFs', driver1Stats.dnfs, driver2Stats.dnfs)}
                        {renderStatRow('Team History', driver1Stats.teamHistory, driver2Stats.teamHistory)}
                    </TableBody>
                </Table>
            </CardContent>
             <CardFooter className="flex-col gap-4">
                <Button onClick={handleGenerateSummary} disabled={isPending} className="w-full md:w-auto">
                    {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Bot className="mr-2 h-4 w-4" />}
                    {isPending ? 'Generating...' : 'Generate AI Summary'}
                </Button>

                {(isPending || summary) && (
                    <Card className="w-full bg-background">
                        <CardHeader>
                            <CardTitle className="font-headline flex items-center"><Bot className="mr-2"/> AI Analyst Summary</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {isPending && <div className="space-y-2">
                                <div className="h-4 bg-muted rounded w-3/4 animate-pulse"></div>
                                <div className="h-4 bg-muted rounded w-full animate-pulse"></div>
                                <div className="h-4 bg-muted rounded w-1/2 animate-pulse"></div>
                                </div>
                            }
                            {summary && <p className="text-muted-foreground whitespace-pre-line">{summary}</p>}
                        </CardContent>
                    </Card>
                )}
            </CardFooter>
        </>
      )}
    </Card>
  );
}
