"use client";

import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DriverStandingsTable } from './driver-standings-table';
import { ConstructorStandingsTable } from './constructor-standings-table';
import type { StandingsList } from '@/lib/types';

interface StandingsViewProps {
  initialDriverStandings: StandingsList | null;
  initialConstructorStandings: StandingsList | null;
  years: number[];
  currentYear: string;
}

export function StandingsView({
  initialDriverStandings,
  initialConstructorStandings,
  years,
  currentYear,
}: StandingsViewProps) {
  const router = useRouter();

  const handleYearChange = (year: string) => {
    router.push(`/?year=${year}`);
  };

  return (
    <Tabs defaultValue="drivers" className="space-y-4">
      <div className="flex items-center justify-between">
        <TabsList>
          <TabsTrigger value="drivers">Driver Standings</TabsTrigger>
          <TabsTrigger value="constructors">Constructor Standings</TabsTrigger>
        </TabsList>
        <div className="w-[180px]">
          <Select value={currentYear} onValueChange={handleYearChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={String(year)}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <TabsContent value="drivers" className="space-y-4">
        <DriverStandingsTable standings={initialDriverStandings} />
      </TabsContent>
      <TabsContent value="constructors" className="space-y-4">
        <ConstructorStandingsTable standings={initialConstructorStandings} />
      </TabsContent>
    </Tabs>
  );
}
