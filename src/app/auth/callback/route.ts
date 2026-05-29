import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const rawNext = searchParams.get("next") ?? "/dashboard";
  const next = rawNext.startsWith("/") && !rawNext.startsWith("//") ? rawNext : "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user?.email) {
        try {
          const admin = createAdminClient();
          const { data: existingProfile } = await admin
            .from("users")
            .select("id")
            .eq("id", user.id)
            .maybeSingle();

          const profile = {
            email: user.email,
            name:
              (user.user_metadata?.full_name as string | undefined) ||
              (user.user_metadata?.name as string | undefined) ||
              user.email.split("@")[0],
            avatar_url: (user.user_metadata?.avatar_url as string | undefined) ?? null,
          };

          if (existingProfile) {
            await admin.from("users").update(profile).eq("id", user.id);
          } else {
            await admin.from("users").insert({
              id: user.id,
              role: "member",
              ...profile,
            });
          }
        } catch (profileError) {
          console.error("Failed to ensure user profile:", profileError);
        }
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/auth/login?error=auth_callback_error`);
}
