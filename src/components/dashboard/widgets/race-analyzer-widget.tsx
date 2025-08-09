
"use client";

import { useState, useTransition } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Bot, Loader2, TestTube } from 'lucide-react';
import { getRaceSchedule, getRaceResults } from '@/lib/ergast';
import type { Race } from '@/lib/types';
import { getRaceAnalysis } from '@/app/analyzer/actions';
import { ScrollArea } from '@/components/ui/scroll-area';

export function RaceAnalyzerWidget({ years }: { years: number[] }) {
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [races, setRaces] = useState<Race[]>([]);
  const [selectedRace, setSelectedRace] = useState<string | null>(null);
  const [isFetchingRaces, setIsFetchingRaces] = useState(false);
  const [isAnalyzing, startTransition] = useTransition();
  const [analysis, setAnalysis] = useState<string | null>(null);
  const { toast } = useToast();

  const handleYearChange = async (year: string) => {
    setSelectedYear(year);
    setSelectedRace(null);
    setAnalysis(null);
    setRaces([]);
    setIsFetchingRaces(true);
    try {
      const schedule = await getRaceSchedule(year);
      setRaces(schedule?.Races || []);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error fetching races",
        description: "Could not fetch the race schedule for the selected year.",
      });
    } finally {
      setIsFetchingRaces(false);
    }
  };

  const handleAnalyzeRace = () => {
    if (!selectedYear || !selectedRace) {
      toast({
        variant: "destructive",
        title: "Selection missing",
        description: "Please select a year and a race.",
      });
      return;
    }

    startTransition(async () => {
      setAnalysis(null);
      try {
        const raceData = await getRaceResults(selectedYear, selectedRace);
        if (!raceData) {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Could not fetch race data.",
          });
          return;
        }

        const result = await getRaceAnalysis({
          season: selectedYear,
          raceName: raceData.raceName,
          raceData: JSON.stringify(raceData.Results),
        });
        setAnalysis(result);
      } catch (e) {
        toast({
            variant: "destructive",
            title: "AI Analysis Failed",
            description: "An unexpected error occurred.",
        });
      }
    });
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="font-headline">Race Analyzer</CardTitle>
        <CardDescription>Get an AI summary of a past race.</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        <div className="grid grid-cols-2 gap-2">
            <Select onValueChange={handleYearChange} value={selectedYear ?? undefined}>
                <SelectTrigger>
                <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                {years.map(y => <SelectItem key={y} value={String(y)}>{y}</SelectItem>)}
                </SelectContent>
            </Select>
            <Select onValueChange={setSelectedRace} value={selectedRace ?? undefined} disabled={isFetchingRaces || races.length === 0}>
                <SelectTrigger>
                <SelectValue placeholder={isFetchingRaces ? "..." : "Race"} />
                </SelectTrigger>
                <SelectContent>
                {races.map(r => <SelectItem key={r.round} value={r.round}>{r.raceName}</SelectItem>)}
                </SelectContent>
            </Select>
        </div>
         <Button onClick={handleAnalyzeRace} disabled={isAnalyzing || !selectedRace} size="sm" className="w-full">
            {isAnalyzing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <TestTube className="mr-2 h-4 w-4" />}
            {isAnalyzing ? 'Analyzing...' : 'Analyze'}
        </Button>
        {(isAnalyzing || analysis) && (
            <ScrollArea className="h-48">
                {isAnalyzing && (
                <div className="space-y-2 pr-4">
                    <div className="h-4 bg-muted rounded w-3/4 animate-pulse"></div>
                    <div className="h-4 bg-muted rounded w-full animate-pulse"></div>
                    <div className="h-4 bg-muted rounded w-5/6 animate-pulse"></div>
                </div>
                )}
                {analysis && <p className="text-sm text-muted-foreground whitespace-pre-line pr-4">{analysis}</p>}
            </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
