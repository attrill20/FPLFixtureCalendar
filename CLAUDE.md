# CLAUDE.md

## Draft League

This is a private side-league among 5 managers, layered on top of standard FPL scoring and rules (no captains, chips, or transfers in the FPL sense — squads only change at the drafts below). Research and historical records for this league live on the `/draft` page (`src/pages/DraftPage`), which is deliberately **not** linked from the navbar — it's for personal research only.

### Squads

- 5 managers, each owns exactly **18 distinct players** — no player can be owned by more than one manager at a time.
- Position split is flexible except for a fixed **2 GK**. The rest (DEF/MID/FWD) is free, but in practice managers tend toward splits like 2/6/6/4, 2/7/6/3, or 2/6/7/3.
- Starting XI/bench each gameweek follows normal valid FPL formation rules, drawn from the 18-player squad.
- No mid-season trading between managers. The only way ownership changes is through the drafts below. Free agents (unowned players, including anyone released or never drafted) can be picked up for £0m at any time between drafts.

### Main Draft (x2 per season — pre-season and around the January window)

- Each manager gets a fake **£250m budget**, reset fresh each time (unspent budget does **not** carry over between drafts).
- **Full reset**: all 90 player slots (5 managers x 18) go back into the pool and every manager rebuilds their entire 18-player squad from scratch.
- Auction format: players are nominated for bidding in **snake/rotation order** among the 5 managers. Bidding is ascending, in **£1m increments**. When bidding stops, the player goes to the highest bidder at that price.
- If a manager runs out of budget, they can still pick up players — for **£0m**.
- A manager can also **open bidding on a player at £0m**; if no one else bids, they win that player for £0m even if they still have budget left.

### Mini Draft (x2 per season — roughly mid-way between the main drafts)

- Each manager **drops 5 players** from their squad and drafts **5 new players** to replace them.
- Fresh **£100m budget** for this round, applying only to the 5 new players — the price paid for the 13 retained players is untouched.
- Same auction mechanics as the main draft: snake/rotation nomination, £1m increment ascending bids, £0m fallback/opening rules apply identically.

### Season shape (approximate)

1. Main Draft 1 — pre-season, before GW1 (full squads built from scratch)
2. Mini Draft 1 — roughly mid-season (~GW10)
3. Main Draft 2 — around the January transfer window (~GW19) (full reset, everyone rebuilds again)
4. Mini Draft 2 — later in the season (~GW29)

Exact gameweeks vary season to season and aren't fixed in advance.

The 5 managers: **James** (me — the draft sheet always refers to me as "Attrill"), **Laurie**, **Sean**, **Nick**, **Evil** (real name Ben, but always called Evil).

### Purpose of the `/draft` page

- Record who owns each player and for how much, updated after every draft, so there's a historical log across seasons.
- Use that ownership history plus live FPL data (form, fixtures, price) to help decide bidding strategy for the next draft — e.g. spotting undervalued players nobody else seems to want, or good picks among the players not currently owned by anyone.
- This page is a personal research tool, not a public feature of the site — keep it out of `Navbar` unless explicitly told otherwise.

### Data storage

Draft league data lives in Supabase (same project as the FDR data), not in local JS files:

- `draft_managers` — the 5 managers (id, name, aliases — other names the draft sheet uses for them, e.g. James is recorded there as "Attrill"; match on aliases as well as name when importing sheet data).
- `draft_events` — the 4 scheduled draft events (main-1, mini-1, main-2, mini-2), ordered by `sort_order`.
- `draft_transactions` — one row per buy/drop at a draft event (`event_id`, `manager_id`, `player_code` [FPL's stable bootstrap-static element code], `player_name`, `position`, `price`, `action`). Current ownership at any point in the season is derived client-side by replaying transactions in event order (`src/pages/DraftPage/draftData.js`'s `computeOwnershipAsOf`): a `main` event wipes every squad and rebuilds from its buys; a `mini` event only applies its own drops/buys on top of what came before.

Like every other table in this project, RLS only allows the anon key to `SELECT` — writes are service-role only (`draft_transactions` itself has no anon write policy, full stop). The app itself is otherwise read-only, and don't edit `draftData.js` by hand (it's just the fetch/derive logic, not a data store). **When James pastes in auction/draft results instead of submitting them from the page, write them into `draft_transactions` directly via the Supabase MCP tools.**

There is one deliberate, narrow exception: the Available Players tab's Live Draft Mode has a real "Submit" button, gated by James's own Supabase Auth login (`attrill20@gmail.com`) — not by a password in client code, which was tried and rejected as a recognized weak pattern. It calls `public.submit_draft_picks(event_id, rows)`, a `SECURITY DEFINER` function granted to the `authenticated` role only (never `anon`), which validates every row (known manager, valid action, non-negative price, real event) before inserting. The table's own RLS stays exactly as above; this function is the only door in from the browser. See the `draft-auction-helper` skill's Step 6 for the full detail — don't add a second in-app write path, and never fall back to a hardcoded passcode if this needs extending.

The client-side write paths on `/draft` (drag order + Keep/Maybe/Drop picks, and the Available Players watchlist) are the **only other** tables whose RLS lets the anon key insert/update (no delete) — James accepted this because `/draft` is an unlinked URL:

- Keep/Drop ranking → Supabase's `draft_rankings` table (one row per manager: `order_keys`, `statuses`) via `src/pages/DraftPage/rankingStore.js`. The saved order must never be changed except by James's own actions (dragging, picking, or the two-click reset) — don't add anything that rewrites it automatically.
- Available Players watchlist → Supabase's `draft_watchlist` table (single shared row, `id: 'singleton'`, holding `player_codes`) via `src/pages/DraftPage/watchlistStore.js`. It's one shared watchlist, not per-manager — deliberately, since only James uses this page.

Both follow the same pattern: `localStorage` is kept as a per-device backup/fallback, and on first load each adopts whatever's in `localStorage` and pushes it up to Supabase if no row exists there yet (so upgrading a device's local-only data to the shared store happens automatically, once).
