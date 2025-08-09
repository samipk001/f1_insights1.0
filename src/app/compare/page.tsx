import { AppLayout } from '@/components/layout/app-layout';
import { DriverComparison } from '@/components/compare/driver-comparison';
import { getDrivers } from '@/lib/ergast';

export default async function ComparePage() {
  const driversData = await getDrivers('current');
  const drivers = driversData?.Drivers || [];

  return (
    <AppLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h1 className="text-3xl font-bold tracking-tight font-headline">
            Head-to-Head Driver Comparison
          </h1>
        </div>
        <DriverComparison drivers={drivers} />
      </div>
    </AppLayout>
  );
}
