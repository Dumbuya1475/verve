'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import { CoverPreview } from '@/components/CoverPreview';
import { exportCoverPdf, exportCoverWord } from '@/lib/cover/export';
import {
  GUEST_EXPORT_LIMIT,
  canGuestExport,
  recordGuestExport,
  remainingGuestExports,
} from '@/lib/cover/exportQuota';
import type { CoverFormData, CoverType, GroupMember } from '@/lib/cover/types';

const DEFAULT_FORM: CoverFormData = {
  university: 'Limkokwing University',
  faculty: 'Faculty of Information and Communication Technology',
  courseCode: 'COMP102',
  courseTitle: 'Software Engineering',
  assignmentTitle: 'Individual Assignment 1',
  issueDate: 'WEEK 2',
  dueDate: 'WEEK 4',
  lecturer: 'Mr. Ahmed Jeli Kamara',
  className: 'DIT1202F',
  semester: '1 / 1',
  studentName: 'Mohamed Super Dumbuya',
  studentId: '90500638',
};

const inputClass =
  'w-full min-w-0 bg-surface border border-outline-variant/30 rounded-control px-4 py-2.5 focus-ring focus:bg-surface-strong transition-all text-base';

export default function CoverPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [isClient, setIsClient] = useState(false);
  const [mobileTab, setMobileTab] = useState<'editor' | 'preview'>('editor');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [type, setType] = useState<CoverType>('Individual');
  const [formData, setFormData] = useState<CoverFormData>(DEFAULT_FORM);
  const [groupMembers, setGroupMembers] = useState<GroupMember[]>([{ name: 'John Doe', id: '123456' }]);
  const [exporting, setExporting] = useState<'pdf' | 'word' | null>(null);
  const [exportError, setExportError] = useState<string | null>(null);
  const [guestRemaining, setGuestRemaining] = useState(GUEST_EXPORT_LIMIT);

  useEffect(() => {
    setIsClient(true);
    try {
      const savedType = localStorage.getItem('coverType');
      const savedFormData = localStorage.getItem('coverFormData');
      const savedMembers = localStorage.getItem('coverGroupMembers');
      if (savedType === 'Individual' || savedType === 'Group') setType(savedType);
      if (savedFormData) setFormData({ ...DEFAULT_FORM, ...JSON.parse(savedFormData) });
      if (savedMembers) {
        const parsed = JSON.parse(savedMembers);
        if (Array.isArray(parsed) && parsed.length > 0) setGroupMembers(parsed);
      }
    } catch {
      // Keep defaults if saved data is unreadable.
    }
    setGuestRemaining(remainingGuestExports());
  }, []);

  useEffect(() => {
    if (!isClient) return;
    localStorage.setItem('coverType', type);
    localStorage.setItem('coverFormData', JSON.stringify(formData));
    localStorage.setItem('coverGroupMembers', JSON.stringify(groupMembers));
  }, [type, formData, groupMembers, isClient]);

  const handleMemberChange = (index: number, field: 'name' | 'id', value: string) => {
    setGroupMembers((current) =>
      current.map((member, memberIndex) =>
        memberIndex === index ? { ...member, [field]: value } : member,
      ),
    );
  };

  const addMember = () => {
    setGroupMembers((current) => [...current, { name: '', id: '' }]);
  };

  const removeMember = (index: number) => {
    setGroupMembers((current) => (current.length <= 1 ? current : current.filter((_, i) => i !== index)));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const runExport = async (kind: 'pdf' | 'word') => {
    if (exporting || authLoading) return;
    setExportError(null);

    if (!user && !canGuestExport()) {
      setExportError(
        `You have used your ${GUEST_EXPORT_LIMIT} free exports. Create an account to keep downloading.`,
      );
      router.push('/signup?next=/cover');
      return;
    }

    setExporting(kind);
    try {
      if (kind === 'pdf') {
        await exportCoverPdf({ type, formData, groupMembers });
      } else {
        await exportCoverWord({ type, formData, groupMembers });
      }
      if (!user) {
        recordGuestExport();
        setGuestRemaining(remainingGuestExports());
      }
    } catch (error) {
      console.error(error);
      setExportError(
        kind === 'pdf'
          ? 'Could not create the PDF. Check the preview and try again.'
          : 'Could not create the Word file. Check the preview and try again.',
      );
    } finally {
      setExporting(null);
    }
  };

  const exportButtons = (
    <div className="flex flex-wrap items-center justify-end gap-2">
      <button
        type="button"
        onClick={() => setIsFullscreen(true)}
        className="bg-secondary-container text-secondary p-2 rounded-control hover:bg-outline-variant/30 transition-colors focus-ring"
        aria-label="Open full-size preview"
      >
        <span className="material-symbols-outlined align-middle">zoom_in</span>
      </button>
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
          <h1 className="text-2xl font-semibold text-foreground sm:text-3xl">Cover Page Details</h1>
          <p className="mt-1 text-secondary text-sm sm:text-base">
            Fill in your assignment details, then export a PDF or Word cover that matches the faculty template.
          </p>
          {!user && isClient ? (
            <p className="mt-2 text-sm text-secondary">
              {guestRemaining > 0
                ? `${guestRemaining} free export${guestRemaining === 1 ? '' : 's'} left without an account.`
                : 'Free exports used. Create an account to download again.'}{' '}
              {guestRemaining === 0 ? (
                <Link href="/signup?next=/cover" className="font-medium text-primary focus-ring rounded-control">
                  Create an account
                </Link>
              ) : null}
            </p>
          ) : null}
        </div>
        <div className="hidden lg:block">{exportButtons}</div>
      </div>

      {exportError && (
        <div className="mb-4 flex items-start justify-between gap-3 rounded-control bg-error-container px-4 py-3 text-sm text-error">
          <p>{exportError}</p>
          <button type="button" className="shrink-0 font-medium focus-ring rounded-control" onClick={() => setExportError(null)}>
            Dismiss
          </button>
        </div>
      )}

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
        <section
          className={`w-full min-w-0 lg:w-5/12 flex-col gap-6 ${
            mobileTab === 'editor' ? 'flex' : 'hidden lg:flex'
          }`}
        >
          <div className="bg-surface p-1 rounded-xl flex shadow-sm border border-outline-variant/30">
            <button
              type="button"
              onClick={() => setType('Individual')}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors focus-ring ${
                type === 'Individual' ? 'bg-surface-strong shadow-sm text-foreground' : 'text-secondary hover:text-foreground'
              }`}
            >
              Individual
            </button>
            <button
              type="button"
              onClick={() => setType('Group')}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors focus-ring ${
                type === 'Group' ? 'bg-surface-strong shadow-sm text-foreground' : 'text-secondary hover:text-foreground'
              }`}
            >
              Group
            </button>
          </div>

          <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-secondary" htmlFor="faculty">Faculty</label>
              <input id="faculty" name="faculty" className={inputClass} type="text" value={formData.faculty} onChange={handleChange} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1 min-w-0">
                <label className="text-sm font-medium text-secondary" htmlFor="courseCode">Course Code</label>
                <input id="courseCode" name="courseCode" className={inputClass} type="text" value={formData.courseCode} onChange={handleChange} />
              </div>
              <div className="flex flex-col gap-1 min-w-0">
                <label className="text-sm font-medium text-secondary" htmlFor="courseTitle">Course Title</label>
                <input id="courseTitle" name="courseTitle" className={inputClass} type="text" value={formData.courseTitle} onChange={handleChange} />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-secondary" htmlFor="assignmentTitle">Assignment Title</label>
              <input id="assignmentTitle" name="assignmentTitle" className={inputClass} type="text" value={formData.assignmentTitle} onChange={handleChange} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1 min-w-0">
                <label className="text-sm font-medium text-secondary" htmlFor="issueDate">Issue Date</label>
                <input id="issueDate" name="issueDate" className={inputClass} type="text" placeholder="WEEK 2" value={formData.issueDate} onChange={handleChange} />
              </div>
              <div className="flex flex-col gap-1 min-w-0">
                <label className="text-sm font-medium text-secondary" htmlFor="dueDate">Due Date</label>
                <input id="dueDate" name="dueDate" className={inputClass} type="text" placeholder="WEEK 4" value={formData.dueDate} onChange={handleChange} />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-secondary" htmlFor="lecturer">Lecturer/Examiner</label>
              <input id="lecturer" name="lecturer" className={inputClass} type="text" value={formData.lecturer} onChange={handleChange} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1 min-w-0">
                <label className="text-sm font-medium text-secondary" htmlFor="className">Class</label>
                <input id="className" name="className" className={inputClass} type="text" value={formData.className} onChange={handleChange} />
              </div>
              <div className="flex flex-col gap-1 min-w-0">
                <label className="text-sm font-medium text-secondary" htmlFor="semester">Semester/Year</label>
                <input id="semester" name="semester" className={inputClass} type="text" value={formData.semester} onChange={handleChange} />
              </div>
            </div>

            {type === 'Individual' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1 min-w-0">
                  <label className="text-sm font-medium text-secondary" htmlFor="studentName">Student Name</label>
                  <input id="studentName" name="studentName" className={inputClass} type="text" value={formData.studentName} onChange={handleChange} />
                </div>
                <div className="flex flex-col gap-1 min-w-0">
                  <label className="text-sm font-medium text-secondary" htmlFor="studentId">Student ID</label>
                  <input id="studentId" name="studentId" className={inputClass} type="text" value={formData.studentId} onChange={handleChange} />
                </div>
              </div>
            )}
          </form>

          {type === 'Group' && (
            <div className="bg-surface p-4 sm:p-6 rounded-container border border-outline-variant/30">
              <div className="flex justify-between items-center gap-3 mb-4">
                <h2 className="text-lg font-semibold text-foreground">Group Members</h2>
                <button type="button" onClick={addMember} className="text-primary text-sm font-medium flex items-center gap-1 hover:opacity-80 focus-ring rounded-control">
                  <span className="material-symbols-outlined text-[16px]">add_circle</span> Add Member
                </button>
              </div>
              <div className="flex flex-col gap-3">
                {groupMembers.map((member, idx) => (
                  <div key={idx} className="flex gap-2 min-w-0">
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={member.name}
                      onChange={(e) => handleMemberChange(idx, 'name', e.target.value)}
                      className="flex-1 min-w-0 bg-surface-strong border border-outline-variant/30 rounded-control px-3 py-2.5 focus-ring text-base"
                    />
                    <input
                      type="text"
                      placeholder="ID"
                      value={member.id}
                      onChange={(e) => handleMemberChange(idx, 'id', e.target.value)}
                      className="w-24 shrink-0 bg-surface-strong border border-outline-variant/30 rounded-control px-3 py-2.5 focus-ring text-base"
                    />
                    <button
                      type="button"
                      onClick={() => removeMember(idx)}
                      disabled={groupMembers.length <= 1}
                      className="shrink-0 text-secondary hover:text-error disabled:opacity-40 p-2 rounded-control focus-ring"
                      aria-label={`Remove ${member.name || `member ${idx + 1}`}`}
                    >
                      <span className="material-symbols-outlined text-[20px]">close</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        <section
          className={`w-full min-w-0 lg:w-7/12 flex-col gap-4 ${
            mobileTab === 'preview' ? 'flex' : 'hidden lg:flex'
          }`}
        >
          <div className="hidden lg:flex justify-between items-center">
            <h2 className="text-sm font-semibold text-secondary uppercase tracking-wider">Preview</h2>
          </div>
          <div className="bg-surface rounded-container p-3 sm:p-6 flex justify-center overflow-x-hidden">
            <CoverPreview type={type} formData={formData} groupMembers={groupMembers} />
          </div>
        </section>
      </div>

      {isFullscreen && (
        <div
          className="fixed inset-0 z-50 bg-black/80 overflow-y-auto p-3 sm:p-8"
          onClick={() => setIsFullscreen(false)}
        >
          <div className="relative mx-auto w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="mb-3 text-white hover:text-white/80 focus-ring rounded-control"
              onClick={() => setIsFullscreen(false)}
            >
              <span className="material-symbols-outlined text-3xl align-middle">close</span>
              <span className="sr-only">Close preview</span>
            </button>
            <CoverPreview type={type} formData={formData} groupMembers={groupMembers} />
          </div>
        </div>
      )}
    </div>
  );
}
