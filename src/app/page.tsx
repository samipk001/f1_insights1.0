import { AppLayout } from '@/components/layout/app-layout';
import { StandingsView } from '@/components/standings/standings-view';
import { getConstructorStandings, getDriverStandings } from '@/lib/ergast';

export default async function StandingsPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const currentYear = new Date().getFullYear();
  const year = typeof searchParams?.year === 'string' ? searchParams.year : String(currentYear);

  const driverStandingsData = getDriverStandings(year);
  const constructorStandingsData = getConstructorStandings(year);

  const [driverStandings, constructorStandings] = await Promise.all([
    driverStandingsData,
    constructorStandingsData,
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
            F1 Standings {year}
          </h1>
        </div>
        <StandingsView
          initialDriverStandings={driverStandings}
          initialConstructorStandings={constructorStandings}
          years={years}
          currentYear={year}
        />
      </div>
    </AppLayout>
  );
}
