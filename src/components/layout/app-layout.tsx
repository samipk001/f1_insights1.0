import { Sidebar, SidebarInset } from '@/components/ui/sidebar';
import { AppHeader } from './app-header';
import { AppSidebar } from './app-sidebar';

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Sidebar>
        <AppSidebar />
      </Sidebar>
      <SidebarInset className="flex flex-col min-h-screen">
        <AppHeader />
        <main className="flex-1">{children}</main>
      </SidebarInset>
    </>
  );
}
