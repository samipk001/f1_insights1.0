import { AppLayout } from '@/components/layout/app-layout';
import { ResultsTable } from '@/components/race/results-table';
import { getRaceResults } from '@/lib/ergast';

export default async function RaceResultsPage({
  params,
}: {
  params: { year: string; round: string };
}) {
  const race = await getRaceResults(params.year, params.round);

  return (
    <AppLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h1 className="text-3xl font-bold tracking-tight font-headline">
            {race ? race.raceName : 'Race Results'}
          </h1>
        </div>
        <ResultsTable race={race} />
      </div>
    </AppLayout>
  );
}
