import type { APIRoute } from 'astro';
import { WaitlistSchema } from '../../store/useWaitlistStore';

export const prerender = false; // Force server-side rendering for this endpoint

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    
    // Server-side validation via Zod schema
    const validation = WaitlistSchema.safeParse(body);
    if (!validation.success) {
      return new Response(
        JSON.stringify({ error: "Validation failed / Fallo de validación", details: validation.error.format() }), 
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { email, name, language, preferredCity } = validation.data;

    // Retrieve the Google Sheets App Script Webhook URL
    // Supports standard Astro env, process.env fallback, or inline check
    const GOOGLE_SHEET_URL = import.meta.env.GOOGLE_SHEETS_WEBHOOK_URL || process.env.GOOGLE_SHEETS_WEBHOOK_URL;
    
    if (!GOOGLE_SHEET_URL) {
      console.error("GOOGLE_SHEETS_WEBHOOK_URL is not configured.");
      return new Response(
        JSON.stringify({ error: "Webhook not configured / Webhook no configurado" }), 
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const GOOGLE_SHEETS_ACCESS_TOKEN = import.meta.env.GOOGLE_SHEETS_ACCESS_TOKEN || process.env.GOOGLE_SHEETS_ACCESS_TOKEN || "CHANGE_ME_SECRET_TOKEN";

    // Call the Google Sheets Script App Webhook
    const response = await fetch(GOOGLE_SHEET_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        name, 
        email, 
        language, 
        preferredCity: preferredCity || 'general',
        timestamp: new Date().toISOString(),
        token: GOOGLE_SHEETS_ACCESS_TOKEN
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to write to Google Sheets');
    }

    const responseData = await response.json();

    return new Response(
      JSON.stringify({ success: true, data: responseData }), 
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error("Error in submit-email API route:", error);
    return new Response(
      JSON.stringify({ error: 'Internal Server Error / Error interno del servidor', message: error.message }), 
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
