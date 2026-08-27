'use client';

import { useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { SupportLinks } from '@/components/SupportLinks';
import { hasBuyMeACoffee } from '@/lib/site';

const inputClass =
  'w-full rounded-control border border-outline-variant/50 bg-surface px-3 py-2 text-foreground focus:bg-surface-strong focus-ring';

export function FeedbackForm() {
  const { user, displayName, email } = useAuth();
  const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('pending');
    setMessage(null);
    const form = event.currentTarget;
    const data = new FormData(form);

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: String(data.get('message') ?? ''),
          name: String(data.get('name') ?? ''),
          email: String(data.get('email') ?? ''),
        }),
      });
      const payload = (await response.json()) as { error?: string };
      if (!response.ok) {
        setStatus('error');
        setMessage(payload.error ?? 'Could not send feedback. Try again.');
        return;
      }
      setStatus('success');
      setMessage('Thank you. Your note is in. We read every message.');
      form.reset();
    } catch {
      setStatus('error');
      setMessage('Could not send feedback. Check your connection and try again.');
    }
  }

  return (
    <div className="mx-auto w-full max-w-xl space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">Support</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">Send feedback</h1>
        <p className="mt-3 text-base leading-relaxed text-secondary">
          Tell us what is working, what is confusing, or what your faculty still needs on a cover
          page. Signed-in students do not need to re-enter a name.
        </p>
      </div>

      {status === 'success' ? (
        <p className="rounded-control bg-secondary-container px-3 py-2 text-sm text-foreground" role="status">
          {message}
        </p>
      ) : null}
      {status === 'error' ? (
        <p className="rounded-control bg-error-container px-3 py-2 text-sm text-error" role="alert">
          {message}
        </p>
      ) : null}

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-container bg-surface-strong p-6 shadow-soft"
      >
        {!user ? (
          <>
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground" htmlFor="feedback-name">
                Name <span className="font-normal text-secondary">(optional)</span>
              </label>
              <input
                id="feedback-name"
                name="name"
                type="text"
                autoComplete="name"
                className={inputClass}
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground" htmlFor="feedback-email">
                Email <span className="font-normal text-secondary">(optional)</span>
              </label>
              <input
                id="feedback-email"
                name="email"
                type="email"
                autoComplete="email"
                className={inputClass}
                placeholder="student@university.edu"
              />
            </div>
          </>
        ) : (
          <p className="text-sm text-secondary">
            Sending as <span className="font-medium text-foreground">{displayName}</span>
            {email ? ` · ${email}` : ''}
          </p>
        )}

        <div>
          <label className="mb-1 block text-sm font-medium text-foreground" htmlFor="feedback-message">
            Message
          </label>
          <textarea
            id="feedback-message"
            name="message"
            required
            rows={6}
            maxLength={4000}
            className={`${inputClass} resize-y`}
            placeholder="What should we add, fix, or explain more clearly?"
          />
        </div>

        <button
          type="submit"
          disabled={status === 'pending'}
          className="rounded-control bg-primary px-4 py-2 text-sm font-bold text-primary-foreground shadow-soft hover:bg-primary-container focus-ring disabled:opacity-60"
        >
          {status === 'pending' ? 'Sending…' : 'Send feedback'}
        </button>
      </form>

      {hasBuyMeACoffee() ? (
        <div className="rounded-container bg-surface-strong p-6 shadow-soft">
          <h2 className="text-lg font-semibold text-foreground">Buy me a coffee</h2>
          <p className="mt-2 text-sm leading-relaxed text-secondary">
            If Verve saved you a late night of formatting, you can support hosting and student-facing
            work here. It is optional — the cover page tools stay free to use.
          </p>
          <SupportLinks className="mt-4" showFeedback={false} />
        </div>
      ) : null}
    </div>
  );
}
