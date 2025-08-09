
"use client";

import { useState, useTransition } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Bot, Loader2, User } from 'lucide-react';
import { getDriverResults } from '@/lib/ergast';
import type { Driver } from '@/lib/types';
import { getDriverSeasonSummary } from '@/app/dashboard/actions';
import { ScrollArea } from '@/components/ui/scroll-area';

export function DriverFocusWidget({ drivers }: { drivers: Driver[] }) {
  const [selectedDriverId, setSelectedDriverId] = useState<string | null>(null);
  const [isAnalyzing, startTransition] = useTransition();
  const [summary, setSummary] = useState<string | null>(null);
  const { toast } = useToast();

  const handleAnalyze = () => {
    if (!selectedDriverId) {
      toast({
        variant: "destructive",
        title: "Selection missing",
        description: "Please select a driver to analyze.",
      });
      return;
    }

    const driverDetails = drivers.find(d => d.driverId === selectedDriverId);
    if (!driverDetails) return;

    startTransition(async () => {
      setSummary(null);
      try {
        const currentYear = new Date().getFullYear().toString();
        const resultsData = await getDriverResults(currentYear, selectedDriverId);
        
        if (!resultsData || resultsData.Races.length === 0) {
          toast({
            variant: "destructive",
            title: "No Data",
            description: "No race results found for this driver in the current season.",
          });
          return;
        }

        const result = await getDriverSeasonSummary({
          season: currentYear,
          driverName: `${driverDetails.givenName} ${driverDetails.familyName}`,
          raceResults: JSON.stringify(resultsData.Races.map(r => ({ round: r.round, raceName: r.raceName, result: r.Results?.[0] }))),
        });
        setSummary(result);
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
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="font-headline">Driver Focus</CardTitle>
        <CardDescription>Get an AI summary of a driver's season.</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        <Select onValueChange={setSelectedDriverId} value={selectedDriverId ?? undefined}>
            <SelectTrigger>
            <SelectValue placeholder="Select Driver" />
            </SelectTrigger>
            <SelectContent>
            {drivers.map(d => <SelectItem key={d.driverId} value={d.driverId}>{d.givenName} {d.familyName}</SelectItem>)}
            </SelectContent>
        </Select>
        <Button onClick={handleAnalyze} disabled={isAnalyzing || !selectedDriverId} size="sm" className="w-full">
            {isAnalyzing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Bot className="mr-2 h-4 w-4" />}
            {isAnalyzing ? 'Analyzing...' : 'Analyze Driver'}
        </Button>
        {(isAnalyzing || summary) && (
            <ScrollArea className="h-48">
                {isAnalyzing && (
                <div className="space-y-2 pr-4">
                    <div className="h-4 bg-muted rounded w-3/4 animate-pulse"></div>
                    <div className="h-4 bg-muted rounded w-full animate-pulse"></div>
                    <div className="h-4 bg-muted rounded w-5/6 animate-pulse"></div>
                </div>
                )}
                {summary && <p className="text-sm text-muted-foreground whitespace-pre-line pr-4">{summary}</p>}
            </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
