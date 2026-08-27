import type { Metadata } from 'next';
import { FeedbackForm } from '@/components/FeedbackForm';

export const metadata: Metadata = {
  title: 'Feedback',
  description: 'Send product feedback for Verve, the academic cover-page workspace.',
};

export default function FeedbackPage() {
  return <FeedbackForm />;
}
