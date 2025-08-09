import { AppLayout } from '@/components/layout/app-layout';
import { RaceSchedule } from '@/components/calendar/race-schedule';
import { getRaceSchedule } from '@/lib/ergast';

export default async function CalendarPage() {
  const schedule = await getRaceSchedule('current');

  return (
    <AppLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h1 className="text-3xl font-bold tracking-tight font-headline">
            Race Calendar {new Date().getFullYear()}
          </h1>
        </div>
        <RaceSchedule schedule={schedule} />
      </div>
    </AppLayout>
  );
}
