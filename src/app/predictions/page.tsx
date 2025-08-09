import { AppLayout } from '@/components/layout/app-layout';
import { PredictionWidget } from '@/components/predictions/prediction-widget';
import { getRaceSchedule } from '@/lib/ergast';

export default async function PredictionsPage() {
  const scheduleData = await getRaceSchedule('current');
  const allRaces = scheduleData?.Races || [];
  
  // Filter for races that haven't happened yet
  const upcomingRaces = allRaces.filter(race => {
    const raceDate = new Date(`${race.date}T${race.time}`);
    return raceDate > new Date();
  });

  return (
    <AppLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h1 className="text-3xl font-bold tracking-tight font-headline">
            Race Predictions
          </h1>
        </div>
        <PredictionWidget races={upcomingRaces} />
      </div>
    </AppLayout>
  );
}
