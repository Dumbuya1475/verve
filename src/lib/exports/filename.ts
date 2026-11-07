export function exportFilename(
  requestedName: string | undefined,
  fallbackName: string,
  extension: 'pdf' | 'docx',
): string {
  const rawName = requestedName?.trim() || fallbackName;
  const withoutExtension = rawName.replace(/\.(pdf|docx)$/i, '');
  const safeName = withoutExtension
    .replace(/[\\/:*?"<>|\x00-\x1f]/g, '')
    .replace(/[^\w\s.-]/g, '')
    .trim()
    .replace(/\s+/g, '_')
    .replace(/^\.+$/, '');

  return `${safeName || fallbackName}.${extension}`;
}
