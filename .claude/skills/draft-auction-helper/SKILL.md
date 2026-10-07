---
name: draft-auction-helper
description: Help James bid in the 5-manager private FPL draft league's Main/Mini Draft auctions — track live picks as he pastes them, give him a max price he can safely bid on any remaining player, and price up the whole remaining pool. Use when James is prepping for or actively running a draft auction, or asks "what should I pay for X" / "what's my max bid" / "price up what's left".
---

# Draft auction helper

Private side-league context lives in the repo's `CLAUDE.md` (Draft League section) — read it if anything here is unclear. This skill is the live/working layer on top of that: pricing advice and pick-tracking during an actual auction. It never touches the public oraclefpl site or its navbar.

The 5 managers (`draft_managers`): `james` (name "James", alias "Attrill" — the sheet and transactions always call him Attrill), `laurie`, `sean`, `nick`, `ben` (name "Evil", alias "Ben"). Match pasted names against both `name` and `aliases`, case-insensitive.

The live draft sheet (a Google Sheet, new one each season) is **read-only to Claude and must never be written to** — James doesn't have Drive access wired up for this account anyway, so don't attempt it. He'll tell you about mid-sheet terms himself if relevant (e.g. the Mini Draft is informally called something else in his sheet — keep that out of any site-facing code or copy; "Mini Draft" is the only term that belongs in this repo).

## Step 1 — Establish which event this is

Query `draft_events` for the authoritative current list (ids, budgets, sort_order) rather than assuming — new events get added each season. As of writing:

| id | type | label | budget | notes |
|---|---|---|---|---|
| main-1 | main | Main Draft 1 | £250m | pre-season, full reset |
| mini-preseason | mini | Mini Draft (Pre-season) | n/a | informal 1-for-1 swaps, **no bidding** — not a real auction, ignore for pricing |
| mini-1 | mini | Mini Draft 1 | £100m | normal auction mechanics |
| main-2 | main | Main Draft 2 | £250m | January window, full reset |
| mini-2 | mini | Mini Draft 2 | £100m | normal auction mechanics |

Ask James which event this is if it's not obvious from context.

A **Main Draft** wipes all 90 slots (5 × 18) and rebuilds from scratch — the remaining pool is every FPL player. A **Mini Draft** only touches 25 slots (5 managers × 5 each): the pool is free agents (never owned, or released) plus whatever each manager is dropping this round. James has confirmed drops are locked before bidding starts for a real Mini Draft, so get the full drop list (his own 5 from `draft_rankings` `statuses` where status is `drop` for `manager_id = 'james'`, plus the other 4 managers' drops from James directly — that part isn't tracked anywhere in Supabase) before pricing anything.

## Step 2 — Pull current state

- **Ownership baseline**: replay `draft_transactions` in `draft_events.sort_order` order up to (not including) this event — same logic as `computeOwnershipAsOf` in `src/pages/DraftPage/draftData.js`. This gives every manager's current 18-player squad, what they paid, and position (`position` is the FPL `element_type` integer: 1 GK, 2 DEF, 3 MID, 4 FWD).
- **Live FPL data**: fetch `https://fpl-server-nine.vercel.app/api?endpoint=bootstrap-static` (same proxy `DraftPage.js` uses) for `elements` — `web_name`, `now_cost` (÷10 for £m), `total_points`, `form`, `minutes`, `goals_scored`, `assists`, `bonus`, `element_type`, `status`/`news` (injuries/suspensions — don't recommend a big bid on someone currently out without flagging it), `team`/`team_code`. Fetch `endpoint=fixtures` too for upcoming fixtures per team.
- **FDR**: query Supabase `teams` (`code, home_difficulty, away_difficulty, home_attack_rating, away_attack_rating, home_defense_rating, away_defense_rating`) — same source `src/components/dummyArrays/dummy.js` uses. Match to players via the team's permanent `code` (not FPL's reassignable `id`). Average the applicable `h_diff`/`a_diff` over a player's next handful of fixtures as a fixture-ease signal.
- **James's own context**: `draft_rankings` (Keep/Maybe/Drop + drag order, `manager_id = 'james'`) and `draft_watchlist` (shared singleton row) — read-only context on what he's already planning and eyeing. Never write to either from this skill.

## Step 3 — Track live picks as James pastes them

**The Available Players tab on `/draft` already does this itself** via its "Live Draft Mode" toggle (`src/pages/DraftPage/DraftPage.js`) — James can paste picks straight into a textarea there and the Live £ column recomputes (Pre £ stays fixed for comparison), no chat needed. That panel is page-local state only (never written to Supabase) and uses the same parsing rules described below (`parseLivePicksText`/`matchPlayer`/`matchManager` in `DraftPage.js`).

In chat, he may still paste snippets directly to you instead (e.g. while away from the page), one or many lines, tab- or space-separated, in whatever order they happened:

```
Haaland    162    Attrill
Saka    57    Evil
```

or just a single line. Parse each as `PlayerName, Price, Manager`:

- **Manager**: match against `draft_managers.name` or `aliases` (e.g. "Attrill" → james, "Evil"/"Ben" → ben).
- **Player**: match against bootstrap-static `elements.web_name` first, case- and diacritic-insensitive (`ß`→`ss`, accents stripped — "Gross" matches "Groß", same `normalizeName` as `DraftPage.js`'s Live Draft Mode parser). If that fails, try `second_name`, or a normalized "first-initial + second_name" match for shorthand like `B.Fernandes` or `Bruno G.` (strip periods, compare initials). If more than one plausible match, **ask James which one** rather than guessing — this becomes the permanent historical record later.
- Treat these as `buy` actions for this event.

Keep a running ledger for the rest of the conversation: each manager's spend and slots filled so far this event, and which players are now out of the pool. This ledger is conversation-only — nothing is written to Supabase until Step 5.

## Step 4 — James's personal max-bid ceiling

```
remaining_budget = event_budget − (James's spend so far this event)
remaining_slots  = event_total_slots − (James's buys so far this event)
                    (event_total_slots = 18 for a Main Draft, 5 for a Mini Draft)
```

Default assumption: **every other remaining slot can be filled at £0** — decent free agents are usually there — so `max_bid(target) = remaining_budget`. Don't invent an artificial reserve on top of this by default; he can always walk away from a nomination that gets too rich.

**Exception — flag it, don't silently cap it.** Before confirming a bid that would spend most/all of the remaining budget, check whether James still needs a position with genuinely thin depth left — above all his **2nd GK**, since only 10 GK slots exist in the entire league and a bad run can leave none worth having. Count remaining viable options at that position against how many managers (including James) still need one. If it's tight, say so explicitly and let him decide; otherwise don't bring it up.

## Step 5 — Pricing the remaining pool

**Both numbers use the same method; they just use different inputs.** An earlier version of this showed two different *methodologies* side by side ("independent fair value" vs "market price") — James correctly called this out: that's confusing, since pre-draft there's nothing to make two different predictions diverge. The fix wasn't to drop to one number — he wants to compare **before vs during** the draft — it's that both columns should be the one **value-above-replacement, zero-sum** method, just evaluated at two different moments:

- **Pre £** — a fixed baseline: every currently-unowned player, full £500m (Mini Draft) / £1250m (Main Draft) budget, full slot count. Computed once, doesn't move.
- **Live £** — the identical method re-run against whatever's actually left: sold players removed from the pool, their prices subtracted from the budget anchor, filled slots removed from the replacement-rank denominator. Equal to Pre £ until picks start happening, then diverges as the draft actually unfolds. On the page this is Live Draft Mode (`DraftPage.js`'s `computeEstimates`, called twice — once static, once live); in chat it's your running ledger from Step 3.

The method itself: scale so the *whole pool in scope* sums to the relevant total budget — **but no single player can ever be worth more than one manager's whole budget** (`MINI_DRAFT_MANAGER_BUDGET`, £100m), however the proportional split comes out. Capping a player pushes their excess back into the pool for everyone else (iteratively, since capping one can push another over too) rather than just vanishing, so the pool still sums to the total.

Don't just split that total proportionally to raw stat-score across every player — a flat split wildly underprices stars, because most late-draft players really do go for ~£0. Instead, for each position, treat the player ranked around where supply runs out (roughly: how many of that position are still needed across all remaining slots) as the replacement/£0 baseline, score everyone relative to that baseline, then distribute the budget proportionally to that surplus value. This naturally keeps bench fodder near £0 and concentrates real money on genuine difference-makers. GK is the one position where the replacement baseline is structurally shallow (10 league-wide slots, fixed) — so with a weak available GK pool, don't be surprised if the exact player sitting right at the replacement rank (zero by construction) and the one just above it (small positive share) are separated by a tiny, almost arbitrary-feeling stat difference. Say so plainly if asked — it's an artifact of a shallow pool, not a confident read on those specific players.

The per-player score (`DraftPage.js`'s `computeEstimates`) blends season `total_points` + annualized `form` with several multipliers, each a mild nudge (roughly 0.75-1.25x) rather than a dominant factor:

- **Fixture ease** (Step 2's FDR) and **availability** (injured/suspended marked down, not valued at face value).
- **Team strength** — attack rating for MID/FWD, defense rating for DEF/GK (their own team's quality, separate from upcoming-opponent fixture ease).
- **Reliability** — minutes played so far (volume) and `starts_per_90` (rate: a nailed-on starter vs someone racking up good per-90 numbers mostly as a substitute).
- **Age** — a peak window (22-32 outfield, 25-35 GK) with no discount; tapered discounts outside it both ways (younger = inconsistent, older = rotation/injury/decline risk).
- **Luck regression** — actual output vs underlying process: xG+xA for every outfield position (DEF included — a defender's goals/assists are just as "lucky or deserved" as an attacker's), and separately goals conceded vs xGC for GK/DEF (clean-sheet luck). Overperforming the process pulls the score back down (it's running hotter than the chances justify), underperforming lifts it. This is the one that should temper a small-sample hot streak that "can't possibly last" — check it before assuming a spike needs a manual story. The Available Players table also shows raw xG/xA columns directly so this is visible, not just baked into the price silently.
- **Set-piece duty** — a small flat boost for penalty/free-kick/corner takers, since that's a repeatable source of returns independent of current form.

If a player's number still looks too high after all of this, check whether they're simply the best *available* player in a thin pool for their position (common — the good ones are usually already drafted) before assuming the model is wrong.

When James asks about one player, give: Pre £, Live £ (if the draft's underway), his own max-bid ceiling from Step 4, and a one-line recommendation (e.g. "was £12m pre-draft, now trending to £15m live given how thin FWD options are, your ceiling's £45m so you can win this comfortably"). When he asks to "price up what's left", produce a sorted table across the whole remaining pool with both columns.

## Step 6 — Writing confirmed results to Supabase

Once James confirms an event's results are final (not just a running snippet — he'll say something like "that's the draft done" or ask you to save it), write to `draft_transactions` via `mcp__supabase__execute_sql` (plain `INSERT`, not `apply_migration` — that's for schema changes only). Columns: `event_id`, `manager_id`, `player_code` (bootstrap-static `elements.code`, not `id`), `player_name`, `position` (the `element_type` integer), `price`, `action` (`buy` or `drop`).

**Always show James the parsed rows and get an explicit go-ahead before running the insert** — this is the permanent historical log that `computeOwnershipAsOf` replays forever after, so a wrong price or event_id is annoying to unpick later. For a Mini Draft, write each manager's `drop` rows alongside their `buy` rows so the replay logic in `draftData.js` works correctly.

## Don'ts

- Never write to the Google Sheet, and don't build any Google Sheets integration for this — it's read-only via James relaying picks, by design.
- Never propose an in-app write path (a textarea on `/draft`, etc.) for `draft_transactions` — all writes happen here, through you, via the Supabase MCP tools, after explicit confirmation. This mirrors the existing CLAUDE.md rule and is deliberate (RLS only allows anon-key writes to `draft_rankings`/`draft_watchlist`).
- Don't write to `draft_rankings` or `draft_watchlist` from this skill — read them for context only; they're James's own drag-order/Keep-Drop/watchlist picks and must only change from his own actions on the page.
- Keep any sheet-specific nicknames for the Mini Draft out of site code, UI copy, and commit messages — "Mini Draft" is the only term that belongs in this repo.
