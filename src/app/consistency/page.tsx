import { AppLayout } from '@/components/layout/app-layout';
import { ConsistencyAnalyzer } from '@/components/consistency/consistency-analyzer';
import { getDrivers } from '@/lib/ergast';

export default async function ConsistencyPage() {
  const driversData = await getDrivers('current');
  const drivers = driversData?.Drivers || [];

  return (
    <AppLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h1 className="text-3xl font-bold tracking-tight font-headline">
            Driver Consistency Index
          </h1>
        </div>
        <ConsistencyAnalyzer drivers={drivers} />
      </div>
    </AppLayout>
  );
}
