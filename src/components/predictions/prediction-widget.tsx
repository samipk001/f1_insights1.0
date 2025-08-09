
"use client";

import { useState, useTransition } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { BrainCircuit, Loader2, Trophy, Award, Medal, Star, Sparkles } from 'lucide-react';
import { getDriverStandings, getQualifyingResults, getRaceResults } from '@/lib/ergast';
import type { Race } from '@/lib/types';
import { getRacePrediction, type PredictRaceWinnerOutput } from '@/app/predictions/actions';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

interface PredictionWidgetProps {
  races: Race[];
}

export function PredictionWidget({ races }: PredictionWidgetProps) {
  const [selectedRace, setSelectedRace] = useState<string | null>(null);
  const [isPredicting, startTransition] = useTransition();
  const [prediction, setPrediction] = useState<PredictRaceWinnerOutput | null>(null);
  const { toast } = useToast();

  const handlePredictWinner = () => {
    if (!selectedRace) {
      toast({
        variant: "destructive",
        title: "Selection missing",
        description: "Please select a race to predict.",
      });
      return;
    }

    const raceDetails = races.find(r => r.round === selectedRace);
    if (!raceDetails) {
        toast({
            variant: "destructive",
            title: "Error",
            description: "Could not find details for the selected race.",
        });
        return;
    }

    startTransition(async () => {
      setPrediction(null);
      try {
        const season = raceDetails.season;
        const round = raceDetails.round;

        const qualifyingResultsData = getQualifyingResults(season, round);
        const driverStandingsData = getDriverStandings(season);
        
        const lastRacesPromises = Array.from({ length: 3 }, (_, i) => {
            const pastRaceRound = parseInt(round, 10) - 1 - i;
            return pastRaceRound > 0 ? getRaceResults(season, String(pastRaceRound)) : Promise.resolve(null);
        });

        const [qualifyingResults, driverStandings, ...recentRaces] = await Promise.all([
            qualifyingResultsData,
            driverStandingsData,
            ...lastRacesPromises
        ]);

        if (!driverStandings) {
          toast({
            variant: "destructive",
            title: "Missing Data",
            description: "Could not fetch driver standings data. The season may not have started yet.",
          });
          return;
        }

        const recentForm = recentRaces.filter(r => r).map(r => ({ raceName: r!.raceName, results: r!.Results }));

        const result = await getRacePrediction({
          season: season,
          raceName: raceDetails.raceName,
          circuitName: raceDetails.Circuit.circuitName,
          qualifyingResults: qualifyingResults ? JSON.stringify(qualifyingResults.Results) : undefined,
          driverStandings: JSON.stringify(driverStandings.DriverStandings),
          recentDriverForm: JSON.stringify(recentForm),
        });

        if (!result) {
            toast({
                variant: "destructive",
                title: "Prediction Failed",
                description: "The AI model could not generate a prediction. Please try again later.",
            });
            return;
        }
        setPrediction(result);

      } catch (e) {
        console.error(e);
        toast({
            variant: "destructive",
            title: "AI Prediction Failed",
            description: "An unexpected error occurred while generating the prediction.",
        });
      }
    });
  };
  
  const positionIcons = [
    <Trophy className="text-yellow-400" />,
    <Award className="text-gray-400" />,
    <Medal className="text-orange-400" />,
    <Star className="text-primary" />,
    <Sparkles className="text-accent" />
  ];

  const predictedWinner = prediction?.top5[0];
  const otherPredictions = prediction?.top5.slice(1);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Who Will Win?</CardTitle>
          <CardDescription>Select an upcoming race to get an AI-powered prediction. Data is required for predictions, so races further in the future may not be available.</CardDescription>
        </CardHeader>
        <CardContent>
          <Select onValueChange={setSelectedRace} value={selectedRace ?? undefined}>
            <SelectTrigger>
              <SelectValue placeholder="Select Upcoming Race" />
            </SelectTrigger>
            <SelectContent>
              {races.map(r => <SelectItem key={r.round} value={r.round}>{r.raceName}</SelectItem>)}
            </SelectContent>
          </Select>
        </CardContent>
        <CardFooter>
          <Button onClick={handlePredictWinner} disabled={isPredicting || !selectedRace}>
            {isPredicting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <BrainCircuit className="mr-2 h-4 w-4" />}
            {isPredicting ? 'Analyzing...' : 'Predict Top 5'}
          </Button>
        </CardFooter>
      </Card>
      
      {isPredicting && (
        <Card>
          <CardHeader>
            <CardTitle className="font-headline flex items-center"><BrainCircuit className="mr-2"/> AI Prediction</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                 <div className="space-y-2" key={i}>
                    <div className="h-4 bg-muted rounded w-1/4 animate-pulse"></div>
                    <div className="h-4 bg-muted rounded w-3/4 animate-pulse"></div>
                    <div className="h-4 bg-muted rounded w-full animate-pulse"></div>
                 </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {prediction && predictedWinner && (
         <div className="grid gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-1 border-primary">
                <CardHeader>
                    <CardDescription>Predicted Winner</CardDescription>
                    <CardTitle className="font-headline flex items-center gap-2 text-2xl">
                        <Trophy className="h-8 w-8 text-yellow-400"/>
                        {predictedWinner.driverName}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium text-muted-foreground">Confidence</span>
                            <span className="text-sm font-bold text-foreground">{predictedWinner.confidence}%</span>
                        </div>
                        <Progress value={predictedWinner.confidence} className="h-2" />
                    </div>
                     <div>
                        <Badge variant="secondary">{predictedWinner.keyFactor}</Badge>
                    </div>
                    <p className="text-muted-foreground whitespace-pre-line text-sm">{predictedWinner.rationale}</p>
                </CardContent>
            </Card>

            <Card className="lg:col-span-2">
                <CardHeader>
                    <CardTitle className="font-headline">Podium & Points Predictions (Top 5)</CardTitle>
                    <CardDescription>{prediction.summary}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {otherPredictions?.map((p, i) => (
                        <div key={p.driverName} className="space-y-2 p-4 rounded-lg bg-card border">
                             <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2 text-lg font-bold font-headline">
                                    {positionIcons[i+1]}
                                    <span>{p.predictedPosition}</span>
                                </div>
                                <h3 className="flex-1 font-bold text-foreground">{p.driverName}</h3>
                                <Badge variant="outline">{p.keyFactor}</Badge>
                             </div>
                             <div className="flex items-center gap-4">
                                <span className="text-xs font-medium text-muted-foreground w-[70px]">Confidence</span>
                                <Progress value={p.confidence} className="h-2 flex-1" />
                                <span className="text-xs font-bold text-foreground">{p.confidence}%</span>
                             </div>
                             <p className="text-muted-foreground text-sm pl-12">{p.rationale}</p>
                        </div>
                    ))}
                </CardContent>
            </Card>
         </div>
      )}
    </div>
  );
}
