import { AppLayout } from '@/components/layout/app-layout';
import { DashboardGrid } from '@/components/dashboard/dashboard-grid';
import { getConstructorStandings, getDriverStandings, getRaceSchedule, getDrivers } from '@/lib/ergast';

export default async function DashboardPage() {
  const currentYear = new Date().getFullYear();
  const driverStandingsData = getDriverStandings('current');
  const constructorStandingsData = getConstructorStandings('current');
  const raceScheduleData = getRaceSchedule('current');
  const driversData = getDrivers('current');


  const [driverStandings, constructorStandings, raceSchedule, drivers] = await Promise.all([
    driverStandingsData,
    constructorStandingsData,
    raceScheduleData,
    driversData
  ]);

  const years = Array.from(
    { length: currentYear - 1950 + 1 },
    (_, i) => currentYear - i
  );

  return (
    <AppLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h1 className="text-3xl font-bold tracking-tight font-headline">
            My Dashboard
          </h1>
        </div>
        <DashboardGrid
          initialDriverStandings={driverStandings}
          initialConstructorStandings={constructorStandings}
          initialRaceSchedule={raceSchedule}
          initialDrivers={drivers?.Drivers || []}
          years={years}
        />
      </div>
    </AppLayout>
  );
}
