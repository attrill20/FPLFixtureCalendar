// Watchlist persistence for the /draft page's Available Players tab. One
// shared row (id: 'singleton') in Supabase's draft_watchlist table holds the
// list of watched FPL player codes — same anon-writable pattern as
// draft_rankings (rankingStore.js). localStorage is kept as a per-device
// backup so nothing is lost if Supabase is unreachable.
import { supabase } from "../../supabaseClient";

const LOCAL_KEY = "draft-watchlist";
const ROW_ID = "singleton";

function readLocal() {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeLocal(codes) {
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(codes));
  } catch {
    // localStorage unavailable — Supabase is still the source of truth
  }
}

export function loadLocalWatchlist() {
  return readLocal();
}

// Resolves to an array of codes, or null when no row exists in Supabase yet.
// Rejects if Supabase can't be read, so callers can fall back to the local copy.
export async function fetchWatchlist() {
  const { data, error } = await supabase
    .from("draft_watchlist")
    .select("player_codes")
    .eq("id", ROW_ID)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return Array.isArray(data.player_codes) ? data.player_codes : [];
}

// Saves are chained so a slow earlier write can never land after (and clobber) a later one
let saveChain = Promise.resolve();

export function saveWatchlist(codes) {
  writeLocal(codes);

  const run = async () => {
    const { error } = await supabase.from("draft_watchlist").upsert({
      id: ROW_ID,
      player_codes: codes,
      updated_at: new Date().toISOString(),
    });
    if (error) throw error;
  };
  const result = saveChain.then(run, run);
  saveChain = result.catch(() => {});
  return result;
}
