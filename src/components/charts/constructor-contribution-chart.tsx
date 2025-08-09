
"use client";

import { useMemo } from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { StandingsList } from '@/lib/types';
import convert from 'color-convert';

interface ConstructorContributionChartProps {
  standings: StandingsList | null;
}

interface ChartData {
  constructorName: string;
  [driverCode: string]: string | number;
}

// Official F1 Team Colors
const teamColors: Record<string, string> = {
    ferrari: '#DC0000',
    mercedes: '#00D2BE',
    red_bull: '#060024',
    mclaren: '#FF8700',
    aston_martin: '#006F62',
    alpine: '#0090FF',
    rb: '#0032FF',
    sauber: '#00E701',
    williams: '#005AFF',
    haas: '#B6B6B6'
};

const getTeamColors = (constructorId: string) => {
    const primaryColor = teamColors[constructorId] || '#FFFFFF'; // Default to white if not found
    try {
        const hslColor = convert.hex.hsl(primaryColor.replace('#', ''));
        hslColor[2] = Math.max(0, hslColor[2] - 20); // Reduce lightness for a darker shade
        const secondaryColor = '#' + convert.hsl.hex(hslColor);
        return [primaryColor, secondaryColor];
    } catch (e) {
        // Fallback for invalid colors
        return [primaryColor, '#A0A0A0'];
    }
};

const shortenTeamName = (name: string) => {
    return name.replace(' F1 Team', '');
}

export function ConstructorContributionChart({ standings }: ConstructorContributionChartProps) {
    const { data, driversByConstructor } = useMemo(() => {
    if (!standings?.DriverStandings || !standings.ConstructorStandings) return { data: [], driversByConstructor: {} };

    const constructorData: { [key: string]: ChartData } = {};
    const driversByConstructor: { [key: string]: string[] } = {};

    // Initialize with all constructors to ensure teams with 0 points are included
    standings.ConstructorStandings.forEach(cs => {
        const constructorId = cs.Constructor.constructorId;
        constructorData[constructorId] = { constructorName: shortenTeamName(cs.Constructor.name) };
        driversByConstructor[constructorId] = [];
    });
    
    // Create a map of all drivers and their teams
    const allDrivers = standings.DriverStandings;

    // Populate points, even for drivers with 0 points if we had them all.
    // Since Ergast doesn't return 0-point drivers in standings, we can only work with what we have.
    // But we can ensure all teams are present.
    allDrivers.forEach(s => {
      const constructorId = s.Constructors[0]?.constructorId;
      if (!constructorId || !constructorData[constructorId]) return;
      
      const driverCode = s.Driver.code;
      constructorData[constructorId][driverCode] = parseInt(s.points, 10);
      if (!driversByConstructor[constructorId].includes(driverCode)) {
        driversByConstructor[constructorId].push(driverCode);
      }
    });

    // Ensure every team has two driver entries, even if one is a dummy with 0 points
     Object.keys(driversByConstructor).forEach(constructorId => {
        if(driversByConstructor[constructorId].length === 1){
            const dummyDriver = `Driver 2`;
            constructorData[constructorId][dummyDriver] = 0;
            driversByConstructor[constructorId].push(dummyDriver);
        }
    });


    return { 
      data: Object.values(constructorData),
      driversByConstructor: driversByConstructor
    };
  }, [standings]);

  const sortedData = useMemo(() => {
    return data.sort((a, b) => {
        const totalA = Object.values(a).reduce((sum, val) => typeof val === 'number' ? sum + val : sum, 0);
        const totalB = Object.values(b).reduce((sum, val) => typeof val === 'number' ? sum + val : sum, 0);
        return totalB - totalA;
    });
  }, [data]);
  
  const constructorIdMap = useMemo(() => {
    if (!standings?.ConstructorStandings) return {};
    return standings.ConstructorStandings.reduce((acc, s) => {
        const constructorId = s.Constructor.constructorId;
        if(constructorId) {
            acc[shortenTeamName(s.Constructor.name)] = constructorId;
        }
        return acc;
    }, {} as Record<string, string>);
  }, [standings]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Constructor Contribution</CardTitle>
        <CardDescription>Points contributed by each driver to their team's total.</CardDescription>
      </CardHeader>
      <CardContent>
        {data.length > 0 ? (
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sortedData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                <XAxis type="number" hide />
                <YAxis dataKey="constructorName" type="category" width={100} stroke="hsl(var(--muted-foreground))" axisLine={false} tickLine={false} />
                <Tooltip
                  cursor={{ fill: 'hsl(var(--accent))', fillOpacity: 0.1 }}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    borderColor: 'hsl(var(--border))',
                    borderRadius: 'var(--radius)',
                  }}
                />
                <Legend />
                {Object.entries(driversByConstructor).flatMap(([constructorId, drivers]) => {
                    const [color1, color2] = getTeamColors(constructorId);
                    const hasTwoDrivers = drivers.length === 2;
                    return drivers.map((driverCode, index) => (
                        <Bar 
                            key={`${constructorId}-${driverCode}`} 
                            dataKey={driverCode} 
                            stackId={constructorId} 
                            fill={index === 0 ? color1 : color2} 
                            radius={!hasTwoDrivers || index === 1 ? [4,4,4,4] : [0,0,0,0]}
                        />
                    ));
                })}
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
