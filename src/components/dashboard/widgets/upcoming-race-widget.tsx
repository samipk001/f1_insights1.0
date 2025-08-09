
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Calendar, Clock } from 'lucide-react';
import type { Race, RaceTable } from '@/lib/types';

export function UpcomingRaceWidget({ schedule }: { schedule: RaceTable | null }) {
  const [upcomingRace, setUpcomingRace] = useState<Race | null>(null);
  const [countdown, setCountdown] = useState('');
  const [raceDateTime, setRaceDateTime] = useState<Date | null>(null);

  useEffect(() => {
    if (schedule?.Races) {
      const nextRace = schedule.Races.find(race => {
        const raceDate = new Date(`${race.date}T${race.time}`);
        return raceDate > new Date();
      });
      setUpcomingRace(nextRace || null);

      if (nextRace) {
        const dateTime = new Date(`${nextRace.date}T${nextRace.time}`);
        setRaceDateTime(dateTime);
      }
    }
  }, [schedule]);

  useEffect(() => {
    if (!raceDateTime) return;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = raceDateTime.getTime() - now;

      if (distance < 0) {
        setCountdown('Race in progress or finished');
        clearInterval(interval);
      } else {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        setCountdown(`${days}d ${hours}h ${minutes}m ${seconds}s`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [raceDateTime]);


  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="font-headline">Upcoming Race</CardTitle>
        <CardDescription>What's next on the F1 calendar.</CardDescription>
      </CardHeader>
      <CardContent>
        {upcomingRace && raceDateTime ? (
          <div className="space-y-4">
             <div className="p-4 rounded-lg bg-muted/50 text-center">
                <p className="text-2xl font-bold font-headline tracking-tighter text-primary">{upcomingRace.raceName}</p>
                <p className="text-sm text-muted-foreground">{upcomingRace.Circuit.circuitName}</p>
            </div>
            <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4 text-accent" />
                    <span>{raceDateTime.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</span>
                </div>
                <div className="flex items-center">
                    <Clock className="mr-2 h-4 w-4 text-accent" />
                    <span>{raceDateTime.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
            </div>
            <div className="w-full text-center text-primary font-bold bg-primary/10 p-2 rounded-md">
                {countdown}
            </div>
          </div>
        ) : (
            <p className="text-muted-foreground">No upcoming races found for this season.</p>
        )}
      </CardContent>
    </Card>
  );
}
