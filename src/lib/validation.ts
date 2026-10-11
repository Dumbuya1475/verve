import { z } from 'zod';

export const sessionBodySchema = z.object({
  idToken: z.string().min(1, 'Missing sign-in token.'),
});

export const feedbackBodySchema = z.object({
  message: z
    .string()
    .trim()
    .min(1, 'Write a short message so we know what to improve.')
    .max(4000, 'Keep feedback under 4,000 characters.'),
  name: z.string().trim().max(120, 'Name is too long.').optional(),
  email: z
    .string()
    .trim()
    .max(254)
    .optional()
    .refine(
      (value) => !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
      'Enter a valid email, or leave it blank.',
    ),
});

export type FeedbackBody = z.infer<typeof feedbackBodySchema>;

const coverFormSchema = z.object({
  university: z.string().max(300),
  faculty: z.string().max(300),
  courseCode: z.string().max(100),
  courseTitle: z.string().max(300),
  assignmentTitle: z.string().max(300),
  issueDate: z.string().max(100),
  dueDate: z.string().max(100),
  lecturer: z.string().max(300),
  className: z.string().max(100),
  semester: z.string().max(100),
  studentName: z.string().max(300),
  studentId: z.string().max(100),
});

const coverExportSchema = z.object({
  type: z.enum(['Individual', 'Group']),
  formData: coverFormSchema,
  groupMembers: z.array(z.object({
    name: z.string().max(300),
    id: z.string().max(100),
  })).max(100),
});

const assignmentExportSchema = z.object({
  title: z.string().max(200),
  introduction: z.string().max(80_000),
  body: z.string().max(80_000),
  conclusion: z.string().max(80_000),
  references: z.string().max(80_000),
  includeCover: z.boolean(),
  updatedAt: z.number().finite().nonnegative(),
  cover: coverExportSchema.optional(),
}).refine((data) => !data.includeCover || Boolean(data.cover), {
  message: 'Include the cover details when exporting an assignment with a cover.',
  path: ['cover'],
});

export const exportRequestSchema = z.discriminatedUnion('kind', [
  z.object({
    kind: z.literal('cover'),
    format: z.enum(['pdf', 'docx']),
    data: coverExportSchema,
  }),
  z.object({
    kind: z.literal('document'),
    format: z.enum(['pdf', 'docx']),
    data: assignmentExportSchema,
  }),
]);

export type ExportRequest = z.infer<typeof exportRequestSchema>;
