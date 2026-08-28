'use client';

import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { ASSIGNMENT_PAGE_CSS, buildAssignmentInnerHtml } from '@/lib/document/html';
import { A4_HEIGHT_PX, A4_WIDTH_PX } from '@/lib/cover/types';
import type { AssignmentDraft } from '@/lib/document/types';

export function DocumentPreview({ draft }: { draft: AssignmentDraft }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [pageHeight, setPageHeight] = useState(A4_HEIGHT_PX);

  const html = useMemo(() => buildAssignmentInnerHtml(draft), [draft]);

  useLayoutEffect(() => {
    const wrap = wrapRef.current;
    const page = pageRef.current;
    if (!wrap) return;

    const update = () => {
      const next = wrap.clientWidth / A4_WIDTH_PX;
      setScale(Number.isFinite(next) && next > 0 ? Math.min(1, next) : 1);
      if (page) {
        setPageHeight(Math.max(A4_HEIGHT_PX, page.scrollHeight));
      }
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(wrap);
    if (page) observer.observe(page);
    return () => observer.disconnect();
  }, [html]);

  return (
    <div ref={wrapRef} className="w-full min-w-0">
      <div className="relative overflow-hidden" style={{ height: pageHeight * scale }}>
        <div
          ref={pageRef}
          className="origin-top-left bg-white shadow-soft"
          style={{
            width: A4_WIDTH_PX,
            minHeight: A4_HEIGHT_PX,
            transform: `scale(${scale})`,
          }}
        >
          <style>{ASSIGNMENT_PAGE_CSS}</style>
          <div className="w-full" dangerouslySetInnerHTML={{ __html: html }} />
        </div>
      </div>
    </div>
  );
}
