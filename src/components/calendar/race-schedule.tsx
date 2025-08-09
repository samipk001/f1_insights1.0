"use client";

import { RaceCard } from './race-card';
import type { RaceTable } from '@/lib/types';

export function RaceSchedule({ schedule }: { schedule: RaceTable | null }) {
  if (!schedule?.Races) {
    return <p>No race schedule available for this season.</p>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {schedule.Races.map((race) => (
        <RaceCard key={race.round} race={race} />
      ))}
    </div>
  );
}
