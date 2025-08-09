
import { AppLayout } from '@/components/layout/app-layout';
import { DriverPointsChart } from '@/components/charts/driver-points-chart';
import { ConstructorContributionChart } from '@/components/charts/constructor-contribution-chart';
import { getDriverStandings, getConstructorStandings } from '@/lib/ergast';

export default async function ChartsPage({
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

  const standingsWithConstructors = {
      ...driverStandings,
      ConstructorStandings: constructorStandings?.ConstructorStandings || []
  };

  return (
    <AppLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h1 className="text-3xl font-bold tracking-tight font-headline">
            Championship Analysis {year}
          </h1>
        </div>
        <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
            <DriverPointsChart standings={driverStandings} years={years} currentYear={year} />
            <ConstructorContributionChart standings={standingsWithConstructors} />
        </div>
      </div>
    </AppLayout>
  );
}

    