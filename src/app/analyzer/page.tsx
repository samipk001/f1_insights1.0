import { AppLayout } from '@/components/layout/app-layout';
import { RaceAnalyzer } from '@/components/analyzer/race-analyzer';

export default function AnalyzerPage() {
  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: currentYear - 1950 + 1 },
    (_, i) => currentYear - i
  );

  return (
    <AppLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h1 className="text-3xl font-bold tracking-tight font-headline">
            AI-Powered Race Analyzer
          </h1>
        </div>
        <RaceAnalyzer years={years} />
      </div>
    </AppLayout>
  );
}
