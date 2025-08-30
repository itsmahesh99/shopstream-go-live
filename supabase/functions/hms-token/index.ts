// @ts-ignore - Deno runtime, not Node.js
// @deno-types="https://deno.land/x/types/index.d.ts"
// Supabase Edge Function: hms-token
// POST /hms-token { room_id: string, role?: string, user_id?: string }
// This file runs on Deno runtime, not Node.js - TypeScript errors in VS Code are expected

// @ts-ignore - Deno imports
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
// @ts-ignore - Deno imports
import { create, getNumericDate, Header, Payload } from "https://deno.land/x/djwt@v2.8/mod.ts";

// Required env vars set in Supabase project
// @ts-ignore - Deno global
const APP_ACCESS_KEY = Deno.env.get("HMS_APP_ACCESS_KEY");
// @ts-ignore - Deno global
const APP_SECRET = Deno.env.get("HMS_APP_SECRET");

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

serve(async (req) => {
  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  if (!APP_ACCESS_KEY || !APP_SECRET) {
    return json({ error: "Server misconfigured: missing HMS_APP_ACCESS_KEY/HMS_APP_SECRET" }, 500);
  }

  try {
    const { room_id, role = "host", user_id } = await req.json();
    if (!room_id) return json({ error: "room_id is required" }, 400);

    // Minimal validation (UUID-like)
    if (typeof room_id !== "string" || room_id.length < 20) {
      return json({ error: "Invalid room_id. Pass the Room ID (UUID), not room code." }, 400);
    }

    const now = Math.floor(Date.now() / 1000);
    const payload: Payload = {
      access_key: APP_ACCESS_KEY,
      room_id,
      user_id: user_id || crypto.randomUUID(),
      role,
      type: "app",
      version: 2,
      iat: now,
      exp: now + 60 * 60, // 1 hour
      jti: `${room_id}-${now}-${Math.random().toString(36).slice(2)}`,
    } as unknown as Payload;

    const header: Header = { alg: "HS256", typ: "JWT" };

    // @ts-ignore djwt types
    const token = await create(header, payload, APP_SECRET);

    return json({ token });
  } catch (e) {
    console.error("hms-token error:", e);
    return json({ error: "Failed to generate token" }, 500);
  }
});