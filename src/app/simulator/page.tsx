import { AppLayout } from '@/components/layout/app-layout';
import { StrategyBuilder } from '@/components/simulator/strategy-builder';
import { getRaceSchedule } from '@/lib/ergast';
import type { Race } from '@/lib/types';

export default async function SimulatorPage() {
  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: currentYear - 1950 + 1 },
    (_, i) => currentYear - i
  );

  const schedule = await getRaceSchedule(String(currentYear));
  const initialRaces = schedule?.Races.filter(r => new Date(r.date) < new Date()) || [];

  return (
    <AppLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h1 className="text-3xl font-bold tracking-tight font-headline">
            Race Strategy Simulator
          </h1>
        </div>
        <StrategyBuilder years={years} initialRaces={initialRaces} />
      </div>
    </AppLayout>
  );
}
