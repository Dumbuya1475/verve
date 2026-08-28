import { TopNav } from '@/components/TopNav';
import { BottomNav } from '@/components/BottomNav';
import { AuthGate } from '@/components/AuthGate';

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-full flex-col">
      <div className="print:hidden">
        <TopNav />
      </div>
      <main className="mx-auto w-full max-w-6xl min-w-0 flex-1 px-4 py-4 pb-28 sm:px-6 md:py-10 print:m-0 print:w-full print:max-w-none print:p-0">
        <AuthGate>{children}</AuthGate>
      </main>
      <BottomNav />
    </div>
  );
}
