
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

export function RaceAnalyzer({ years }: { years: number[] }) {
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
        description: "Please select a year and a race to analyze.",
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
            description: "Could not fetch data for the selected race.",
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
            description: "An unexpected error occurred while generating the analysis.",
        });
      }
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Select a Race</CardTitle>
          <CardDescription>Choose a year and a race from the past to generate an AI-powered analysis.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <Select onValueChange={handleYearChange} value={selectedYear ?? undefined}>
            <SelectTrigger>
              <SelectValue placeholder="Select Year" />
            </SelectTrigger>
            <SelectContent>
              {years.map(y => <SelectItem key={y} value={String(y)}>{y}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select onValueChange={setSelectedRace} value={selectedRace ?? undefined} disabled={isFetchingRaces || races.length === 0}>
            <SelectTrigger>
              <SelectValue placeholder={isFetchingRaces ? "Loading races..." : "Select Race"} />
            </SelectTrigger>
            <SelectContent>
              {races.map(r => <SelectItem key={r.round} value={r.round}>{r.raceName}</SelectItem>)}
            </SelectContent>
          </Select>
        </CardContent>
        <CardFooter>
          <Button onClick={handleAnalyzeRace} disabled={isAnalyzing || !selectedRace}>
            {isAnalyzing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <TestTube className="mr-2 h-4 w-4" />}
            {isAnalyzing ? 'Analyzing...' : 'Analyze Race'}
          </Button>
        </CardFooter>
      </Card>
      
      {(isAnalyzing || analysis) && (
        <Card>
          <CardHeader>
            <CardTitle className="font-headline flex items-center"><Bot className="mr-2"/> AI Race Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            {isAnalyzing && (
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded w-3/4 animate-pulse"></div>
                <div className="h-4 bg-muted rounded w-full animate-pulse"></div>
                <div className="h-4 bg-muted rounded w-5/6 animate-pulse"></div>
                <div className="h-4 bg-muted rounded w-1/2 animate-pulse"></div>
              </div>
            )}
            {analysis && <p className="text-muted-foreground whitespace-pre-line">{analysis}</p>}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
