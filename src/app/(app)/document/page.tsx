'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import { DocumentPreview } from '@/components/DocumentPreview';
import { readCoverDraft } from '@/lib/document/coverDraft';
import { exportAssignmentPdf, exportAssignmentWord } from '@/lib/document/export';
import { readLocalAssignment, writeLocalAssignment } from '@/lib/document/storage';
import { pullRemoteAssignment, pushRemoteAssignment } from '@/lib/document/sync';
import {
  ASSIGNMENT_SECTIONS,
  emptyAssignment,
  type AssignmentDraft,
  type AssignmentSectionKey,
} from '@/lib/document/types';
import {
  GUEST_EXPORT_LIMIT,
  canGuestExport,
  recordGuestExport,
  remainingGuestExports,
} from '@/lib/cover/exportQuota';

const inputClass =
  'w-full min-w-0 bg-surface border border-outline-variant/30 rounded-control px-4 py-2.5 focus-ring focus:bg-surface-strong transition-all text-base';

const textareaClass = `${inputClass} min-h-36 resize-y`;

type SaveState = 'local' | 'synced' | 'syncing' | 'offline';

export default function DocumentPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [isClient, setIsClient] = useState(false);
  const [draft, setDraft] = useState<AssignmentDraft>(emptyAssignment);
  const [mobileTab, setMobileTab] = useState<'editor' | 'preview'>('editor');
  const [exporting, setExporting] = useState<'pdf' | 'word' | null>(null);
  const [exportError, setExportError] = useState<string | null>(null);
  const [guestRemaining, setGuestRemaining] = useState(GUEST_EXPORT_LIMIT);
  const [saveState, setSaveState] = useState<SaveState>('local');
  const [hasCover, setHasCover] = useState(false);
  const skipNextPush = useRef(true);
  const userId = user?.uid ?? null;

  useEffect(() => {
    setIsClient(true);
    const local = readLocalAssignment();
    setDraft(local);
    setHasCover(Boolean(readCoverDraft()));
    setGuestRemaining(remainingGuestExports());
  }, []);

  useEffect(() => {
    if (!isClient || authLoading) return;
    if (!userId) {
      skipNextPush.current = true;
      return;
    }

    let cancelled = false;
    skipNextPush.current = true;

    (async () => {
      try {
        const remote = await pullRemoteAssignment(userId);
        if (cancelled) return;
        const local = readLocalAssignment();
        if (remote && remote.updatedAt > local.updatedAt) {
          setDraft(remote);
          writeLocalAssignment(remote);
        } else if (local.updatedAt >= (remote?.updatedAt ?? 0)) {
          await pushRemoteAssignment(userId, local);
        }
        if (!cancelled) setSaveState('synced');
      } catch {
        if (!cancelled) setSaveState('offline');
      } finally {
        skipNextPush.current = false;
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [authLoading, isClient, userId]);

  useEffect(() => {
    if (!isClient) return;
    writeLocalAssignment(draft);
    if (!userId) {
      setSaveState('local');
      return;
    }
    if (skipNextPush.current) return;

    setSaveState('syncing');
    const handle = window.setTimeout(() => {
      pushRemoteAssignment(userId, draft)
        .then(() => setSaveState('synced'))
        .catch(() => setSaveState('offline'));
    }, 800);

    return () => window.clearTimeout(handle);
  }, [draft, isClient, userId]);

  const updateDraft = (patch: Partial<AssignmentDraft>) => {
    setDraft((current) => ({ ...current, ...patch, updatedAt: Date.now() }));
  };

  const runExport = async (kind: 'pdf' | 'word') => {
    if (exporting || authLoading) return;
    setExportError(null);

    if (!user && !canGuestExport()) {
      setExportError(
        `You have used your ${GUEST_EXPORT_LIMIT} free exports. Create an account to keep downloading.`,
      );
      router.push('/signup?next=/document');
      return;
    }

    if (draft.includeCover && !readCoverDraft()) {
      setExportError('Turn off “Add cover as page 1”, or fill in a cover first.');
      return;
    }

    setExporting(kind);
    try {
      if (kind === 'pdf') {
        await exportAssignmentPdf(draft);
      } else {
        await exportAssignmentWord(draft);
      }
      if (!user) {
        recordGuestExport();
        setGuestRemaining(remainingGuestExports());
      }
    } catch (error) {
      console.error(error);
      setExportError(
        error instanceof Error
          ? error.message
          : kind === 'pdf'
            ? 'Could not create the PDF. Check the preview and try again.'
            : 'Could not create the Word file. Check the preview and try again.',
      );
    } finally {
      setExporting(null);
    }
  };

  const saveLabel =
    saveState === 'synced'
      ? 'Saved to your account'
      : saveState === 'syncing'
        ? 'Saving to your account…'
        : saveState === 'offline'
          ? 'Saved on this device. Could not reach the cloud.'
          : 'Saved on this device';

  const exportButtons = (
    <div className="flex flex-wrap items-center justify-end gap-2">
      <button
        type="button"
        onClick={() => runExport('pdf')}
        disabled={exporting !== null}
        className="bg-primary text-primary-foreground px-3 sm:px-4 py-2 rounded-control text-sm font-bold flex items-center gap-2 hover:opacity-90 active:scale-95 transition-all shadow-soft disabled:opacity-60 focus-ring"
      >
        <span className="material-symbols-outlined text-[18px]">picture_as_pdf</span>
        {exporting === 'pdf' ? 'Saving…' : 'PDF'}
      </button>
      <button
        type="button"
        onClick={() => runExport('word')}
        disabled={exporting !== null}
        className="bg-surface-strong text-foreground border border-outline-variant/30 px-3 sm:px-4 py-2 rounded-control text-sm font-bold flex items-center gap-2 hover:bg-surface active:scale-95 transition-all shadow-soft disabled:opacity-60 focus-ring"
      >
        <span className="material-symbols-outlined text-[18px]">description</span>
        {exporting === 'word' ? 'Saving…' : 'Word'}
      </button>
    </div>
  );

  return (
    <div className="flex min-h-0 flex-col">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold text-foreground sm:text-3xl">Assignment</h1>
          <p className="mt-1 text-secondary text-sm sm:text-base">
            Write the paper here. Cover is optional — add it as page 1 only if you want it.
          </p>
          {isClient ? (
            <p className="mt-2 text-sm text-secondary">
              {saveLabel}
              {!user ? (
                <>
                  {' '}
                  <Link href="/signup?next=/document" className="font-medium text-primary focus-ring rounded-control">
                    Sign in to sync across devices
                  </Link>
                </>
              ) : null}
            </p>
          ) : null}
          {!user && isClient ? (
            <p className="mt-1 text-sm text-secondary">
              {guestRemaining > 0
                ? `${guestRemaining} free export${guestRemaining === 1 ? '' : 's'} left without an account.`
                : 'Free exports used. Create an account to download again.'}
            </p>
          ) : null}
        </div>
        <div className="hidden lg:block">{exportButtons}</div>
      </div>

      {exportError ? (
        <div className="mb-4 flex items-start justify-between gap-3 rounded-control bg-error-container px-4 py-3 text-sm text-error">
          <p>{exportError}</p>
          <button type="button" className="shrink-0 font-medium focus-ring rounded-control" onClick={() => setExportError(null)}>
            Dismiss
          </button>
        </div>
      ) : null}

      <div className="lg:hidden mb-4 flex bg-surface p-1 rounded-xl shadow-sm border border-outline-variant/30 shrink-0">
        <button
          type="button"
          onClick={() => setMobileTab('editor')}
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors focus-ring ${
            mobileTab === 'editor' ? 'bg-surface-strong text-foreground shadow-sm' : 'text-secondary hover:text-foreground'
          }`}
        >
          Editor
        </button>
        <button
          type="button"
          onClick={() => setMobileTab('preview')}
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors focus-ring ${
            mobileTab === 'preview' ? 'bg-surface-strong text-foreground shadow-sm' : 'text-secondary hover:text-foreground'
          }`}
        >
          Preview
        </button>
      </div>

      <div className="lg:hidden mb-4">{exportButtons}</div>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:min-h-0">
        <section className={`w-full min-w-0 lg:w-5/12 flex-col gap-4 ${mobileTab === 'editor' ? 'flex' : 'hidden lg:flex'}`}>
          <form className="flex flex-col gap-4" onSubmit={(event) => event.preventDefault()}>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-secondary" htmlFor="assignment-title">
                Title
              </label>
              <input
                id="assignment-title"
                className={inputClass}
                type="text"
                value={draft.title}
                onChange={(event) => updateDraft({ title: event.target.value })}
                placeholder="e.g. Individual Assignment 1"
              />
            </div>

            {ASSIGNMENT_SECTIONS.map((section) => (
              <div key={section.key} className="flex flex-col gap-1">
                <label className="text-sm font-medium text-secondary" htmlFor={`assignment-${section.key}`}>
                  {section.label}
                </label>
                <textarea
                  id={`assignment-${section.key}`}
                  className={textareaClass}
                  value={draft[section.key]}
                  onChange={(event) =>
                    updateDraft({ [section.key]: event.target.value } as Pick<AssignmentDraft, AssignmentSectionKey>)
                  }
                  placeholder={`Write the ${section.label.toLowerCase()}…`}
                />
              </div>
            ))}

            <label className="flex items-start gap-3 rounded-container border border-outline-variant/30 bg-surface p-4">
              <input
                type="checkbox"
                className="mt-1 h-4 w-4 accent-primary focus-ring"
                checked={draft.includeCover}
                onChange={(event) => updateDraft({ includeCover: event.target.checked })}
              />
              <span>
                <span className="block text-sm font-medium text-foreground">Add cover as page 1</span>
                <span className="mt-1 block text-sm text-secondary">
                  Optional. Uses the cover you last edited.{' '}
                  {hasCover ? (
                    <Link href="/cover" className="font-medium text-primary focus-ring rounded-control">
                      Edit cover
                    </Link>
                  ) : (
                    <Link href="/cover" className="font-medium text-primary focus-ring rounded-control">
                      Make a cover first
                    </Link>
                  )}
                </span>
              </span>
            </label>
          </form>
        </section>

        <section className={`w-full min-w-0 lg:w-7/12 flex-col gap-4 ${mobileTab === 'preview' ? 'flex' : 'hidden lg:flex'}`}>
          <div className="hidden lg:flex justify-between items-center">
            <h2 className="text-sm font-semibold text-secondary uppercase tracking-wider">Preview</h2>
          </div>
          <div className="bg-surface rounded-container p-3 sm:p-6 flex justify-center overflow-x-hidden">
            <DocumentPreview draft={draft} />
          </div>
        </section>
      </div>
    </div>
  );
}
