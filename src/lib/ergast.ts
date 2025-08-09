// src/lib/jolpica.ts
import type { StandingsList, RaceTable, DriverTable, Race, PitStopTable } from './types';

const BASE_URL = 'https://api.jolpi.ca/ergast/f1';

export async function getDriverStandings(year: string = 'current'): Promise<StandingsList | null> {
  try {
    const endpoint = `${BASE_URL}/${year}/driverStandings.json`;
    const response = await fetch(endpoint);
    if (!response.ok) {
      console.error('Failed to fetch driver standings:', response.statusText);
      return null;
    }
    const data = await response.json();
    // Ergast data is nested: MRData.StandingsTable.StandingsLists is an array, take first
    return data.MRData?.StandingsTable?.StandingsLists?.[0] || null;
  } catch (error) {
    console.error('Error fetching driver standings:', error);
    return null;
  }
}

export async function getConstructorStandings(year: string = 'current'): Promise<StandingsList | null> {
  try {
    const endpoint = `${BASE_URL}/${year}/constructorStandings.json`;
    const response = await fetch(endpoint);
    if (!response.ok) {
      console.error('Failed to fetch constructor standings:', response.statusText);
      return null;
    }
    const data = await response.json();
    return data.MRData?.StandingsTable?.StandingsLists?.[0] || null;
  } catch (error) {
    console.error('Error fetching constructor standings:', error);
    return null;
  }
}

export async function getRaceSchedule(year: string = 'current'): Promise<RaceTable | null> {
  try {
    const endpoint = `${BASE_URL}/${year}.json`;
    const response = await fetch(endpoint);
    if (!response.ok) {
      console.error('Failed to fetch race schedule:', response.statusText);
      return null;
    }
    const data = await response.json();
    return data.MRData?.RaceTable || null;
  } catch (error) {
    console.error('Error fetching race schedule:', error);
    return null;
  }
}

export async function getDrivers(year: string = 'current'): Promise<DriverTable | null> {
  try {
    const endpoint = `${BASE_URL}/${year}/drivers.json`;
    const response = await fetch(endpoint);
    if (!response.ok) {
      console.error('Failed to fetch drivers:', response.statusText);
      return null;
    }
    const data = await response.json();
    return data.MRData?.DriverTable || null;
  } catch (error) {
    console.error('Error fetching drivers:', error);
    return null;
  }
}

export async function getDriverResults(year: string = 'current', driverId: string): Promise<RaceTable | null> {
  try {
    const endpoint = `${BASE_URL}/${year}/drivers/${driverId}/results.json`;
    const response = await fetch(endpoint);
    if (!response.ok) {
      console.error(`Failed to fetch results for driver ${driverId}:`, response.statusText);
      return null;
    }
    const data = await response.json();
    return data.MRData?.RaceTable || null;
  } catch (error) {
    console.error(`Error fetching results for driver ${driverId}:`, error);
    return null;
  }
}

export async function getRaceResults(year: string, round: string): Promise<Race | null> {
  try {
    // We increase the limit to get all drivers, default is 30
    const endpoint = `${BASE_URL}/${year}/${round}/results.json?limit=100`;
    const response = await fetch(endpoint);
    if (!response.ok) {
        console.error('Failed to fetch race results:', response.statusText);
        return null;
    };
    const data = await response.json();
    return data.MRData?.RaceTable?.Races?.[0] || null;
  } catch(error) {
    console.error('Error fetching race results:', error);
    return null;
  }
}

export async function getQualifyingResults(year: string, round: string): Promise<Race | null> {
    try {
      const endpoint = `${BASE_URL}/${year}/${round}/qualifying.json`;
      const response = await fetch(endpoint);
      if (!response.ok) {
          console.error('Failed to fetch qualifying results:', response.statusText);
          return null;
      };
      const data = await response.json();
      // The structure for qualifying is RaceTable.Races[0].QualifyingResults
      // To keep it consistent, we'll remap it to look like a Race object
      const raceData = data.MRData?.RaceTable?.Races?.[0];
      if (raceData && raceData.QualifyingResults) {
        return { ...raceData, Results: raceData.QualifyingResults };
      }
      return null;
    } catch(error) {
      console.error('Error fetching qualifying results:', error);
      return null;
    }
  }

  export async function getPitStops(year: string, round: string, driverId: string): Promise<PitStopTable | null> {
    try {
      const endpoint = `${BASE_URL}/${year}/${round}/drivers/${driverId}/pitstops.json`;
      const response = await fetch(endpoint);
      if (!response.ok) {
        // It's common for this to fail if there are no pit stops, so don't log error
        return null;
      }
      const data = await response.json();
      return data.MRData?.RaceTable || null;
    } catch (error) {
      console.error(`Error fetching pit stops for driver ${driverId}:`, error);
      return null;
    }
  }
