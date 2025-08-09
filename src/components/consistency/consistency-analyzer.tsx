
"use client";

import { useState, useTransition } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Bot, Loader2, Medal, TrendingUp, TrendingDown, CheckCircle } from 'lucide-react';
import { getDriverResults } from '@/lib/ergast';
import type { Driver } from '@/lib/types';
import { getConsistencyIndex, type CalculateConsistencyIndexOutput } from '@/app/consistency/actions';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, PolarGrid, PolarAngleAxis, RadialBar, RadialBarChart } from 'recharts';

interface ConsistencyAnalyzerProps {
  drivers: Driver[];
}

export function ConsistencyAnalyzer({ drivers }: ConsistencyAnalyzerProps) {
  const [selectedDriverId, setSelectedDriverId] = useState<string | null>(null);
  const [isAnalyzing, startTransition] = useTransition();
  const [result, setResult] = useState<CalculateConsistencyIndexOutput | null>(null);
  const { toast } = useToast();

  const handleAnalyze = () => {
    if (!selectedDriverId) {
      toast({ variant: "destructive", title: "Selection missing", description: "Please select a driver." });
      return;
    }

    const driverDetails = drivers.find(d => d.driverId === selectedDriverId);
    if (!driverDetails) return;

    startTransition(async () => {
      setResult(null);
      try {
        const currentYear = new Date().getFullYear().toString();
        const resultsData = await getDriverResults(currentYear, selectedDriverId);
        
        if (!resultsData || resultsData.Races.length === 0) {
          toast({ variant: "destructive", title: "No Data", description: "No race results found for this driver in the current season." });
          return;
        }

        const aiResult = await getConsistencyIndex({
          season: currentYear,
          driverName: `${driverDetails.givenName} ${driverDetails.familyName}`,
          raceResults: JSON.stringify(resultsData.Races.map(r => ({ 
              round: r.round, 
              raceName: r.raceName, 
              grid: r.Results?.[0]?.grid,
              position: r.Results?.[0]?.position,
              status: r.Results?.[0]?.status 
          }))),
        });

        if (!aiResult) {
            toast({ variant: "destructive", title: "AI Analysis Failed", description: "Could not generate the consistency index." });
            return;
        }
        setResult(aiResult);
      } catch (e) {
        toast({ variant: "destructive", title: "AI Analysis Failed", description: "An unexpected error occurred." });
      }
    });
  };
  
  const selectedDriver = drivers.find(d => d.driverId === selectedDriverId);
  const chartData = result ? [{ name: 'Consistency', value: result.consistencyIndex, fill: 'hsl(var(--primary))' }] : [];
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Analyze Driver Consistency</CardTitle>
          <CardDescription>Select a driver to calculate their Consistency Index for the current season based on qualifying vs race delta, DNFs, and other performance factors.</CardDescription>
        </CardHeader>
        <CardContent>
          <Select onValueChange={setSelectedDriverId} value={selectedDriverId ?? undefined}>
            <SelectTrigger>
              <SelectValue placeholder="Select Driver" />
            </SelectTrigger>
            <SelectContent>
              {drivers.map(d => <SelectItem key={d.driverId} value={d.driverId}>{d.givenName} {d.familyName}</SelectItem>)}
            </SelectContent>
          </Select>
        </CardContent>
        <CardFooter>
          <Button onClick={handleAnalyze} disabled={isAnalyzing || !selectedDriverId}>
            {isAnalyzing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Medal className="mr-2 h-4 w-4" />}
            {isAnalyzing ? 'Analyzing...' : 'Calculate Index'}
          </Button>
        </CardFooter>
      </Card>
      
      {(isAnalyzing || result) && (
        <Card>
          <CardHeader>
            <CardTitle className="font-headline flex items-center">
                <Bot className="mr-2"/> AI Consistency Analysis for {selectedDriver?.givenName} {selectedDriver?.familyName}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isAnalyzing && (
              <div className="space-y-2">
                <div className="h-24 bg-muted rounded-full w-24 mx-auto animate-pulse"></div>
                <div className="h-4 bg-muted rounded w-3/4 mx-auto animate-pulse mt-4"></div>
                <div className="h-4 bg-muted rounded w-full animate-pulse"></div>
                <div className="h-4 bg-muted rounded w-5/6 animate-pulse"></div>
              </div>
            )}
            {result && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
                    <div className="lg:col-span-1 flex flex-col items-center justify-center">
                        <div className="h-[200px] w-full">
                           <ResponsiveContainer width="100%" height="100%">
                                <RadialBarChart 
                                    data={chartData} 
                                    innerRadius="70%" 
                                    outerRadius="100%"
                                    startAngle={90}
                                    endAngle={-270}
                                >
                                    <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                                    <RadialBar 
                                        background 
                                        dataKey="value" 
                                        cornerRadius={10}
                                        className="fill-primary"
                                    />
                                     <text
                                        x="50%"
                                        y="50%"
                                        textAnchor="middle"
                                        dominantBaseline="middle"
                                        className="text-4xl font-bold fill-foreground"
                                    >
                                        {result.consistencyIndex}
                                    </text>
                                    <text
                                        x="50%"
                                        y="65%"
                                        textAnchor="middle"
                                        dominantBaseline="middle"
                                        className="text-sm fill-muted-foreground"
                                    >
                                        / 100
                                    </text>
                                </RadialBarChart>
                           </ResponsiveContainer>
                        </div>
                        <h3 className="text-xl font-bold text-center mt-2">Consistency Index</h3>
                    </div>
                    <div className="lg:col-span-2 space-y-4">
                        <div>
                            <h4 className="font-bold text-foreground mb-2">Analyst Summary</h4>
                            <p className="text-muted-foreground whitespace-pre-line text-sm">{result.analysis}</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <h4 className="font-bold text-foreground mb-2 flex items-center"><TrendingUp className="mr-2 h-5 w-5 text-green-500"/> Positive Factors</h4>
                                <ul className="space-y-2 text-sm">
                                    {result.positiveFactors.map((factor, i) => (
                                        <li key={i} className="flex items-start gap-2">
                                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0"/>
                                            <span className="text-muted-foreground">{factor}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                             <div>
                                <h4 className="font-bold text-foreground mb-2 flex items-center"><TrendingDown className="mr-2 h-5 w-5 text-red-500"/> Negative Factors</h4>
                                <ul className="space-y-2 text-sm">
                                    {result.negativeFactors.map((factor, i) => (
                                        <li key={i} className="flex items-start gap-2">
                                            <TrendingDown className="h-4 w-4 text-red-500 mt-0.5 shrink-0"/>
                                           <span className="text-muted-foreground">{factor}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
