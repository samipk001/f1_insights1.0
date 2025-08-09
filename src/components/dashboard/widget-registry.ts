import { DriverStandingsWidget } from './widgets/driver-standings-widget';
import { ConstructorStandingsWidget } from './widgets/constructor-standings-widget';
import { UpcomingRaceWidget } from './widgets/upcoming-race-widget';
import { RaceAnalyzerWidget } from './widgets/race-analyzer-widget';
import { DriverFocusWidget } from './widgets/driver-focus-widget';
import type { ComponentType } from 'react';

export interface WidgetType {
    id: keyof typeof WIDGET_REGISTRY;
    props: Record<string, any>;
}

interface WidgetDefinition {
    name: string;
    description: string;
    component: ComponentType<any>;
}

export const WIDGET_REGISTRY: Record<string, WidgetDefinition> = {
    'driver-standings': {
        name: 'Driver Standings',
        description: 'Displays the current F1 driver standings.',
        component: DriverStandingsWidget,
    },
    'constructor-standings': {
        name: 'Constructor Standings',
        description: 'Displays the current F1 constructor standings.',
        component: ConstructorStandingsWidget,
    },
    'upcoming-race': {
        name: 'Upcoming Race',
        description: 'Displays the next race on the calendar.',
        component: UpcomingRaceWidget,
    },
    'race-analyzer': {
        name: 'Race Analyzer',
        description: 'Get an AI-powered summary of a past race.',
        component: RaceAnalyzerWidget
    },
    'driver-focus': {
        name: 'Driver Focus',
        description: 'Get an AI-powered summary of a driver\'s season.',
        component: DriverFocusWidget,
    }
};
