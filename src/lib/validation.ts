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
