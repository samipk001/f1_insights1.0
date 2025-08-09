import { AppLayout } from '@/components/layout/app-layout';
import { TeamCard } from '@/components/teams/team-card';
import { getConstructorStandings, getDriverStandings } from '@/lib/ergast';
import type { ConstructorStanding, Driver } from '@/lib/types';

export interface TeamData extends ConstructorStanding {
  drivers: Driver[];
}

export default async function TeamsPage() {
  const constructorStandingsData = getConstructorStandings('current');
  const driverStandingsData = getDriverStandings('current');

  const [constructorStandings, driverStandings] = await Promise.all([
    constructorStandingsData,
    driverStandingsData,
  ]);
  
  const allDrivers = driverStandings?.DriverStandings || [];

  const teamsData: TeamData[] = constructorStandings?.ConstructorStandings?.map(standing => {
    const teamDrivers = allDrivers
      .filter(ds => ds.Constructors.some(c => c.constructorId === standing.Constructor.constructorId))
      .map(ds => ds.Driver);
    
    return {
      ...standing,
      drivers: teamDrivers,
    }
  }) || [];


  return (
    <AppLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h1 className="text-3xl font-bold tracking-tight font-headline">
            F1 Teams {new Date().getFullYear()}
          </h1>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {teamsData && teamsData.length > 0 ? (
            teamsData.map(team => (
              <TeamCard key={team.Constructor.constructorId} team={team} />
            ))
          ) : (
            <p>No teams available for this season.</p>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
