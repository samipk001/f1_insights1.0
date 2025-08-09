
"use client";

import { useState, useTransition, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Bot, Loader2, FlaskConical, Trash2, PlusCircle, ChevronsRight, Timer, CheckCircle, AlertTriangle, XCircle, Trophy } from 'lucide-react';
import { getRaceSchedule, getRaceResults, getPitStops } from '@/lib/ergast';
import type { Race, Driver, Result, PitStop } from '@/lib/types';
import { getStrategySimulation, type SimulateRaceStrategyOutput } from '@/app/simulator/actions';
import { Badge } from '../ui/badge';

interface Stint {
    compound: 'Soft' | 'Medium' | 'Hard';
    pitLap: number | null;
}

interface StrategyBuilderProps {
    years: number[];
    initialRaces: Race[];
}

export function StrategyBuilder({ years, initialRaces }: StrategyBuilderProps) {
    const [selectedYear, setSelectedYear] = useState<string | null>(String(new Date().getFullYear()));
    const [races, setRaces] = useState<Race[]>(initialRaces);
    const [selectedRace, setSelectedRace] = useState<Race | null>(null);
    const [drivers, setDrivers] = useState<Driver[]>([]);
    const [selectedDriver, setSelectedDriver] = useState<Result | null>(null);
    const [pitStops, setPitStops] = useState<PitStop[]>([]);
    
    const [isFetchingRaces, setIsFetchingRaces] = useState(false);
    const [isFetchingData, setIsFetchingData] = useState(false);
    const [isSimulating, startTransition] = useTransition();

    const [stints, setStints] = useState<Stint[]>([{ compound: 'Medium', pitLap: null }]);
    const [simulationResult, setSimulationResult] = useState<SimulateRaceStrategyOutput | null>(null);
    const { toast } = useToast();

    useEffect(() => {
        setRaces(initialRaces);
        setSelectedYear(String(new Date().getFullYear()));
    }, [initialRaces]);

    const handleYearChange = async (year: string) => {
        setSelectedYear(year);
        setSelectedRace(null);
        setDrivers([]);
        setSelectedDriver(null);
        setSimulationResult(null);
        setStints([{ compound: 'Medium', pitLap: null }]);
        setRaces([]);
        setIsFetchingRaces(true);
        try {
            const schedule = await getRaceSchedule(year);
            const pastRaces = schedule?.Races.filter(r => new Date(r.date) < new Date()) || [];
            setRaces(pastRaces);
        } catch (error) {
            toast({ variant: "destructive", title: "Error", description: "Could not fetch the race schedule." });
        } finally {
            setIsFetchingRaces(false);
        }
    };

    const handleRaceChange = async (round: string) => {
        setSimulationResult(null);
        setSelectedDriver(null);
        setDrivers([]);
        setStints([{ compound: 'Medium', pitLap: null }]);
        const raceDetails = races.find(r => r.round === round);
        if (!raceDetails || !selectedYear) return;

        setSelectedRace(raceDetails);
        setIsFetchingData(true);
        try {
            const results = await getRaceResults(selectedYear, round);
            setDrivers(results?.Results?.map(r => r.Driver) || []);
            setSelectedRace(results);
        } catch (error) {
            toast({ variant: "destructive", title: "Error", description: "Could not fetch race results." });
        } finally {
            setIsFetchingData(false);
        }
    };
    
    const handleDriverChange = async (driverId: string) => {
        const driverResult = selectedRace?.Results?.find(r => r.Driver.driverId === driverId);
        setSelectedDriver(driverResult || null);
        
        if (!driverResult || !selectedRace || !selectedYear) {
            setStints([{ compound: 'Medium', pitLap: null }]);
            return;
        }

        setIsFetchingData(true);
        setSimulationResult(null);
        try {
            const pitStopData = await getPitStops(selectedYear, selectedRace.round, driverId);
            const driverPitStops = pitStopData?.Races[0]?.PitStops || [];
            setPitStops(driverPitStops);

            if(driverPitStops.length > 0) {
                const newStints: Stint[] = driverPitStops.map(ps => ({
                    compound: 'Medium', // Default to medium as we dont know actual tire
                    pitLap: parseInt(ps.lap),
                }));
                // Add the final stint which doesn't have a pit stop
                newStints.push({ compound: 'Medium', pitLap: null });
                setStints(newStints);
            } else {
                 setStints([{ compound: 'Medium', pitLap: null }]);
            }

        } catch (error) {
            toast({ variant: "destructive", title: "Error", description: "Could not fetch pit stop data." });
            setStints([{ compound: 'Medium', pitLap: null }]);
        } finally {
            setIsFetchingData(false);
        }
    }

    const handleStintChange = (index: number, field: keyof Stint, value: any) => {
        const newStints = [...stints];
        // @ts-ignore
        newStints[index][field] = value;
        setStints(newStints);
    };

    const addStint = () => {
        if (stints.length < 5) {
            // Add a pitlap to the previous last stint
            const newStints = [...stints];
            if (newStints.length > 0) {
                const lastStint = newStints[newStints.length - 1];
                if(lastStint.pitLap === null) {
                    lastStint.pitLap = 20 * newStints.length; // guess a lap
                }
            }
            setStints([...newStints, { compound: 'Medium', pitLap: null }]);
        }
    };

    const removeStint = (index: number) => {
        if (stints.length > 1) {
            const newStints = stints.filter((_, i) => i !== index);
            // Ensure the last stint has no pit lap
            if (newStints.length > 0) {
                newStints[newStints.length-1].pitLap = null;
            }
            setStints(newStints);
        }
    };
    
    const handleSimulate = () => {
        if (!selectedYear || !selectedRace || !selectedDriver) {
            toast({ variant: "destructive", title: "Missing Selections", description: "Please select a year, race, and driver." });
            return;
        }
        
        const strategy = stints.map((s, i) => ({
            compound: s.compound,
            startLap: i === 0 ? 1 : (stints[i - 1].pitLap ?? 1),
            pitLap: s.pitLap ?? undefined
        }));

        for(let i = 0; i < strategy.length - 1; i++){
            if(!strategy[i].pitLap){
                toast({ variant: "destructive", title: "Invalid Strategy", description: `Stint ${i+1} must have a pit lap.` });
                return;
            }
            if(i > 0 && strategy[i].startLap >= strategy[i].pitLap!){
                 toast({ variant: "destructive", title: "Invalid Strategy", description: `Stint ${i+1} start lap (${strategy[i].startLap}) must be after the previous pit lap and before its own pit lap (${strategy[i].pitLap}).` });
                return;
            }
        }

        startTransition(async () => {
            setSimulationResult(null);
            try {
                const result = await getStrategySimulation({
                    season: selectedYear,
                    raceName: selectedRace.raceName,
                    circuitName: selectedRace.Circuit.circuitName,
                    driverName: `${selectedDriver.Driver.givenName} ${selectedDriver.Driver.familyName}`,
                    gridPosition: parseInt(selectedDriver.grid),
                    totalLaps: parseInt(selectedRace.Results?.[0].laps || '0'),
                    actualRaceTime: selectedDriver.Time?.time || selectedDriver.status,
                    strategy: strategy,
                    raceResultsData: JSON.stringify(selectedRace.Results)
                });
                setSimulationResult(result);

            } catch (e) {
                toast({ variant: "destructive", title: "Simulation Failed", description: "An unexpected error occurred." });
            }
        });
    }
    
    const RatingIcon = ({ rating }: { rating: SimulateRaceStrategyOutput['strategyRating'] }) => {
        switch (rating) {
            case 'Optimal': return <Trophy className="h-5 w-5 text-yellow-400" />;
            case 'Competitive': return <CheckCircle className="h-5 w-5 text-green-500" />;
            case 'Viable': return <CheckCircle className="h-5 w-5 text-blue-500" />;
            case 'Sub-optimal': return <AlertTriangle className="h-5 w-5 text-orange-500" />;
            case 'Disastrous': return <XCircle className="h-5 w-5 text-red-500" />;
            default: return null;
        }
    };

    const isLoading = isFetchingRaces || isFetchingData;

    return (
        <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>1. Select Race & Driver</CardTitle>
                        <CardDescription>Choose a past race to start the simulation.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Select onValueChange={handleYearChange} value={selectedYear ?? undefined}>
                            <SelectTrigger><SelectValue placeholder="Select Year" /></SelectTrigger>
                            <SelectContent>{years.map(y => <SelectItem key={y} value={String(y)}>{y}</SelectItem>)}</SelectContent>
                        </Select>
                        <Select onValueChange={handleRaceChange} value={selectedRace?.round} disabled={!selectedYear || isFetchingRaces}>
                            <SelectTrigger><SelectValue placeholder={isFetchingRaces ? "Loading..." : "Select Race"} /></SelectTrigger>
                            <SelectContent>{races.map(r => <SelectItem key={r.round} value={r.round}>{r.raceName}</SelectItem>)}</SelectContent>
                        </Select>
                        <Select onValueChange={handleDriverChange} value={selectedDriver?.Driver.driverId} disabled={!selectedRace || isFetchingData}>
                             <SelectTrigger><SelectValue placeholder={isFetchingData ? "Loading..." : "Select Driver"} /></SelectTrigger>
                            <SelectContent>{drivers.map(d => <SelectItem key={d.driverId} value={d.driverId}>{d.givenName} {d.familyName}</SelectItem>)}</SelectContent>
                        </Select>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>2. Build Your Strategy</CardTitle>
                        <CardDescription>
                            {pitStops.length > 0 ? "The driver's actual pit stops have been pre-filled. You can now assign tire compounds and run the simulation, or modify the strategy." : "Define tire compounds and pit stop laps for each stint."}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                       {stints.map((stint, index) => (
                           <div key={index} className="p-4 border rounded-lg space-y-4 relative">
                                <Label className="font-bold">Stint {index + 1}</Label>
                                {stints.length > 1 && (
                                    <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-6 w-6" onClick={() => removeStint(index)}>
                                        <Trash2 className="h-4 w-4 text-destructive"/>
                                    </Button>
                                )}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor={`compound-${index}`}>Tire Compound</Label>
                                        <Select value={stint.compound} onValueChange={(val) => handleStintChange(index, 'compound', val)}>
                                            <SelectTrigger id={`compound-${index}`}><SelectValue/></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Soft">Soft</SelectItem>
                                                <SelectItem value="Medium">Medium</SelectItem>
                                                <SelectItem value="Hard">Hard</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    {index < stints.length - 1 && (
                                        <div>
                                            <Label htmlFor={`pit-lap-${index}`}>Pit on Lap</Label>
                                            <Input 
                                                id={`pit-lap-${index}`}
                                                type="number" 
                                                value={stint.pitLap ?? ''} 
                                                onChange={(e) => handleStintChange(index, 'pitLap', parseInt(e.target.value))}
                                                max={selectedRace?.laps}
                                            />
                                        </div>
                                    )}
                                </div>
                           </div>
                       ))}
                       <Button variant="outline" size="sm" onClick={addStint} disabled={stints.length >= 5 || isLoading} className="w-full">
                           <PlusCircle className="mr-2"/> Add Stint
                       </Button>
                    </CardContent>
                    <CardFooter>
                        <Button onClick={handleSimulate} disabled={isSimulating || !selectedDriver || isLoading} className="w-full">
                            {isSimulating ? <Loader2 className="mr-2 animate-spin"/> : <FlaskConical className="mr-2"/>}
                            {isSimulating ? 'Simulating...' : 'Run Simulation'}
                        </Button>
                    </CardFooter>
                </Card>
            </div>
            <div className="lg:col-span-2">
                 <Card className="sticky top-4">
                    <CardHeader>
                        <CardTitle className="font-headline flex items-center"><Bot className="mr-2"/> Simulation Result</CardTitle>
                        <CardDescription>AI-powered analysis of your proposed strategy vs. the actual race outcome.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isSimulating && (
                             <div className="space-y-4">
                                <div className="h-8 bg-muted rounded w-1/2 animate-pulse"></div>
                                <div className="h-4 bg-muted rounded w-3/4 animate-pulse"></div>
                                <div className="h-4 bg-muted rounded w-full animate-pulse"></div>
                                <div className="h-4 bg-muted rounded w-5/6 animate-pulse"></div>
                            </div>
                        )}
                        {!isSimulating && !simulationResult && (
                            <div className="text-center py-12 border-2 border-dashed rounded-lg flex flex-col items-center justify-center min-h-[300px]">
                                <FlaskConical className="h-12 w-12 text-muted-foreground" />
                                <h3 className="text-xl font-bold mt-4">Awaiting Simulation</h3>
                                <p className="text-muted-foreground mt-1">Configure your strategy and click "Run Simulation".</p>
                            </div>
                        )}
                        {simulationResult && (
                            <div className="space-y-6">
                                <div className="p-4 rounded-lg bg-card border flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <RatingIcon rating={simulationResult.strategyRating} />
                                        <span className="text-lg font-bold">{simulationResult.strategyRating} Strategy</span>
                                    </div>
                                    <Badge variant="secondary">vs Actual</Badge>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                                    <div className="p-3 rounded-md bg-muted/50">
                                        <p className="text-xs text-muted-foreground">Simulated Time</p>
                                        <p className="font-bold text-lg text-foreground flex items-center justify-center gap-2"><Timer className="h-5 w-5"/> {simulationResult.simulatedTime}</p>
                                    </div>
                                    <div className="p-3 rounded-md bg-muted/50">
                                        <p className="text-xs text-muted-foreground">Performance Delta</p>
                                        <p className="font-bold text-lg text-primary flex items-center justify-center gap-2"><ChevronsRight className="h-5 w-5"/> {simulationResult.timeDelta}</p>
                                    </div>
                                    <div className="p-3 rounded-md bg-muted/50">
                                        <p className="text-xs text-muted-foreground">Actual Time</p>
                                        <p className="font-bold text-lg text-muted-foreground flex items-center justify-center gap-2"><Timer className="h-5 w-5"/> {selectedDriver?.Time?.time || selectedDriver?.status}</p>
                                    </div>
                                </div>
                                 <div>
                                    <h4 className="font-bold text-foreground mb-2">AI Analysis</h4>
                                    <p className="text-muted-foreground whitespace-pre-line text-sm">{simulationResult.analysis}</p>
                                </div>
                            </div>
                        )}
                    </CardContent>
                 </Card>
            </div>
        </div>
    );
}
