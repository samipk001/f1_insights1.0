
"use client";

import { useRouter } from 'next/navigation';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { StandingsList } from '@/lib/types';

interface DriverPointsChartProps {
  standings: StandingsList | null;
  years: number[];
  currentYear: string;
}

export function DriverPointsChart({ standings, years, currentYear }: DriverPointsChartProps) {
  const router = useRouter();

  const handleYearChange = (year: string) => {
    router.push(`/charts?year=${year}`);
  };

  const chartData = standings?.DriverStandings?.map(s => ({
    name: s.Driver.code,
    points: parseInt(s.points, 10),
    wins: parseInt(s.wins, 10),
    driver: `${s.Driver.givenName} ${s.Driver.familyName}`,
    constructor: s.Constructors[0]?.name || 'N/A'
  }));

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
            <div>
                <CardTitle className="font-headline">Driver Points Progression</CardTitle>
                <CardDescription>Points scored by each driver in the selected season.</CardDescription>
            </div>
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
      </CardHeader>
      <CardContent>
        {chartData ? (
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    borderColor: 'hsl(var(--border))',
                  }}
                  cursor={{ fill: 'hsl(var(--accent))', fillOpacity: 0.1 }}
                />
                <Legend />
                <Bar dataKey="points" fill="hsl(var(--primary))" name="Points" />
                <Bar dataKey="wins" fill="hsl(var(--accent))" name="Wins" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p>No data available to display the chart.</p>
        )}
      </CardContent>
    </Card>
  );
}
