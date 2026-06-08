// @ts-nocheck
/**
 * CVisual — Supabase Edge Function : send-email
 * Remplace toute la logique email du backend Python.
 *
 * Appel depuis le frontend admin (service_role key en Authorization) :
 *   POST /functions/v1/send-email
 *   {
 *     "template_key": "broadcast",       ← clé du template dans cvisual_email_templates
 *     "to_email":     "dest@example.com",
 *     "context":      { "full_name": "Jean", "message": "..." },
 *     "subject_override": "Mon sujet perso"  ← optionnel
 *   }
 *
 * Ou pour un email HTML direct sans template :
 *   {
 *     "to_email":   "dest@example.com",
 *     "subject":    "Sujet direct",
 *     "html":       "<p>Contenu HTML</p>"
 *   }
 *
 * Variables d'environnement requises (Supabase Dashboard → Settings → Edge Functions) :
 *   CVISUAL_MAILER_KEY  →  clé API Brevo
 *   SUPABASE_URL        →  auto-injectée par Supabase
 *   SUPABASE_SERVICE_ROLE_KEY  →  auto-injectée par Supabase
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const BREVO_URL = "https://api.brevo.com/v3/smtp/email";
const SENDER   = { name: "CVisual Agency", email: "cvisualht1@gmail.com" };

// ---------- helpers ----------

function replacePlaceholders(text: string, ctx: Record<string, string>): string {
  let out = text;
  for (const [k, v] of Object.entries(ctx)) {
    out = out.replaceAll(`{${k}}`, v ?? "");
  }
  return out;
}

async function callBrevo(
  apiKey: string,
  to: string,
  subject: string,
  html: string,
): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch(BREVO_URL, {
      method: "POST",
      headers: {
        "accept": "application/json",
        "api-key": apiKey,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        sender: SENDER,
        to: [{ email: to }],
        subject,
        htmlContent: html,
      }),
    });

    if (res.status === 201) return { ok: true };

    let errMsg = `Brevo HTTP ${res.status}`;
    try {
      const body = await res.json();
      errMsg += `: ${body.message ?? JSON.stringify(body)}`;
    } catch (_) { /* ignore */ }

    return { ok: false, error: errMsg };
  } catch (e) {
    return { ok: false, error: String(e) };
  }
}

// ---------- handler ----------

Deno.serve(async (req) => {
  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "authorization, content-type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
      },
    });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  const apiKey = Deno.env.get("CVISUAL_MAILER_KEY");
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "CVISUAL_MAILER_KEY non configurée" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }

  let payload: Record<string, unknown>;
  try {
    payload = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "JSON invalide" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json",
  };

  // ── Mode 1 : email HTML direct (pas de template) ──
  if (payload.html && payload.subject && payload.to_email) {
    const result = await callBrevo(
      apiKey,
      payload.to_email as string,
      payload.subject as string,
      payload.html as string,
    );
    return new Response(JSON.stringify(result.ok ? { success: true } : { error: result.error }), {
      status: result.ok ? 200 : 500,
      headers: corsHeaders,
    });
  }

  // ── Mode 2 : template_key + context ──
  const templateKey = payload.template_key as string;
  const toEmail     = payload.to_email as string;
  const context     = (payload.context ?? {}) as Record<string, string>;
  const subjectOverride = payload.subject_override as string | undefined;

  if (!templateKey || !toEmail) {
    return new Response(
      JSON.stringify({ error: "template_key et to_email sont requis" }),
      { status: 400, headers: corsHeaders },
    );
  }

  // Récupérer le template et les settings depuis Supabase
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const [{ data: tpl, error: tplErr }, { data: logoSetting }] = await Promise.all([
    supabase
      .from("cvisual_email_templates")
      .select("subject, body")
      .eq("key", templateKey)
      .single(),
    supabase
      .from("cvisual_settings")
      .select("value")
      .eq("key", "logo_url")
      .single(),
  ]);

  if (tplErr || !tpl) {
    return new Response(
      JSON.stringify({ error: `Template introuvable : '${templateKey}'` }),
      { status: 404, headers: corsHeaders },
    );
  }

  const fullContext: Record<string, string> = {
    logo_url: logoSetting?.value ?? "https://cvisual-backend.onrender.com/api/uploads/logo.jpg",
    ...context,
  };

  const subject = replacePlaceholders(subjectOverride ?? tpl.subject, fullContext);
  const html    = replacePlaceholders(tpl.body, fullContext);

  const result = await callBrevo(apiKey, toEmail, subject, html);

  return new Response(
    JSON.stringify(result.ok ? { success: true } : { success: false, error: result.error }),
    { status: result.ok ? 200 : 500, headers: corsHeaders },
  );
});
