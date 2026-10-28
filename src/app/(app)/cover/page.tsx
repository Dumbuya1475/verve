"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";
import { CoverPreview } from "@/components/CoverPreview";
import { ExportShareDialog } from "@/components/ExportShareDialog";
import { Icon } from "@/components/Icon";
import { trackExportCompleted } from "@/lib/firebase/analytics";
import { exportCoverPdf, exportCoverWord } from "@/lib/cover/export";
import { pullRemoteCoverDraft, pushRemoteCoverDraft } from "@/lib/cover/sync";
import { warmExportModules } from "@/lib/cover/warmExports";
import {
  cancelGuestExport,
  completeGuestExport,
  reserveGuestExport,
} from "@/lib/exports/guestClient";
import type { CoverFormData, CoverType, GroupMember } from "@/lib/cover/types";

const DEFAULT_FORM: CoverFormData = {
  university: "Limkokwing University",
  faculty: "Department of Information and Communication Technology",
  courseCode: "PROG101",
  courseTitle: "Programming",
  assignmentTitle: "Individual Assignment 1",
  issueDate: "WEEK 2",
  dueDate: "WEEK 4",
  lecturer: "Mr. Elijah",
  className: "DIT1202F",
  semester: "1 / 1",
  studentName: "Mohamed Super Dumbuya",
  studentId: "90500638",
};

const FACULTY_OPTIONS = [
  "Department of Architecture and Design Innovation",
  "Department of Business Management & Globalization",
  "Department of Communication, Media, Broadcasting and Public Relations",
  "Department of Information and Communication Technology",
];

const inputClass =
  "w-full min-w-0 bg-surface border border-outline-variant/30 rounded-control px-4 py-2.5 focus-ring focus:bg-surface-strong transition-all text-base";
const COVER_DRAFT_UPDATED_AT_KEY = "coverDraftUpdatedAt";

function getCoverSyncErrorMessage(error: unknown): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error.code === "permission-denied" || error.code === "firestore/permission-denied")
  ) {
    return "Firebase denied cloud sync. Deploy firestore.rules to the Firebase project configured for this app, then try again.";
  }

  return "Could not sync your cover.";
}

export default function CoverPage() {
  const { user, loading: authLoading } = useAuth();
  const [isClient, setIsClient] = useState(false);
  const [localDraftLoaded, setLocalDraftLoaded] = useState(false);
  const [localDraftUpdatedAt, setLocalDraftUpdatedAt] = useState(0);
  const [syncStatus, setSyncStatus] = useState<"local" | "syncing" | "synced" | "error">("local");
  const [syncErrorMessage, setSyncErrorMessage] = useState<string | null>(null);
  const [syncRetry, setSyncRetry] = useState(0);
  const [mobileTab, setMobileTab] = useState<"editor" | "preview">("editor");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [type, setType] = useState<CoverType>("Individual");
  const [formData, setFormData] = useState<CoverFormData>(DEFAULT_FORM);
  const [groupMembers, setGroupMembers] = useState<GroupMember[]>([
    { name: "John Doe", id: "123456" },
  ]);
  const [exporting, setExporting] = useState<"pdf" | "word" | null>(null);
  const [exportError, setExportError] = useState<string | null>(null);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [showSurvey, setShowSurvey] = useState(false);
  const cloudReadyUserId = useRef<string | null>(null);
  const hasLocalDraftRef = useRef(false);
  const currentDraftRef = useRef({ type, formData, groupMembers });

  useEffect(() => {
    setIsClient(true);
    warmExportModules();
    try {
      const savedType = localStorage.getItem("coverType");
      const savedFormData = localStorage.getItem("coverFormData");
      const savedMembers = localStorage.getItem("coverGroupMembers");
      const savedUpdatedAt = Number(localStorage.getItem(COVER_DRAFT_UPDATED_AT_KEY));
      hasLocalDraftRef.current = Boolean(savedType || savedFormData || savedMembers);
      setLocalDraftUpdatedAt(
        Number.isFinite(savedUpdatedAt) && savedUpdatedAt > 0 ? savedUpdatedAt : 0,
      );
      if (savedType === "Individual" || savedType === "Group")
        setType(savedType);
      if (savedFormData)
        setFormData({ ...DEFAULT_FORM, ...JSON.parse(savedFormData) });
      if (savedMembers) {
        const parsed = JSON.parse(savedMembers);
        if (Array.isArray(parsed) && parsed.length > 0) setGroupMembers(parsed);
      }
    } catch {
      // Keep defaults if saved data is unreadable.
    } finally {
      setLocalDraftLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!user?.uid) return;
    let cancelled = false;

    void fetch("/api/exports/survey", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) return;
        const result = (await response.json()) as { eligible?: boolean };
        if (!cancelled && result.eligible) {
          setShowSurvey(true);
          setShareDialogOpen(true);
        }
      })
      .catch((error: unknown) => {
        console.error("Could not check export survey eligibility", error);
      });

    return () => {
      cancelled = true;
    };
  }, [user?.uid]);

  useEffect(() => {
    if (!isClient) return;
    localStorage.setItem("coverType", type);
    localStorage.setItem("coverFormData", JSON.stringify(formData));
    localStorage.setItem("coverGroupMembers", JSON.stringify(groupMembers));
    localStorage.setItem(COVER_DRAFT_UPDATED_AT_KEY, String(Date.now()));
  }, [type, formData, groupMembers, isClient]);

  useEffect(() => {
    currentDraftRef.current = { type, formData, groupMembers };
  }, [type, formData, groupMembers]);

  useEffect(() => {
    if (!localDraftLoaded || authLoading) return;
    if (!user) {
      cloudReadyUserId.current = null;
      return;
    }

    const userId = user.uid;
    let cancelled = false;
    cloudReadyUserId.current = null;
    setSyncStatus("syncing");

    async function syncOnLoad() {
      try {
        const remoteDraft = await pullRemoteCoverDraft(userId);
        if (cancelled) return;

        const latestLocalUpdatedAt = Number(
          localStorage.getItem(COVER_DRAFT_UPDATED_AT_KEY),
        );
        const localUpdatedAt =
          Number.isFinite(latestLocalUpdatedAt) && latestLocalUpdatedAt > 0
            ? latestLocalUpdatedAt
            : localDraftUpdatedAt;
        const currentLocalDraft = currentDraftRef.current;
        const localDraftExists = hasLocalDraftRef.current;

        if (remoteDraft && (!localDraftExists || remoteDraft.updatedAt >= localUpdatedAt)) {
          setType(remoteDraft.type);
          setFormData(remoteDraft.formData);
          setGroupMembers(remoteDraft.groupMembers);
        } else if (localDraftExists) {
          await pushRemoteCoverDraft(userId, {
            ...currentLocalDraft,
            updatedAt: localUpdatedAt || Date.now(),
          });
        }

        if (!cancelled) {
          cloudReadyUserId.current = userId;
          setSyncStatus("synced");
        }
      } catch (error) {
        console.error("Could not sync cover draft", error);
        if (!cancelled) {
          setSyncErrorMessage(getCoverSyncErrorMessage(error));
          setSyncStatus("error");
        }
      }
    }

    void syncOnLoad();
    return () => {
      cancelled = true;
    };
  }, [
    authLoading,
    localDraftLoaded,
    localDraftUpdatedAt,
    syncRetry,
    user?.uid,
  ]);

  useEffect(() => {
    if (!user || syncStatus !== "synced" || cloudReadyUserId.current !== user.uid) return;

    const handle = window.setTimeout(async () => {
      setSyncErrorMessage(null);
      setSyncStatus("syncing");
      try {
        await pushRemoteCoverDraft(user.uid, {
          type,
          formData,
          groupMembers,
          updatedAt: Date.now(),
        });
        cloudReadyUserId.current = user.uid;
        setSyncStatus("synced");
      } catch (error) {
        console.error("Could not save cover draft to the cloud", error);
        setSyncErrorMessage(getCoverSyncErrorMessage(error));
        setSyncStatus("error");
      }
    }, 800);

    return () => window.clearTimeout(handle);
  }, [formData, groupMembers, syncStatus, type, user]);

  const handleMemberChange = (
    index: number,
    field: "name" | "id",
    value: string,
  ) => {
    hasLocalDraftRef.current = true;
    setGroupMembers((current) =>
      current.map((member, memberIndex) =>
        memberIndex === index ? { ...member, [field]: value } : member,
      ),
    );
  };

  const addMember = () => {
    hasLocalDraftRef.current = true;
    setGroupMembers((current) => [...current, { name: "", id: "" }]);
  };

  const removeMember = (index: number) => {
    hasLocalDraftRef.current = true;
    setGroupMembers((current) =>
      current.length <= 1 ? current : current.filter((_, i) => i !== index),
    );
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    hasLocalDraftRef.current = true;
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const changeType = (nextType: CoverType) => {
    hasLocalDraftRef.current = true;
    setType(nextType);
  };

  const runExport = async (kind: "pdf" | "word") => {
    if (exporting) return;
    setExportError(null);

    if (authLoading) {
      setExportError(
        "Checking your sign-in status. Please try again in a moment.",
      );
      return;
    }

    setExporting(kind);
    let guestReservationId: string | null = null;
    if (!user) {
      try {
        guestReservationId = await reserveGuestExport("cover", kind);
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Could not verify your free export.";
        setExportError(message);
        setExporting(null);
        return;
      }
    }

    try {
      if (kind === "pdf") {
        await exportCoverPdf({ type, formData, groupMembers });
      } else {
        await exportCoverWord({ type, formData, groupMembers });
      }
    } catch (error) {
      console.error(error);
      if (guestReservationId) {
        try {
          await cancelGuestExport(guestReservationId);
        } catch (cancelError) {
          console.error(
            "Could not release failed guest export reservation",
            cancelError,
          );
        }
      }
      const offline = typeof navigator !== "undefined" && !navigator.onLine;
      setExportError(
        offline
          ? kind === "pdf"
            ? "Could not create the PDF offline. Open this page once while online, then try again."
            : "Could not create the Word file offline. Open this page once while online, then try again."
          : kind === "pdf"
            ? "Could not create the PDF. Check the preview and try again."
            : "Could not create the Word file. Check the preview and try again.",
      );
      setExporting(null);
      return;
    }

    void trackExportCompleted("cover", kind, Boolean(user));

    let shouldShowSurvey = false;
    if (guestReservationId) {
      try {
        await completeGuestExport(guestReservationId);
      } catch (error) {
        console.error("Guest export tracking failed", error);
        setExportError(
          "Your file was created, but its guest export could not be recorded. Keep this browser open and try again shortly.",
        );
      }
    } else {
      try {
        const response = await fetch("/api/exports/record", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ kind: "cover", format: kind }),
        });
        if (!response.ok) {
          const payload = (await response.json().catch(() => null)) as {
            error?: string;
          } | null;
          console.error("Export tracking failed", response.status);
          setExportError(
            payload?.error ??
              "Your file was created, but its usage could not be recorded.",
          );
        } else {
          const result = (await response.json()) as { showSurvey?: boolean };
          shouldShowSurvey = result.showSurvey === true;
        }
      } catch (error) {
        console.error("Export tracking failed", error);
        setExportError(
          "Your file was created, but the app server could not be reached to record usage. Check your connection and try again when the app is available.",
        );
      }
    }
    setExporting(null);
    setShowSurvey(shouldShowSurvey);
    setShareDialogOpen(true);
  };

  const exportButtons = (
    <div className="flex flex-wrap items-center justify-end gap-2">
      <button
        type="button"
        onClick={() => {
          setShowSurvey(false);
          setShareDialogOpen(true);
        }}
        className="bg-surface-strong text-foreground border border-outline-variant/30 px-3 sm:px-4 py-2 rounded-control text-sm font-bold flex items-center gap-2 hover:bg-surface transition-colors shadow-soft focus-ring"
      >
        <Icon name="share" className="text-[18px]" />
        Share
      </button>
      <button
        type="button"
        onClick={() => setIsFullscreen(true)}
        className="bg-secondary-container text-secondary p-2 rounded-control hover:bg-outline-variant/30 transition-colors focus-ring"
        aria-label="Open full-size preview"
      >
        <span className="inline-flex align-middle text-[24px]">
          <Icon name="zoom_in" />
        </span>
      </button>
      <button
        type="button"
        onClick={() => runExport("pdf")}
        disabled={exporting !== null}
        className="bg-primary text-primary-foreground px-3 sm:px-4 py-2 rounded-control text-sm font-bold flex items-center gap-2 hover:opacity-90 active:scale-95 transition-all shadow-soft disabled:opacity-60 focus-ring"
      >
        <Icon name="picture_as_pdf" className="text-[18px]" />
        {exporting === "pdf" ? "Saving…" : "PDF"}
      </button>
      <button
        type="button"
        onClick={() => runExport("word")}
        disabled={exporting !== null}
        className="bg-surface-strong text-foreground border border-outline-variant/30 px-3 sm:px-4 py-2 rounded-control text-sm font-bold flex items-center gap-2 hover:bg-surface active:scale-95 transition-all shadow-soft disabled:opacity-60 focus-ring"
      >
        <Icon name="description" className="text-[18px]" />
        {exporting === "word" ? "Saving…" : "Word"}
      </button>
    </div>
  );

  return (
    <div className="flex min-h-0 flex-col">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold text-foreground sm:text-3xl">
            Cover Page Details
          </h1>
          <p className="mt-1 text-secondary text-sm sm:text-base">
            Fill in your assignment details, then export a PDF or Word cover
            that matches the faculty template.
          </p>
          {user ? (
            <div className="mt-2 text-sm text-secondary" role="status" aria-live="polite">
              {syncStatus === "syncing"
                ? "Syncing your cover to your account…"
                : syncStatus === "synced"
                  ? "Your cover is synced to your account."
                  : syncStatus === "error"
                    ? (
                        <>
                          {syncErrorMessage ?? "Could not sync your cover."} It is still saved on this device.{" "}
                          <button
                            type="button"
                            className="font-medium text-primary underline focus-ring"
                            onClick={() => setSyncRetry((attempt) => attempt + 1)}
                          >
                            Try again
                          </button>
                        </>
                      )
                    : "Your cover is saved on this device."}
            </div>
          ) : isClient ? (
            <p className="mt-2 text-sm text-secondary">
              Sign in with the same account on each device to sync cover drafts. Guest drafts stay
              on this device.
            </p>
          ) : null}
          {!user && isClient ? (
            <p className="mt-2 text-sm text-secondary">
              Try one free export without an account. Create an account for
              more.{" "}
              <Link
                href="/signup?next=/cover"
                className="font-medium text-primary focus-ring rounded-control"
              >
                Create an account
              </Link>
            </p>
          ) : null}
        </div>
        <div className="hidden lg:block">{exportButtons}</div>
      </div>

      {exportError && (
        <div className="mb-4 flex items-start justify-between gap-3 rounded-control bg-error-container px-4 py-3 text-sm text-error">
          <div>
            <p>{exportError}</p>
            {exportError.includes("free export has been used") ||
            exportError.includes("guest export session expired") ? (
              <Link
                href="/signup?next=/cover"
                className="mt-1 inline-block font-semibold text-primary underline focus-ring"
              >
                Create an account to continue
              </Link>
            ) : null}
          </div>
          <button
            type="button"
            className="shrink-0 font-medium focus-ring rounded-control"
            onClick={() => setExportError(null)}
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="lg:hidden mb-4 flex bg-surface p-1 rounded-xl shadow-sm border border-outline-variant/30 shrink-0">
        <button
          type="button"
          onClick={() => setMobileTab("editor")}
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors focus-ring ${
            mobileTab === "editor"
              ? "bg-surface-strong text-foreground shadow-sm"
              : "text-secondary hover:text-foreground"
          }`}
        >
          Editor
        </button>
        <button
          type="button"
          onClick={() => setMobileTab("preview")}
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors focus-ring ${
            mobileTab === "preview"
              ? "bg-surface-strong text-foreground shadow-sm"
              : "text-secondary hover:text-foreground"
          }`}
        >
          Preview
        </button>
      </div>

      <div className="lg:hidden mb-4">{exportButtons}</div>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:min-h-0">
        <section
          className={`w-full min-w-0 lg:w-5/12 flex-col gap-6 ${
            mobileTab === "editor" ? "flex" : "hidden lg:flex"
          }`}
        >
          <div className="bg-surface p-1 rounded-xl flex shadow-sm border border-outline-variant/30">
            <button
              type="button"
              onClick={() => changeType("Individual")}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors focus-ring ${
                type === "Individual"
                  ? "bg-surface-strong shadow-sm text-foreground"
                  : "text-secondary hover:text-foreground"
              }`}
            >
              Individual
            </button>
            <button
              type="button"
              onClick={() => changeType("Group")}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors focus-ring ${
                type === "Group"
                  ? "bg-surface-strong shadow-sm text-foreground"
                  : "text-secondary hover:text-foreground"
              }`}
            >
              Group
            </button>
          </div>

          <form
            className="flex flex-col gap-4"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="flex flex-col gap-1">
              <label
                className="text-sm font-medium text-secondary"
                htmlFor="faculty"
              >
                Faculty
              </label>
              <select
                id="faculty"
                name="faculty"
                className={inputClass}
                value={formData.faculty}
                onChange={handleChange}
              >
                {FACULTY_OPTIONS.map((faculty) => (
                  <option key={faculty} value={faculty}>
                    {faculty}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1 min-w-0">
                <label
                  className="text-sm font-medium text-secondary"
                  htmlFor="courseCode"
                >
                  Course Code
                </label>
                <input
                  id="courseCode"
                  name="courseCode"
                  className={inputClass}
                  type="text"
                  value={formData.courseCode}
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-col gap-1 min-w-0">
                <label
                  className="text-sm font-medium text-secondary"
                  htmlFor="courseTitle"
                >
                  Course Title
                </label>
                <input
                  id="courseTitle"
                  name="courseTitle"
                  className={inputClass}
                  type="text"
                  value={formData.courseTitle}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label
                className="text-sm font-medium text-secondary"
                htmlFor="assignmentTitle"
              >
                Assignment Title
              </label>
              <input
                id="assignmentTitle"
                name="assignmentTitle"
                className={inputClass}
                type="text"
                value={formData.assignmentTitle}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1 min-w-0">
                <label
                  className="text-sm font-medium text-secondary"
                  htmlFor="issueDate"
                >
                  Issue Date
                </label>
                <input
                  id="issueDate"
                  name="issueDate"
                  className={inputClass}
                  type="text"
                  placeholder="WEEK 2"
                  value={formData.issueDate}
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-col gap-1 min-w-0">
                <label
                  className="text-sm font-medium text-secondary"
                  htmlFor="dueDate"
                >
                  Due Date
                </label>
                <input
                  id="dueDate"
                  name="dueDate"
                  className={inputClass}
                  type="text"
                  placeholder="WEEK 4"
                  value={formData.dueDate}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label
                className="text-sm font-medium text-secondary"
                htmlFor="lecturer"
              >
                Lecturer/Examiner
              </label>
              <input
                id="lecturer"
                name="lecturer"
                className={inputClass}
                type="text"
                value={formData.lecturer}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1 min-w-0">
                <label
                  className="text-sm font-medium text-secondary"
                  htmlFor="className"
                >
                  Class
                </label>
                <input
                  id="className"
                  name="className"
                  className={inputClass}
                  type="text"
                  value={formData.className}
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-col gap-1 min-w-0">
                <label
                  className="text-sm font-medium text-secondary"
                  htmlFor="semester"
                >
                  Semester/Year
                </label>
                <input
                  id="semester"
                  name="semester"
                  className={inputClass}
                  type="text"
                  value={formData.semester}
                  onChange={handleChange}
                />
              </div>
            </div>

            {type === "Individual" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1 min-w-0">
                  <label
                    className="text-sm font-medium text-secondary"
                    htmlFor="studentName"
                  >
                    Student Name
                  </label>
                  <input
                    id="studentName"
                    name="studentName"
                    className={inputClass}
                    type="text"
                    value={formData.studentName}
                    onChange={handleChange}
                  />
                </div>
                <div className="flex flex-col gap-1 min-w-0">
                  <label
                    className="text-sm font-medium text-secondary"
                    htmlFor="studentId"
                  >
                    Student ID
                  </label>
                  <input
                    id="studentId"
                    name="studentId"
                    className={inputClass}
                    type="text"
                    value={formData.studentId}
                    onChange={handleChange}
                  />
                </div>
              </div>
            )}
          </form>

          {type === "Group" && (
            <div className="bg-surface p-4 sm:p-6 rounded-container border border-outline-variant/30">
              <div className="flex justify-between items-center gap-3 mb-4">
                <h2 className="text-lg font-semibold text-foreground">
                  Group Members
                </h2>
                <button
                  type="button"
                  onClick={addMember}
                  className="text-primary text-sm font-medium flex items-center gap-1 hover:opacity-80 focus-ring rounded-control"
                >
                  <span className="inline-flex text-[16px]">
                    <Icon name="add_circle" />
                  </span>{" "}
                  Add Member
                </button>
              </div>
              <div className="flex flex-col gap-3">
                {groupMembers.map((member, idx) => (
                  <div key={idx} className="flex gap-2 min-w-0">
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={member.name}
                      onChange={(e) =>
                        handleMemberChange(idx, "name", e.target.value)
                      }
                      className="flex-1 min-w-0 bg-surface-strong border border-outline-variant/30 rounded-control px-3 py-2.5 focus-ring text-base"
                    />
                    <input
                      type="text"
                      placeholder="ID"
                      value={member.id}
                      onChange={(e) =>
                        handleMemberChange(idx, "id", e.target.value)
                      }
                      className="w-24 shrink-0 bg-surface-strong border border-outline-variant/30 rounded-control px-3 py-2.5 focus-ring text-base"
                    />
                    <button
                      type="button"
                      onClick={() => removeMember(idx)}
                      disabled={groupMembers.length <= 1}
                      className="shrink-0 text-secondary hover:text-error disabled:opacity-40 p-2 rounded-control focus-ring"
                      aria-label={`Remove ${member.name || `member ${idx + 1}`}`}
                    >
                      <Icon name="close" className="text-[20px]" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        <section
          className={`w-full min-w-0 lg:w-7/12 flex-col gap-4 ${
            mobileTab === "preview" ? "flex" : "hidden lg:flex"
          }`}
        >
          <div className="hidden lg:flex justify-between items-center">
            <h2 className="text-sm font-semibold text-secondary uppercase tracking-wider">
              Preview
            </h2>
          </div>
          <div className="bg-surface rounded-container p-3 sm:p-6 flex justify-center overflow-x-hidden">
            <CoverPreview
              type={type}
              formData={formData}
              groupMembers={groupMembers}
            />
          </div>
        </section>
      </div>

      {isFullscreen && (
        <div
          className="fixed inset-0 z-50 bg-black/80 overflow-y-auto p-3 sm:p-8"
          onClick={() => setIsFullscreen(false)}
        >
          <div
            className="relative mx-auto w-full max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="mb-3 text-white hover:text-white/80 focus-ring rounded-control"
              onClick={() => setIsFullscreen(false)}
            >
              <span className="inline-flex align-middle text-3xl">
                <Icon name="close" />
              </span>
              <span className="sr-only">Close preview</span>
            </button>
            <CoverPreview
              type={type}
              formData={formData}
              groupMembers={groupMembers}
            />
          </div>
        </div>
      )}
      {shareDialogOpen ? (
        <ExportShareDialog
          onClose={() => setShareDialogOpen(false)}
          showSurvey={showSurvey}
        />
      ) : null}
    </div>
  );
}
