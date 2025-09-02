// Client utility to fetch 100ms auth tokens from Supabase Edge Function

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

function getFunctionsBaseUrl(): string | null {
  if (!supabaseUrl) return null;
  try {
    const host = new URL(supabaseUrl).host; // e.g., xyzcompany.supabase.co
    const functionsHost = host.replace('.supabase.co', '.functions.supabase.co');
    return `https://${functionsHost}`;
  } catch {
    return null;
  }
}

export async function getHMSAuthTokenViaEdge(roomId: string, role: string, userId: string): Promise<string> {
  const base = getFunctionsBaseUrl();
  if (!base) throw new Error('Supabase URL not configured');

  const res = await fetch(`${base}/hms-token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(supabaseAnonKey ? { Authorization: `Bearer ${supabaseAnonKey}` } : {}),
    },
    body: JSON.stringify({ room_id: roomId, role, user_id: userId }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.error || `Edge function failed (${res.status})`);
  }
  if (!data?.token) {
    throw new Error('No token returned from edge function');
  }
  return data.token as string;
}