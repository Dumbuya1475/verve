import type { Metadata } from 'next';
import { PublicHeader } from '@/components/PublicHeader';
import { FeedbackForm } from '@/components/FeedbackForm';
import { BottomNav } from '@/components/BottomNav';

export const metadata: Metadata = {
  title: 'Feedback',
  description: 'Send product feedback for Verve, the academic cover-page workspace.',
};

export default function FeedbackPage() {
  return (
    <div className="flex min-h-full flex-col">
      <PublicHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 pb-28 sm:px-6">
        <FeedbackForm />
      </main>
      <BottomNav />
    </div>
  );
}
