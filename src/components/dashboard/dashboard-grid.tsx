
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, X } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { WIDGET_REGISTRY, WidgetType } from './widget-registry';
import type { StandingsList, RaceTable, Driver } from '@/lib/types';
import { LayoutDashboard } from 'lucide-react';

interface DashboardGridProps {
  initialDriverStandings: StandingsList | null;
  initialConstructorStandings: StandingsList | null;
  initialRaceSchedule: RaceTable | null;
  initialDrivers: Driver[];
  years: number[];
}

export function DashboardGrid({ 
  initialDriverStandings,
  initialConstructorStandings,
  initialRaceSchedule,
  initialDrivers,
  years
}: DashboardGridProps) {
  const [widgets, setWidgets] = useState<WidgetType[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const savedWidgets = localStorage.getItem('dashboard-widgets');
    if (savedWidgets) {
      try {
        const parsedWidgets: WidgetType[] = JSON.parse(savedWidgets);
        // Filter out any widgets that are no longer in the registry
        const validWidgets = parsedWidgets.filter(w => WIDGET_REGISTRY[w.id]);
        setWidgets(validWidgets);
      } catch (e) {
        console.error("Failed to parse widgets from localStorage", e);
      }
    } else {
        // Default widgets
        setWidgets([
          { id: 'driver-standings', props: {} },
          { id: 'upcoming-race', props: {} },
          { id: 'constructor-standings', props: {} },
        ]);
    }
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('dashboard-widgets', JSON.stringify(widgets));
    }
  }, [widgets, isMounted]);
  
  const addWidget = (id: keyof typeof WIDGET_REGISTRY) => {
    // Prevent adding duplicate widgets for now
    if (widgets.some(w => w.id === id)) return;
    setWidgets([...widgets, { id, props: {} }]);
  };

  const removeWidget = (index: number) => {
    setWidgets(widgets.filter((_, i) => i !== index));
  };
  
  const getWidgetData = (widgetId: keyof typeof WIDGET_REGISTRY) => {
    switch (widgetId) {
      case 'driver-standings':
        return { standings: initialDriverStandings };
      case 'constructor-standings':
        return { standings: initialConstructorStandings };
      case 'upcoming-race':
        return { schedule: initialRaceSchedule };
      case 'race-analyzer':
        return { years: years };
      case 'driver-focus':
        return { drivers: initialDrivers };
      default:
        return {};
    }
  };


  if (!isMounted) {
    return null; // Or a loading skeleton
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>
              <PlusCircle className="mr-2" />
              Add Widget
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {Object.keys(WIDGET_REGISTRY).map((widgetId) => (
              <DropdownMenuItem
                key={widgetId}
                onSelect={() => addWidget(widgetId as keyof typeof WIDGET_REGISTRY)}
                disabled={widgets.some(w => w.id === widgetId)}
              >
                {WIDGET_REGISTRY[widgetId as keyof typeof WIDGET_REGISTRY].name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {widgets.map((widget, index) => {
          const WidgetComponent = WIDGET_REGISTRY[widget.id]?.component;
          if (!WidgetComponent) return null;
          
          const dataProps = getWidgetData(widget.id);

          return (
            <div key={index} className="relative group">
              <WidgetComponent {...widget.props} {...dataProps} />
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100"
                onClick={() => removeWidget(index)}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Remove widget</span>
              </Button>
            </div>
          );
        })}
      </div>
      {widgets.length === 0 && (
          <div className="text-center py-12 border-2 border-dashed rounded-lg flex flex-col items-center justify-center min-h-[400px]">
              <LayoutDashboard className="h-12 w-12 text-muted-foreground" />
              <h3 className="text-xl font-bold mt-4">Your Dashboard is Empty</h3>
              <p className="text-muted-foreground mt-1">Click the "Add Widget" button to customize your view.</p>
          </div>
      )}
    </div>
  );
}
