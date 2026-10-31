import { z } from "zod";

export function isWaitlistHoneypotEmpty(value: string): boolean {
  return value.length === 0;
}

export const waitlistSchema = z.object({
  product: z.string().trim().min(1).max(100),
  name: z.string().trim().max(100),
  email: z.string().trim().email("Enter a valid email address.").max(255),
});