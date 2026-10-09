// Data loading for the /draft research page. Managers, draft events and the
// buy/drop transaction log are read from Supabase (read-only anon key, same
// pattern as the FDR data in components/dummyArrays/dummy.js). Writes to
// these tables go through the service role only — ask Claude to load new
// draft results in rather than editing this file directly.
import { supabase } from "../../supabaseClient";

export let MANAGERS = [];
export let DRAFT_EVENTS = [];
export let TRANSACTIONS = [];

// Exported so DraftPage can re-run it after a successful Live Draft Mode
// submit, so Current Squads/Draft History reflect it without a full page
// reload — the module-level arrays above are otherwise only fetched once.
export async function loadDraftData() {
  try {
    const [managersRes, eventsRes, transactionsRes] = await Promise.all([
      supabase.from("draft_managers").select("id, name, aliases"),
      supabase.from("draft_events").select("id, type, label, note, budget, sort_order").order("sort_order"),
      supabase
        .from("draft_transactions")
        .select("event_id, manager_id, player_code, player_name, position, price, action")
        .order("id"),
    ]);

    if (managersRes.error) throw managersRes.error;
    if (eventsRes.error) throw eventsRes.error;
    if (transactionsRes.error) throw transactionsRes.error;

    MANAGERS = managersRes.data || [];
    DRAFT_EVENTS = eventsRes.data || [];
    TRANSACTIONS = transactionsRes.data || [];
  } catch (error) {
    console.error("Failed to load draft league data from Supabase:", error);
  }
}

// Exported so DraftPage can wait on it, then re-render once the module-level
// arrays above have been populated (mirrors the fdrReady pattern in dummy.js)
export const draftReady = loadDraftData();

export function computeOwnershipAsOf(eventId = null) {
  const cutoffIndex = eventId
    ? DRAFT_EVENTS.findIndex((e) => e.id === eventId)
    : DRAFT_EVENTS.length - 1;

  const squad = new Map(); // player_code-or-name -> { managerId, playerName, position, price, eventId }

  for (let i = 0; i <= cutoffIndex && i < DRAFT_EVENTS.length; i++) {
    const event = DRAFT_EVENTS[i];
    const eventTransactions = TRANSACTIONS.filter((t) => t.event_id === event.id);
    if (eventTransactions.length === 0) continue; // event hasn't happened yet — leave ownership as-is

    if (event.type === "main") {
      squad.clear();
      eventTransactions
        .filter((t) => t.action === "buy")
        .forEach((t) => {
          squad.set(t.player_code ?? t.player_name, {
            managerId: t.manager_id,
            playerCode: t.player_code,
            playerName: t.player_name,
            position: t.position,
            price: t.price,
            eventId: event.id,
          });
        });
    } else {
      eventTransactions
        .filter((t) => t.action === "drop")
        .forEach((t) => squad.delete(t.player_code ?? t.player_name));
      eventTransactions
        .filter((t) => t.action === "buy")
        .forEach((t) => {
          squad.set(t.player_code ?? t.player_name, {
            managerId: t.manager_id,
            playerCode: t.player_code,
            playerName: t.player_name,
            position: t.position,
            price: t.price,
            eventId: event.id,
          });
        });
    }
  }

  return Array.from(squad.values());
}
