import { z } from 'zod';

export const exportMetadataSchema = z.object({
  semester: z.string().trim().max(100).optional(),
  faculty: z.string().trim().max(300).optional(),
  className: z.string().trim().max(100).optional(),
  studentName: z.string().trim().max(300).optional(),
});

export type ExportMetadata = z.infer<typeof exportMetadataSchema>;
