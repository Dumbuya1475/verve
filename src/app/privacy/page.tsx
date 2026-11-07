import type { Metadata } from 'next';
import Link from 'next/link';
import { Icon } from '@/components/Icon';

export const metadata: Metadata = {
  title: 'Privacy policy',
  description: 'How Verve handles account, assignment, export, feedback, and survey information.',
  alternates: {
    canonical: '/privacy',
  },
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-5 py-10 sm:px-8 sm:py-16">
      <Link
        href="/"
        className="mb-8 inline-flex items-center gap-2 rounded-control text-sm font-medium text-secondary hover:text-foreground focus-ring"
      >
        <Icon name="arrow_back" className="text-[18px]" />
        Back to Verve
      </Link>
      <p className="text-sm font-semibold uppercase tracking-wide text-primary">Privacy</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
        Verve privacy policy
      </h1>
      <p className="mt-3 text-sm text-secondary">Last updated: October 11, 2026</p>

      <div className="mt-8 space-y-8 text-base leading-relaxed text-secondary">
        <section>
          <h2 className="text-xl font-semibold text-foreground">Information Verve handles</h2>
          <p className="mt-2">
            When you create an account, Firebase Authentication processes your email address,
            display name, and sign-in details. Verve stores assignment drafts associated with your
            account so they can sync between devices. Cover-page drafts are stored in your browser.
          </p>
          <p className="mt-2">
            You can make one free export without signing in. To limit repeat guest exports, Verve
            stores a random, signed identifier in a necessary browser cookie and records the
            export type, file format, and time. Clearing or changing browser cookies may reset this
            guest limit. When you export while signed in, Verve records your account identifier,
            export type, file format, and time to count usage. After your fourth recorded account
            export, Verve may ask for an optional rating and comment. If you send feedback, your
            message and any name, email, or account identifier supplied with it are stored for the
            Verve team.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">How information is used</h2>
          <p className="mt-2">
            Information is used to provide sign-in, save and sync assignment drafts, create export
            usage totals, receive survey responses and feedback, and maintain and improve Verve.
            Sharing from the export prompt shares a link to Verve; it does not send your assignment
            or cover to your contacts.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">Analytics</h2>
          <p className="mt-2">
            When Firebase Analytics is configured for Verve, Google Analytics collects page views
            and basic app activity, along with browser and device information. Verve also records
            successful exports with their type, file format, and whether the export was made by a
            guest or signed-in visitor. These analytics events do not include assignment content,
            names, email addresses, or account identifiers.
          </p>
          <p className="mt-2">
            The homepage may display the total number of exports recorded. Account and guest
            breakdowns remain private and are available only to authorized administrators.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">Storage and service providers</h2>
          <p className="mt-2">
            Verve uses Firebase Authentication and Cloud Firestore for account and application
            data, and Vercel to host the website. Access to analytics and survey records is limited
            to the application server and authorized administrators. Do not enter sensitive
            personal information into assignment drafts, feedback, or survey comments.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">Retention and your choices</h2>
          <p className="mt-2">
            Data is retained while needed to operate the service and review product feedback.
            Verve does not currently provide an automated account or data deletion control. To ask
            about access, correction, or deletion of information, contact the Verve team through
            the <Link className="font-medium text-primary hover:underline" href="/feedback">feedback page</Link>.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">Updates and contact</h2>
          <p className="mt-2">
            This policy may be updated as Verve changes. The latest version will be available at
            this page. For privacy questions, use the <Link className="font-medium text-primary hover:underline" href="/feedback">feedback page</Link>.
          </p>
        </section>
      </div>
    </main>
  );
}
