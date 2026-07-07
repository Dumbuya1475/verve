import { TopNav } from '@/components/TopNav';

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
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 print:w-full print:max-w-none print:p-0 print:m-0">
        {children}
      </main>
    </div>
  );
}
