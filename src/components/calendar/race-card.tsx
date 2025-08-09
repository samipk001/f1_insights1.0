
"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, MapPin, Trophy, Loader2 } from 'lucide-react';
import type { Race, Result } from '@/lib/types';
import { getRaceResults } from '@/lib/ergast';

export function RaceCard({ race }: { race: Race }) {
  const [countdown, setCountdown] = useState('');
  const [raceDateTime, setRaceDateTime] = useState<Date | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [podium, setPodium] = useState<Result[] | null>(null);
  const [isLoadingPodium, setIsLoadingPodium] = useState(false);

  useEffect(() => {
    const dateTime = new Date(`${race.date}T${race.time}`);
    setRaceDateTime(dateTime);

    const updateState = async () => {
      const now = new Date().getTime();
      const distance = dateTime.getTime() - now;

      if (distance < 0) {
        if (!isFinished) {
          setIsFinished(true);
          setIsLoadingPodium(true);
          try {
            const results = await getRaceResults(race.season, race.round);
            const topThree = results?.Results?.slice(0, 3) || [];
            setPodium(topThree);
          } catch (error) {
            console.error("Failed to fetch podium results", error);
            setPodium([]); // Set to empty array on error
          } finally {
            setIsLoadingPodium(false);
          }
        }
        setCountdown('Race Finished');
      } else {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        setCountdown(`${days}d ${hours}h ${minutes}m ${seconds}s`);
      }
    };

    updateState(); // Initial check
    const interval = setInterval(updateState, 1000);

    return () => clearInterval(interval);
  }, [race.date, race.time, race.season, race.round, isFinished]);

  const PodiumDisplay = () => {
    if (isLoadingPodium) {
      return (
        <div className="flex items-center justify-center w-full text-center text-primary font-bold bg-primary/10 p-2 rounded-md">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            <span>Loading Podium...</span>
        </div>
      );
    }
    if (!podium || podium.length < 3) {
      return (
         <div className="w-full text-center text-muted-foreground font-bold bg-muted/20 p-2 rounded-md">
            Podium data not available
        </div>
      )
    }
    return (
        <div className="w-full text-sm font-bold bg-primary/10 p-2 rounded-md grid grid-cols-3 divide-x divide-primary/30">
            {podium.map((driverResult, index) => (
                <div key={driverResult.Driver.driverId} className="flex items-center justify-center gap-1">
                    <Trophy className={`h-4 w-4 ${index === 0 ? 'text-yellow-400' : index === 1 ? 'text-gray-400' : 'text-orange-400'}`} />
                    <span className="text-primary">{driverResult.Driver.code}</span>
                </div>
            ))}
        </div>
    );
  }

  return (
    <Link href={`/race/${race.season}/${race.round}`} className="flex">
        <Card className="flex flex-col w-full hover:border-primary transition-colors">
        <CardHeader>
            <div className="aspect-video relative mb-4">
                <Image
                    src={`https://placehold.co/600x400.png`}
                    alt={race.Circuit.circuitName}
                    fill
                    className="rounded-lg object-cover"
                    data-ai-hint="race track aerial"
                />
            </div>
            <CardTitle className="font-headline text-lg">{`Round ${race.round}: ${race.raceName}`}</CardTitle>
        </CardHeader>
        <CardContent className="flex-grow space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center">
            <MapPin className="mr-2 h-4 w-4 text-accent" />
            <span>{race.Circuit.circuitName}, {race.Circuit.Location.locality}</span>
            </div>
            <div className="flex items-center">
            <Calendar className="mr-2 h-4 w-4 text-accent" />
            <span>{raceDateTime?.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            <div className="flex items-center">
            <Clock className="mr-2 h-4 w-4 text-accent" />
            <span>{raceDateTime?.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', timeZoneName: 'short' })}</span>
            </div>
        </CardContent>
        <CardFooter>
            {isFinished ? (
              <PodiumDisplay/>
            ) : (
              <div className="w-full text-center text-primary font-bold bg-primary/10 p-2 rounded-md">
                  {countdown}
              </div>
            )}
        </CardFooter>
        </Card>
    </Link>
  );
}
