import type { ReactNode } from 'react';

export type IconName =
  | 'home'
  | 'description'
  | 'picture_as_pdf'
  | 'chat'
  | 'zoom_in'
  | 'add_circle'
  | 'add'
  | 'close'
  | 'upload_file'
  | 'cloud_upload'
  | 'cloud_off'
  | 'download'
  | 'file_download'
  | 'history'
  | 'check_circle'
  | 'psychology'
  | 'present_to_all'
  | 'auto_awesome'
  | 'settings'
  | 'play_circle'
  | 'unfold_more'
  | 'lock'
  | 'publish'
  | 'archive'
  | 'gif_box'
  | 'send'
  | 'arrow_outward'
  | 'arrow_back'
  | 'edit_note'
  | 'bookmark';

const PATHS: Record<IconName, ReactNode> = {
  home: (
    <>
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9.5V21h5v-6h4v6h5V9.5" />
    </>
  ),
  description: (
    <>
      <path d="M6 2.5h8L19.5 8v13.5h-13.5z" />
      <path d="M13.5 2.5V8H19.5" />
      <path d="M9 13h6M9 16.5h6" />
    </>
  ),
  picture_as_pdf: (
    <>
      <path d="M6 2.5h8L19.5 8v13.5h-13.5z" />
      <path d="M13.5 2.5V8H19.5" />
      <path d="M9 13h6M9 16.5h4" />
    </>
  ),
  chat: (
    <>
      <path d="M4 4.5h16v10.5H9.5L4 19.5z" />
      <path d="M8 8.5h8M8 12h5" />
    </>
  ),
  zoom_in: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="M11 8.5v5M8.5 11h5M16.2 16.2 21 21" />
    </>
  ),
  add_circle: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8.5v7M8.5 12h7" />
    </>
  ),
  add: <path d="M12 5v14M5 12h14" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  upload_file: (
    <>
      <path d="M6 2.5h8L19.5 8v13.5h-13.5z" />
      <path d="M12 11v6m0-6-2.5 2.5M12 11l2.5 2.5" />
    </>
  ),
  cloud_upload: (
    <>
      <path d="M12 15V6.5m0 0L8.5 10M12 6.5 15.5 10" />
      <path d="M4 15.5v3.5a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3.5" />
    </>
  ),
  cloud_off: (
    <>
      <path d="M6.5 18.5a4 4 0 0 1-.6-7.9A6 6 0 0 1 17.2 9.3a3.8 3.8 0 0 1 .8 7.5" />
      <path d="m4 4 16 16" />
    </>
  ),
  download: (
    <>
      <path d="M12 4.5V15m0 0 3.5-3.5M12 15 8.5 11.5" />
      <path d="M4 16.5V19a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-2.5" />
    </>
  ),
  file_download: (
    <>
      <path d="M6 2.5h8L19.5 8v13.5h-13.5z" />
      <path d="M12 10v6m0 0 2.5-2.5M12 16l-2.5-2.5" />
    </>
  ),
  history: (
    <>
      <path d="M3.5 12a8.5 8.5 0 1 0 2.5-6" />
      <path d="M3.5 4v4.5h4.5" />
      <path d="M12 7.5V12l3 2.5" />
    </>
  ),
  check_circle: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m8.5 12.3 2.4 2.4 4.6-5.4" />
    </>
  ),
  psychology: (
    <>
      <path d="M9.5 4.5A2.8 2.8 0 0 0 6.7 7.3a2.8 2.8 0 0 0-1.9 2.6 2.8 2.8 0 0 0 1.7 2.6 2.8 2.8 0 0 0 3 3c.9 0 1.4.7 1.4 1.6v2.4h5v-1.8a4 4 0 0 0 1.9-7.2 3.8 3.8 0 0 0-3.4-5.7z" />
      <path d="M12 4.5v16" opacity="0" />
    </>
  ),
  present_to_all: (
    <>
      <rect x="3" y="4.5" width="18" height="11.5" rx="1.5" />
      <path d="M12 16v3.5M8.5 19.5h7" />
    </>
  ),
  auto_awesome: (
    <>
      <path d="M12 3.5 13.7 9l5.8 1.7-5.8 1.7L12 18l-1.7-5.6L4.5 10.7 10.3 9z" />
      <path d="M18.5 15.5c.3 1 1 1.7 2 2-1 .3-1.7 1-2 2-.3-1-1-1.7-2-2 1-.3 1.7-1 2-2Z" />
    </>
  ),
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2.5v2.8M12 18.7v2.8M2.5 12h2.8M18.7 12h2.8M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2" />
    </>
  ),
  play_circle: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m10 8.8 5.5 3.2-5.5 3.2z" />
    </>
  ),
  unfold_more: <path d="m7 10.5 5-5 5 5M7 13.5l5 5 5-5" />,
  lock: (
    <>
      <rect x="5" y="11" width="14" height="9" rx="1.5" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </>
  ),
  publish: (
    <>
      <path d="M12 15.5v-11m0 0L8.5 8M12 4.5 15.5 8" />
      <path d="M4.5 20h15" />
    </>
  ),
  archive: (
    <>
      <rect x="3" y="4.5" width="18" height="4.5" rx="1" />
      <path d="M5.5 9v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1V9" />
      <path d="M10 13h4" />
    </>
  ),
  gif_box: (
    <>
      <rect x="3" y="6" width="18" height="14" rx="2" />
      <path d="M3 10.5h18" />
    </>
  ),
  send: (
    <>
      <path d="M21 3.5 10.5 14" />
      <path d="M21 3.5 14.2 20.5l-3.7-6.5-6.5-3.7z" />
    </>
  ),
  arrow_outward: <path d="M7 17 17 7M8.5 7H17v8.5" />,
  arrow_back: <path d="M19 12H5m0 0 6-6m-6 6 6 6" />,
  bookmark: <path d="M6.5 3.5h11a1 1 0 0 1 1 1V21l-6.5-4-6.5 4V4.5a1 1 0 0 1 1-1Z" />,
  edit_note: (
    <>
      <path d="M4 20l1-4L16.6 4.4a2.1 2.1 0 0 1 3 3L8 19z" />
      <path d="m14.5 6.5 3 3" />
    </>
  ),
};

export type IconProps = {
  name: IconName;
  className?: string;
};

/** Inline SVG icon — no webfont, works offline and paints instantly. */
export function Icon({ name, className = '' }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={`inline-block shrink-0 ${className}`}
      style={{ fontSize: 'inherit' }}
    >
      {PATHS[name]}
    </svg>
  );
}
