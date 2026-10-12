export type ExportKind = 'cover' | 'document';
export type ExportFormat = 'pdf' | 'docx' | 'word';

type GuestExportAction = 'reserve' | 'complete' | 'cancel';

async function sendGuestExportAction(
  action: GuestExportAction,
  reservationId: string,
  kind?: ExportKind,
  format?: ExportFormat,
): Promise<{ reservationId?: string }> {
  const response = await fetch('/api/exports/guest', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action,
      reservationId,
      ...(kind ? { kind } : {}),
      ...(format ? { format } : {}),
    }),
  });
  const contentType = response.headers.get('content-type') ?? '';
  if (!contentType.includes('application/json')) {
    throw new Error(
      `The guest export service returned an unexpected response (HTTP ${response.status}). Try again later.`,
    );
  }

  const payload = (await response.json()) as { error?: string; reservationId?: string };
  if (!response.ok) {
    throw new Error(payload.error ?? 'Could not verify your free export.');
  }
  return payload;
}

export async function reserveGuestExport(
  kind: ExportKind,
  format: ExportFormat,
): Promise<string> {
  const reservationId = crypto.randomUUID();
  const result = await sendGuestExportAction('reserve', reservationId, kind, format);
  return result.reservationId ?? reservationId;
}

export async function completeGuestExport(reservationId: string): Promise<void> {
  await sendGuestExportAction('complete', reservationId);
}

export async function cancelGuestExport(reservationId: string): Promise<void> {
  await sendGuestExportAction('cancel', reservationId);
}
