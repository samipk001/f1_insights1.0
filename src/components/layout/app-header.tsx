import { SidebarTrigger } from '@/components/ui/sidebar';

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

export function AppHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <F1Logo />
          <span className="ml-2 text-lg font-bold font-headline">F1 Insights</span>
        </div>
        <div className="md:hidden">
            <SidebarTrigger />
        </div>
        <div className="flex flex-1 items-center justify-end">
            {/* Future elements like user profile can go here */}
        </div>
      </div>
    </header>
  );
}
