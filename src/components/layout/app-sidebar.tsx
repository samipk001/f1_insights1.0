
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart3, Calendar, Users, Building2, LineChart, LayoutDashboard, FlaskConical, Medal, Code, SearchCheck, Sparkles } from 'lucide-react';
import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarContent,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';

const menuItems = [
  { path: '/', label: 'Standings', icon: BarChart3 },
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/calendar', label: 'Race Calendar', icon: Calendar },
  { path: '/teams', label: 'Teams', icon: Building2 },
  { path: '/compare', label: 'Driver Comparison', icon: Users },
  { path: '/charts', label: 'Charts', icon: LineChart },
  { path: '/analyzer', label: 'Race Analyzer', icon: SearchCheck },
  { path: '/predictions', label: 'Predictions', icon: Sparkles },
  { path: '/simulator', label: 'Simulator', icon: FlaskConical },
  { path: '/consistency', label: 'Consistency Index', icon: Medal },
];

const F1Logo = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 50"
      className="h-8 w-16 fill-current text-primary"
      aria-label="F1 Insights Logo"
    >
      <path d="M10 10 H 30 L 50 40 H 30 Z" />
      <path d="M40 10 H 50 L 70 40 H 60 Z" />
      <path d="M55 10 H 90 V 20 H 65 Z" />
      <path d="M55 30 H 90 V 40 H 65 Z" />
    </svg>
  );

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
            <F1Logo/>
            <h1 className="text-xl font-semibold font-headline text-primary">F1 Insights</h1>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.path}>
              <Button asChild variant={pathname === item.path ? 'secondary' : 'ghost'} className="w-full justify-start">
                  <Link href={item.path}>
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.label}
                  </Link>
              </Button>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
         <div className="flex items-center justify-center p-4 text-xs text-muted-foreground">
            <Code className="mr-2 h-4 w-4" />
            <span>Created by Samip</span>
         </div>
      </SidebarFooter>
    </>
  );
}
