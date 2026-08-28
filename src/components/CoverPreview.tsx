'use client';

import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { COVER_PAGE_CSS, buildCoverInnerHtml } from '@/lib/cover/html';
import { A4_HEIGHT_PX, A4_WIDTH_PX, COVER_LOGO_PATH } from '@/lib/cover/types';
import type { CoverFormData, CoverType, GroupMember } from '@/lib/cover/types';

type CoverPreviewProps = {
  type: CoverType;
  formData: CoverFormData;
  groupMembers: GroupMember[];
};

export function CoverPreview({ type, formData, groupMembers }: CoverPreviewProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  const html = useMemo(
    () =>
      buildCoverInnerHtml({
        type,
        formData,
        groupMembers,
        logoSrc: COVER_LOGO_PATH,
      }),
    [type, formData, groupMembers],
  );

  useLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const update = () => {
      const next = el.clientWidth / A4_WIDTH_PX;
      setScale(Number.isFinite(next) && next > 0 ? Math.min(1, next) : 1);
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={wrapRef} className="w-full min-w-0">
      <div className="relative overflow-hidden" style={{ height: A4_HEIGHT_PX * scale }}>
        <div
          className="origin-top-left bg-white shadow-soft"
          style={{
            width: A4_WIDTH_PX,
            height: A4_HEIGHT_PX,
            transform: `scale(${scale})`,
          }}
        >
          <style>{COVER_PAGE_CSS}</style>
          <div
            className="h-full w-full"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </div>
    </div>
  );
}
