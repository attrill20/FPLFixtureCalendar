// Keep/Drop ranking persistence for the /draft page. One row per manager in
// Supabase's draft_rankings table (drag order + keep/maybe/drop picks) — the
// only table the anon key can write to. localStorage is kept as a per-device
// backup so nothing is lost if Supabase is unreachable.
import { supabase } from "../../supabaseClient";

const LOCAL_ORDER_PREFIX = "draft-ranking-";
const LOCAL_STATUS_PREFIX = "draft-status-";

function readLocal(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeLocal(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // localStorage unavailable — Supabase is still the source of truth
  }
}

export function loadLocalRanking(managerId) {
  const orderKeys = readLocal(LOCAL_ORDER_PREFIX + managerId, null);
  const statuses = readLocal(LOCAL_STATUS_PREFIX + managerId, {});
  return {
    orderKeys: Array.isArray(orderKeys) ? orderKeys : null,
    statuses: statuses && typeof statuses === "object" ? statuses : {},
  };
}

// Resolves to { orderKeys, statuses } or null when the manager has no saved row yet.
// Rejects if Supabase can't be read, so callers can fall back to the local copy.
export async function fetchRanking(managerId) {
  const { data, error } = await supabase
    .from("draft_rankings")
    .select("order_keys, statuses")
    .eq("manager_id", managerId)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return {
    orderKeys: Array.isArray(data.order_keys) ? data.order_keys : null,
    statuses: data.statuses && typeof data.statuses === "object" ? data.statuses : {},
  };
}

// Saves are chained so a slow earlier write can never land after (and clobber) a later one
let saveChain = Promise.resolve();

export function saveRanking(managerId, { orderKeys, statuses }) {
  writeLocal(LOCAL_ORDER_PREFIX + managerId, orderKeys);
  writeLocal(LOCAL_STATUS_PREFIX + managerId, statuses);

  const run = async () => {
    const { error } = await supabase.from("draft_rankings").upsert({
      manager_id: managerId,
      order_keys: orderKeys,
      statuses,
      updated_at: new Date().toISOString(),
    });
    if (error) throw error;
  };
  const result = saveChain.then(run, run);
  saveChain = result.catch(() => {});
  return result;
}
