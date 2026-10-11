'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { Icon } from '@/components/Icon';

type ExportShareDialogProps = {
  onClose: () => void;
  showSurvey: boolean;
};

export function ExportShareDialog({ onClose, showSurvey }: ExportShareDialogProps) {
  const [shareMessage, setShareMessage] = useState<string | null>(null);
  const [rating, setRating] = useState<number | null>(null);
  const [comment, setComment] = useState('');
  const [surveyStatus, setSurveyStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');
  const [surveyError, setSurveyError] = useState<string | null>(null);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  async function shareVerve() {
    const url = window.location.origin;
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Verve — assignment cover pages',
          text: 'Create and export assignment cover pages with Verve. Share it with your classmates.',
          url,
        });
        setShareMessage('Thanks for sharing Verve with your classmates.');
        return;
      }
      await navigator.clipboard.writeText(url);
      setShareMessage('Invite link copied. Send it to a friend on campus.');
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return;
      setShareMessage('Sharing is unavailable here. Copy this link from your browser: ' + url);
    }
  }

  async function copyInviteLink() {
    try {
      await navigator.clipboard.writeText(window.location.origin);
      setShareMessage('Invite link copied. Send it to a friend on campus.');
    } catch (error) {
      console.error('Could not copy invite link', error);
      setShareMessage('Copy the link from your browser address bar to invite a friend.');
    }
  }

  async function submitSurvey(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (rating === null) {
      setSurveyStatus('error');
      setSurveyError('Choose a rating before sending your response.');
      return;
    }

    setSurveyStatus('pending');
    setSurveyError(null);
    try {
      const response = await fetch('/api/exports/survey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, comment }),
      });
      const contentType = response.headers.get('content-type') ?? '';
      if (!contentType.includes('application/json')) {
        throw new Error(
          response.status === 404
            ? 'The survey service is not available on this deployment. Deploy the latest app version and try again.'
            : `The server returned an unexpected response (HTTP ${response.status}). Try again later.`,
        );
      }
      const payload = (await response.json()) as { error?: string };
      if (!response.ok) {
        setSurveyStatus('error');
        setSurveyError(payload.error ?? 'Could not send your response. Please try again.');
        return;
      }
      setSurveyStatus('success');
    } catch (error) {
      console.error('Could not submit export survey', error);
      setSurveyStatus('error');
      setSurveyError(
        error instanceof Error
          ? error.message
          : 'Could not send your response. Check your connection and try again.',
      );
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-foreground/50 p-4">
      <section
        aria-labelledby="export-follow-up-title"
        aria-modal="true"
        className="my-auto w-full max-w-lg rounded-container bg-surface-strong p-6 shadow-soft sm:p-8"
        role="dialog"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-primary">Export complete</p>
            <h2 id="export-follow-up-title" className="mt-1 text-2xl font-semibold text-foreground">
              Share Verve on campus
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-secondary">
              Know a classmate who could use an easier way to prepare assignment covers? Invite them to try Verve.
            </p>
          </div>
          <button
            aria-label="Close"
            className="rounded-control p-2 text-secondary hover:bg-surface focus-ring"
            onClick={onClose}
            type="button"
          >
            <Icon name="close" />
          </button>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <button
            className="inline-flex items-center gap-2 rounded-control bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-soft hover:opacity-90 focus-ring"
            onClick={shareVerve}
            type="button"
          >
            <Icon name="share" className="text-[18px]" />
            Share with friends
          </button>
          <button
            className="inline-flex items-center gap-2 rounded-control border border-outline-variant/40 bg-surface px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-secondary-container focus-ring"
            onClick={copyInviteLink}
            type="button"
          >
            <Icon name="link" className="text-[18px]" />
            Copy invite link
          </button>
        </div>
        {shareMessage ? (
          <p className="mt-3 text-sm text-secondary" role="status">{shareMessage}</p>
        ) : null}

        {showSurvey ? (
          <div className="mt-6 border-t border-outline-variant/30 pt-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">Quick student survey</p>
            <h3 className="mt-1 text-lg font-semibold text-foreground">
              How easy was it to create your export?
            </h3>
            {surveyStatus === 'success' ? (
              <p className="mt-3 rounded-control bg-secondary-container px-3 py-2 text-sm text-foreground" role="status">
                Thanks for helping us improve Verve!
              </p>
            ) : (
              <form className="mt-4 space-y-4" onSubmit={submitSurvey}>
                <fieldset>
                  <legend className="sr-only">Rate how easy Verve was to use, from 1 to 5</legend>
                  <div className="flex gap-2" role="radiogroup">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <button
                        aria-checked={rating === value}
                        aria-label={`${value} out of 5`}
                        className={`flex h-10 w-10 items-center justify-center rounded-full border text-sm font-semibold focus-ring ${
                          rating === value
                            ? 'border-primary bg-primary text-primary-foreground'
                            : 'border-outline-variant/50 bg-surface text-foreground hover:bg-secondary-container'
                        }`}
                        key={value}
                        onClick={() => setRating(value)}
                        role="radio"
                        type="button"
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                  <div className="mt-1 flex justify-between text-xs text-secondary">
                    <span>Not easy</span>
                    <span>Very easy</span>
                  </div>
                </fieldset>
                <label className="block text-sm font-medium text-foreground" htmlFor="export-survey-comment">
                  What could we improve? <span className="font-normal text-secondary">(optional)</span>
                </label>
                <textarea
                  className="mt-1 min-h-20 w-full resize-y rounded-control border border-outline-variant/50 bg-surface px-3 py-2 text-foreground focus-ring"
                  id="export-survey-comment"
                  maxLength={1200}
                  onChange={(event) => setComment(event.target.value)}
                  value={comment}
                />
                {surveyError ? (
                  <p className="text-sm text-error" role="alert">{surveyError}</p>
                ) : null}
                <button
                  className="rounded-control bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-soft hover:opacity-90 focus-ring disabled:opacity-60"
                  disabled={surveyStatus === 'pending'}
                  type="submit"
                >
                  {surveyStatus === 'pending' ? 'Sending…' : 'Send survey'}
                </button>
              </form>
            )}
          </div>
        ) : null}

        <button
          className="mt-6 w-full rounded-control px-4 py-2 text-sm font-medium text-secondary hover:bg-surface focus-ring"
          onClick={onClose}
          type="button"
        >
          Close
        </button>
      </section>
    </div>
  );
}
