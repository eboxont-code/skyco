import { createServerFn } from "@tanstack/react-start";
import { waitlistSchema } from "./waitlist-schema";

export const joinWaitlist = createServerFn({ method: "POST" })
  .inputValidator(input => waitlistSchema.parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("waitlist_submissions").insert(data);
    if (error) return { ok: false };
    return { ok: true };
  });