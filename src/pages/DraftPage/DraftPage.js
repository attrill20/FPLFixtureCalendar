import React, { useEffect, useMemo, useState } from "react";
import "./DraftPage.css";
import { supabase } from "../../supabaseClient";
import { MANAGERS, DRAFT_EVENTS, TRANSACTIONS, computeOwnershipAsOf, draftReady, loadDraftData } from "./draftData";
import { fetchRanking, loadLocalRanking, saveRanking } from "./rankingStore";
import { fetchWatchlist, loadLocalWatchlist, saveWatchlist } from "./watchlistStore";

const POSITION_NAMES = { 1: "GK", 2: "DEF", 3: "MID", 4: "FWD" };
const KEEP_STATUSES = [
  { id: "keep", label: "Keep" },
  { id: "maybe", label: "Maybe" },
  { id: "drop", label: "Drop" },
];

// Available Players columns: how each sorts, and which way a first click goes
// groupStart adds space before the column: minutes | attacking | defensive | bonus | form + points
const AVAILABLE_COLUMNS = [
  { key: "web_name", label: "Player", value: (p) => p.web_name || "", firstDir: "asc" },
  { key: "team", label: "Team", value: (p) => p.teamName || "", firstDir: "asc" },
  { key: "element_type", label: "Pos", value: (p) => p.element_type, firstDir: "asc" },
  { key: "now_cost", label: "Price", value: (p) => p.now_cost || 0 },
  {
    key: "minutes",
    label: "Min",
    title: "Minutes played",
    value: (p) => p.minutes || 0,
    num: true,
    groupStart: true,
  },
  {
    key: "goals_scored",
    label: "G",
    title: "Goals scored",
    value: (p) => p.goals_scored || 0,
    num: true,
    groupStart: true,
  },
  { key: "assists", label: "A", title: "Assists", value: (p) => p.assists || 0, num: true },
  {
    key: "xg",
    label: "xG",
    title: "Expected goals",
    value: (p) => parseFloat(p.expected_goals) || 0,
    num: true,
  },
  {
    key: "xa",
    label: "xA",
    title: "Expected assists",
    value: (p) => parseFloat(p.expected_assists) || 0,
    num: true,
  },
  {
    key: "clean_sheets",
    label: "CS",
    title: "Clean sheets",
    value: (p) => p.clean_sheets || 0,
    num: true,
    groupStart: true,
  },
  {
    key: "defcon_bonuses",
    label: "DC",
    title: "Times earned the defensive contribution bonus",
    value: (p) => p.defconBonuses || 0,
    num: true,
  },
  {
    key: "bonus",
    label: "BP",
    title: "Bonus points",
    value: (p) => p.bonus || 0,
    num: true,
    groupStart: true,
  },
  {
    key: "form",
    label: "Form",
    value: (p) => parseFloat(p.form || 0),
    num: true,
    groupStart: true,
  },
  { key: "total_points", label: "Pts", value: (p) => p.total_points || 0, num: true },
  {
    key: "pre_price",
    label: "Pre £",
    title:
      "Predicted Mini Draft 1 auction price before any picks: value-above-replacement, scaled across every unowned player and the full £500m budget. Fixed, so you can compare it against Live £ as the draft happens.",
    value: (p) => p.prePrice || 0,
    num: true,
    groupStart: true,
  },
  {
    key: "live_price",
    label: "Live £",
    title:
      "Same method as Pre £, but re-run against whatever's actually left in Live Draft Mode — pool and budget shrink as picks come in, so this tracks the draft as it unfolds. Equal to Pre £ until you start entering picks.",
    value: (p) => p.livePrice || 0,
    num: true,
  },
];

// Current Squads table columns: click a header to sort every manager's card by it
const SQUAD_COLUMNS = [
  { key: "playerName", label: "Player", value: (p) => p.playerName || "", firstDir: "asc" },
  { key: "position", label: "Pos", value: (p) => p.position || 99, firstDir: "asc" },
  { key: "price", label: "Price", value: (p) => p.price || 0, num: true },
  { key: "points", label: "Pts", value: (p) => p.points || 0, num: true },
];

const PositionChip = ({ position }) =>
  POSITION_NAMES[position] ? (
    <span className={`draft-pos-chip pos-${position}`}>{POSITION_NAMES[position]}</span>
  ) : (
    <span className="draft-pos-unknown">—</span>
  );

// FPL element status: "i" injured, "d" doubtful, "s" suspended, "u"/"n" unavailable.
// Unavailable players whose news says they've moved on (transfer/loan) get a "left" icon.
const AVAILABILITY_ICONS = {
  suspended: { label: "Suspended", glyph: null },
  injured: { label: "Injured", glyph: "+" },
  doubtful: { label: "Doubtful", glyph: "+" },
  left: { label: "Left the club", glyph: "↗" },
  unavailable: { label: "Unavailable", glyph: "!" },
};

function getAvailabilityType(status, news) {
  if (status === "s") return "suspended";
  if (status === "i") return "injured";
  if (status === "d") return "doubtful";
  if (status === "u" || status === "n") {
    return /joined|loan|left the club|departed|returned to|transferred/i.test(news || "")
      ? "left"
      : "unavailable";
  }
  return null;
}

const AvailabilityIcon = ({ status, news }) => {
  const type = getAvailabilityType(status, news);
  if (!type) return null;

  const { label, glyph } = AVAILABILITY_ICONS[type];
  const text = news || label;

  return (
    <span className={`draft-availability ${type}`} tabIndex={0} aria-label={text}>
      {glyph ?? <span className="draft-red-card" />}
      <span className="draft-availability-tip">{text}</span>
    </span>
  );
};

const AVAILABLE_PAGE_SIZE = 100;
const FPL_PROXY = "https://fpl-server-nine.vercel.app/api?endpoint=";

// bootstrap-static only has season-total defensive contributions, so count how many times each
// player actually earned the DefCon bonus from every played gameweek's live data (per fixture)
async function fetchDefconBonusCounts(eventIds) {
  const counts = new Map();
  const responses = await Promise.all(
    eventIds.map((id) =>
      fetch(`${FPL_PROXY}event/${id}/live`)
        .then((r) => (r.ok ? r.json() : null))
        .catch(() => null)
    )
  );
  responses.forEach((data) => {
    (data?.elements || []).forEach((el) => {
      (el.explain || []).forEach((fixture) => {
        const earned = (fixture.stats || []).some(
          (st) => st.identifier === "defensive_contribution" && st.points > 0
        );
        if (earned) counts.set(el.id, (counts.get(el.id) || 0) + 1);
      });
    });
  });
  return counts;
}

// --- Available-player pricing (draft-auction-helper skill) ---------------
// Two predicted prices per available player, both value-above-replacement,
// scaled so the whole pool sums to the selected draft's total budget (5
// managers x the selected type's per-manager budget): "Pre £" is a fixed
// baseline across the relevant pool; "Live £" re-runs the same method
// against whatever Live Draft Mode says is actually left, so the two can be
// compared as the draft actually unfolds instead of just trusting a static
// pre-draft guess.
// Mini Draft only pools free agents + explicit drops (5 slots/£100m each);
// Main Draft wipes every squad and rebuilds from the whole player universe
// (18 slots/£250m each) — see DraftPage's draftType selector.
const DRAFT_TYPES = {
  mini: { id: "mini", label: "Mini Draft (£100m / 5 slots)", managerBudget: 100, slotsPerManager: 5 },
  main: { id: "main", label: "Main Draft (£250m / 18 slots)", managerBudget: 250, slotsPerManager: 18 },
};
// Rough share of a squad's 18 slots by position (CLAUDE.md's typical splits:
// 2 GK, 6-7 DEF, 6-7 MID, 3-4 FWD), used only to pick each position's
// replacement-level cutoff among the available pool.
const POSITION_SHARE_OF_SLOTS = { 1: 0.11, 2: 0.36, 3: 0.36, 4: 0.17 };

function availabilityMultiplier(status, news) {
  switch (getAvailabilityType(status, news)) {
    case "left":
      return 0.05;
    case "injured":
      return 0.6;
    case "unavailable":
      return 0.7;
    case "doubtful":
      return 0.9;
    case "suspended":
      return 0.85;
    default:
      return 1;
  }
}

function fixtureMultiplier(avgDifficulty) {
  if (avgDifficulty == null) return 1;
  return Math.min(1.15, Math.max(0.85, 1 + (5 - avgDifficulty) * 0.03));
}

// Team quality, independent of next-5-fixture ease above: MID/FWD lean on
// attack rating (goal/assist environment), DEF/GK on defense rating (clean
// sheet environment) — same h_/a_ FDR ratings as fixtureMultiplier, just the
// player's own team's rating rather than their upcoming opponents'.
function teamStrengthMultiplier(el, teamByTeamId) {
  const team = teamByTeamId.get(el.team);
  if (!team) return 1;
  const attack = ((team.h_att ?? 5) + (team.a_att ?? 5)) / 2;
  const defense = ((team.h_def ?? 5) + (team.a_def ?? 5)) / 2;
  const relevant = el.element_type >= 3 ? attack : defense;
  return Math.min(1.25, Math.max(0.8, 1 + (relevant - 5) * 0.035));
}

// Current hot form from an older player is less likely to hold for a full
// season — rotation, injury risk and decline all climb with age. GKs get a
// higher threshold since they typically age more gracefully than outfielders.
function ageMultiplier(birthDate, elementType) {
  if (!birthDate) return 1;
  const parsed = new Date(birthDate);
  if (Number.isNaN(parsed.getTime())) return 1;
  const ageYears = (Date.now() - parsed.getTime()) / (365.25 * 24 * 60 * 60 * 1000);

  // Peak age window, full value, no discount either side of it. GKs get a
  // later window — they mature and decline later than outfield players.
  const isGK = elementType === 1;
  const peakStart = isGK ? 25 : 22;
  const peakEnd = isGK ? 35 : 32;

  if (ageYears < peakStart) {
    // Younger than peak: likely to be inconsistent, not yet the finished article
    return Math.max(0.85, 1 - (peakStart - ageYears) * 0.025);
  }
  if (ageYears > peakEnd) {
    // Older than peak: rotation/injury/decline risk climbs with age
    return Math.max(0.85, 1 - (ageYears - peakEnd) * 0.02);
  }
  return 1;
}

// Regresses actual output toward underlying process (xG/xA for MID/FWD,
// goals conceded vs xGC for GK/DEF) — overperforming the process pulls the
// score back down (it's running hotter than the chances/process justify),
// underperforming lifts it (positive regression is likely). Needs a minimum
// amount of underlying data before it'll touch anything.
// Attacking returns (goals+assists) vs xG+xA — applies to every outfield
// position (DEF included: a defender's goals/assists are just as "lucky or
// deserved" as an attacker's).
function attackingLuckMultiplier(el) {
  const expected = parseFloat(el.expected_goal_involvements) || 0;
  if (expected < 0.5) return 1;
  const actual = (el.goals_scored || 0) + (el.assists || 0);
  const ratio = actual / expected;
  return Math.min(1.25, Math.max(0.75, 1 - (ratio - 1) * 0.5));
}

// Goals conceded vs xGC — clean-sheet luck, GK/DEF only.
function defensiveLuckMultiplier(el) {
  const xGC = parseFloat(el.expected_goals_conceded) || 0;
  if (xGC < 1) return 1;
  const ratio = (el.goals_conceded || 0) / xGC;
  return Math.min(1.25, Math.max(0.75, 1 + (ratio - 1) * 0.5));
}

function luckRegressionMultiplier(el) {
  if (el.element_type === 3 || el.element_type === 4) return attackingLuckMultiplier(el);
  if (el.element_type === 2) return attackingLuckMultiplier(el) * defensiveLuckMultiplier(el);
  if (el.element_type === 1) return defensiveLuckMultiplier(el);
  return 1;
}

// Penalties/free-kicks/corners are a repeatable source of returns
// independent of current form — a small, flat reliability nudge.
function setPieceMultiplier(el) {
  const onSetPieces =
    el.penalties_order === 1 || el.direct_freekicks_order === 1 || el.corners_and_indirect_freekicks_order === 1;
  return onSetPieces ? 1.05 : 1;
}

// Separate from the minutes-volume reliabilityMultiplier above: this checks
// the RATE at which played minutes come from actual starts (starts_per_90
// near 1) vs frequent substitute cameos, which can hide rotation risk behind
// an otherwise-decent total-minutes figure.
function startsConsistencyMultiplier(el) {
  const startsPer90 = parseFloat(el.starts_per_90);
  if (!Number.isFinite(startsPer90) || !el.minutes) return 1;
  return Math.min(1.05, Math.max(0.85, 0.85 + startsPer90 * 0.2));
}

// Rewards nailed-on starters relative to rotation risks who happen to have a
// similar scoring rate — a mild multiplier, not a replacement for actually
// scoring points (hence the narrow 0.85-1.0 range).
function reliabilityMultiplier(minutes, maxMinutes) {
  if (!maxMinutes) return 1;
  const share = Math.min(1, (minutes || 0) / maxMinutes);
  return 0.85 + 0.15 * share;
}

// Builds element_code -> recency-weighted prior-seasons score from cached
// element-summary `history_past` rows (api_cache, 2023/24-2025/26 so far).
// Each season's total_points is scaled down if it came from a short/cameo
// season (minutes < 2500), so one great-but-brief season isn't overweighted.
function computePriorScoreByCode(historyPastRows) {
  const byCode = new Map();
  historyPastRows.forEach((entries) => {
    (entries || []).forEach((h) => {
      if (!h?.element_code) return;
      if (!byCode.has(h.element_code)) byCode.set(h.element_code, []);
      byCode.get(h.element_code).push(h);
    });
  });

  const result = new Map();
  byCode.forEach((entries, code) => {
    const sorted = [...entries].sort((a, b) => (a.season_name < b.season_name ? 1 : -1));
    let weightSum = 0;
    let valueSum = 0;
    sorted.slice(0, 3).forEach((h, i) => {
      // A season's trust is recency x how much of it we actually saw — an
      // injury-hit cameo season shouldn't outweigh two full healthy ones
      // just for being the most recent; it should count for less of both.
      const recencyWeight = 0.5 ** i;
      const minutesConfidence = Math.min(1, (h.minutes || 0) / 2500);
      const weight = recencyWeight * minutesConfidence;
      valueSum += (h.total_points || 0) * weight;
      weightSum += weight;
    });
    if (weightSum > 0) result.set(code, valueSum / weightSum);
  });
  return result;
}

// Blends this season's (multiplier-adjusted) score with a prior-seasons
// score. No history at all -> untouched (a new signing could be anything).
// A strong history lifts an underperforming-so-far player (proven quality
// not yet shown in a tiny sample); a weak history only gently drags someone
// down, since a breakout can be real improvement, not just noise. Both
// effects fade out as this season's own sample grows.
function blendWithHistory(currentScore, priorScore, minutesThisSeason) {
  if (!priorScore) return currentScore;
  const gamesPlayed = (minutesThisSeason || 0) / 90;
  const fade = Math.min(1, gamesPlayed / 10); // fully current-season by ~10 games
  const upWeight = 0.4 * (1 - fade);
  const downWeight = 0.15 * (1 - fade);
  return priorScore > currentScore
    ? currentScore + (priorScore - currentScore) * upWeight
    : currentScore - (currentScore - priorScore) * downWeight;
}

function playerStatScore(el) {
  const form = parseFloat(el.form) || 0;
  // Blend season-long proof (total_points) with current trajectory (form,
  // annualized over ~38 GWs) so a hot streak or a cold patch both register.
  return 0.5 * (el.total_points || 0) + 0.5 * (form * 38);
}

// --- Live Draft Mode parsing -----------------------------------------
// Pasted lines look like "Haaland  162  Attrill" (tab- or space-separated,
// manager name or alias last, price second-last, player name is everything
// before that). This is local page state only — never written to Supabase;
// the permanent record is still written by Claude via the Supabase MCP
// tools once James confirms the event's results are final.
// Soft match: fold case, strip diacritics, and expand ß -> ss so a plain
// ASCII guess (e.g. "Gross") matches a name like "Groß".
function normalizeName(str) {
  return (str || "")
    .toLowerCase()
    .replace(/ß/g, "ss")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

// Returns { match, candidates }: match is the element when exactly one
// resolves, otherwise null — candidates is whatever list produced that (so
// callers can tell "no match at all" apart from "ambiguous, here's who" and
// suggest the first-initial shorthand to disambiguate, e.g. two players both
// called "Thomas" need "B Thomas" / "S Thomas" to tell them apart).
function matchPlayer(name, elements) {
  const q = normalizeName(name.trim());
  let matches = elements.filter((el) => normalizeName(el.web_name) === q);
  if (!matches.length) matches = elements.filter((el) => normalizeName(el.second_name) === q);
  if (!matches.length) {
    // Shorthand like "B.Fernandes" or "Bruno G." — first-initial + surname
    const parts = q.replace(/\./g, "").split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      const initial = parts[0][0];
      const surname = parts.slice(1).join(" ");
      matches = elements.filter(
        (el) =>
          // Exact surname, not startsWith — "thomas" must not also match
          // "Thomas-Asante" just because it's a prefix of a longer surname.
          normalizeName(el.second_name) === surname &&
          normalizeName(el.first_name).startsWith(initial)
      );
    }
  }
  return { match: matches.length === 1 ? matches[0] : null, candidates: matches };
}

function makeEmptySlots(count) {
  return Array.from({ length: count }, () => ({ player: "", price: "" }));
}

function getManagerSlotsFrom(liveSlotsByManager, managerId, slotsPerManager) {
  const slots = liveSlotsByManager[managerId];
  return Array.isArray(slots) && slots.length === slotsPerManager ? slots : makeEmptySlots(slotsPerManager);
}

// A manager's slots are two discrete fields each (player, price), not a
// free-typed line — no manager column needed either way, that's implicit from
// whose slots these are. Returns null for a genuinely empty/untouched slot.
// Carries `position` (FPL element_type) along too, needed when submitting.
function parseLiveSlot(slot, elements) {
  const playerText = (slot.player || "").trim();
  const priceText = (slot.price || "").trim();
  if (!playerText && !priceText) return null;
  if (!playerText) return { error: "Missing player name" };
  const price = Number(priceText);
  if (priceText === "" || !Number.isFinite(price)) {
    return { error: `Not a price: "${priceText || "blank"}"` };
  }
  const { match: player, candidates } = matchPlayer(playerText, elements);
  if (!player) {
    if (candidates.length > 1) {
      const names = candidates.slice(0, 4).map((c) => `${c.first_name} ${c.second_name}`);
      const example = candidates[0];
      return {
        error:
          `"${playerText}" matches ${candidates.length}: ${names.join(", ")}` +
          `${candidates.length > 4 ? ", …" : ""} — try "${example.first_name[0]} ${example.second_name}"`,
      };
    }
    return { error: `No single player match: "${playerText}"` };
  }
  return {
    playerCode: player.code,
    playerName: player.web_name,
    position: player.element_type,
    price,
  };
}

// Value-above-replacement price estimate for a pool of unowned/unsold players,
// scaled so it sums to `budget` across `slots` remaining slots — see
// .claude/skills/draft-auction-helper/SKILL.md (Step 5). Pure/stateless so it
// can be run twice: once as a fixed pre-draft baseline, once live against
// whatever Live Draft Mode has removed from the pool and the budget so far.
function computeEstimates(
  unowned,
  avgDifficultyByTeamId,
  teamByTeamId,
  maxMinutes,
  priorScoreByCode,
  budget,
  slots,
  managerBudget
) {
  const result = new Map();

  const scored = unowned.map((el) => {
    const currentScore =
      playerStatScore(el) *
      fixtureMultiplier(avgDifficultyByTeamId.get(el.team)) *
      availabilityMultiplier(el.status, el.news) *
      teamStrengthMultiplier(el, teamByTeamId) *
      reliabilityMultiplier(el.minutes, maxMinutes) *
      ageMultiplier(el.birth_date, el.element_type) *
      luckRegressionMultiplier(el) *
      setPieceMultiplier(el) *
      startsConsistencyMultiplier(el);
    return {
      el,
      score: blendWithHistory(currentScore, priorScoreByCode.get(el.code) || 0, el.minutes),
    };
  });

  const byPosition = new Map();
  scored.forEach((row) => {
    const pos = row.el.element_type;
    if (!byPosition.has(pos)) byPosition.set(pos, []);
    byPosition.get(pos).push(row);
  });

  const replacementScoreByPosition = new Map();
  byPosition.forEach((rows, pos) => {
    const sorted = [...rows].sort((a, b) => b.score - a.score);
    const share = POSITION_SHARE_OF_SLOTS[pos] || 0.25;
    const replacementRank = Math.max(1, Math.round(slots * share));
    const idx = Math.min(replacementRank, sorted.length) - 1;
    replacementScoreByPosition.set(pos, sorted[idx]?.score || 0);
  });

  const withVAR = scored.map((row) => {
    const replacement = replacementScoreByPosition.get(row.el.element_type) || 0;
    return { ...row, valueAboveReplacement: Math.max(0, row.score - replacement) };
  });

  // Split `budget` proportionally to VAR, but no single player can ever be
  // worth more than one manager's whole budget — cap at `managerBudget` and
  // push the excess back into the pool for everyone else, so the total still
  // sums to `budget` instead of just vanishing at the cap. Iterative because
  // capping one player can push another over the cap too.
  let pool = budget;
  let remaining = withVAR.filter((row) => row.valueAboveReplacement > 0);
  withVAR
    .filter((row) => row.valueAboveReplacement <= 0)
    .forEach((row) => result.set(row.el.code, 0));

  let capped = true;
  while (capped && remaining.length) {
    capped = false;
    const totalValue = remaining.reduce((sum, row) => sum + row.valueAboveReplacement, 0);
    if (totalValue <= 0) break;
    const next = [];
    for (let i = 0; i < remaining.length; i++) {
      const row = remaining[i];
      const share = (row.valueAboveReplacement / totalValue) * pool;
      if (share > managerBudget) {
        result.set(row.el.code, managerBudget);
        pool -= managerBudget;
        capped = true;
      } else {
        next.push(row);
      }
    }
    remaining = next;
  }
  const totalValue = remaining.reduce((sum, row) => sum + row.valueAboveReplacement, 0);
  remaining.forEach((row) => {
    result.set(row.el.code, totalValue > 0 ? Math.round((row.valueAboveReplacement / totalValue) * pool) : 0);
  });

  return result;
}

const DraftPage = ({ mainData, teams: fdrTeams = [], fixturesData = [] }) => {
  const [activeTab, setActiveTab] = useState("squads");
  const [positionFilter, setPositionFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortKey, setSortKey] = useState("total_points");
  const [sortDir, setSortDir] = useState("desc");
  const [squadSortKey, setSquadSortKey] = useState("points");
  const [squadSortDir, setSquadSortDir] = useState("desc");
  const [includeDrafted, setIncludeDrafted] = useState(false);
  const [availableView, setAvailableView] = useState("all");
  const [watchlist, setWatchlist] = useState(loadLocalWatchlist);
  const [watchlistSaveState, setWatchlistSaveState] = useState("idle");
  const [availablePage, setAvailablePage] = useState(0);
  const [defconBonusCounts, setDefconBonusCounts] = useState(null);
  const [dataVersion, setDataVersion] = useState(0);
  const [rankManagerId, setRankManagerId] = useState("james");
  const [orderedKeys, setOrderedKeys] = useState([]);
  const [dragIndex, setDragIndex] = useState(null);
  const [statuses, setStatuses] = useState({});
  // The ranking as loaded for rankManagerId; null while loading so nothing renders/saves early
  const [savedRanking, setSavedRanking] = useState(null);
  const [rankingSaveState, setRankingSaveState] = useState("idle");
  const [confirmingReset, setConfirmingReset] = useState(false);
  // Which draft this is — Mini (£100m/5 slots) or Main (£250m/18 slots) —
  // drives the budget/slot shape everywhere below.
  const [draftType, setDraftType] = useState(() => {
    try {
      return localStorage.getItem("draft-type") === "main" ? "main" : "mini";
    } catch {
      return "mini";
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem("draft-type", draftType);
    } catch {
      // localStorage unavailable — draftType still works, just won't survive a refresh
    }
  }, [draftType]);
  const draftConfig = DRAFT_TYPES[draftType];
  // The specific upcoming event each draft type currently targets: the
  // earliest (by sort_order) event of that type not yet marked done. Falls
  // back to the known pre-season pair if DRAFT_EVENTS hasn't loaded yet.
  const nextEventOfType = (type) => {
    const candidate = DRAFT_EVENTS.filter((e) => e.type === type && !e.completed_at).sort(
      (a, b) => a.sort_order - b.sort_order
    )[0];
    return candidate ? candidate.id : type === "main" ? "main-2" : "mini-1";
  };
  const targetEventId = nextEventOfType(draftType);
  const targetEventLabel = DRAFT_EVENTS.find((e) => e.id === targetEventId)?.label || targetEventId;

  // Auth for the Submit button below — just gates that one write; viewing
  // the rest of /draft needs no login, same as always. Session persists via
  // supabaseClient's persistSession so a refresh doesn't log James out.
  const [session, setSession] = useState(null);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [submitState, setSubmitState] = useState("idle"); // idle | submitting | success | error
  const [markDoneState, setMarkDoneState] = useState("idle"); // idle | working | success | error
  const [markDoneMessage, setMarkDoneMessage] = useState("");
  const [confirmingMarkDone, setConfirmingMarkDone] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [seasonDoneState, setSeasonDoneState] = useState("idle"); // idle | working | success | error
  const [seasonDoneMessage, setSeasonDoneMessage] = useState("");
  const [confirmingSeasonDone, setConfirmingSeasonDone] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    const { error } = await supabase.auth.signInWithPassword({ email: loginEmail, password: loginPassword });
    if (error) setLoginError(error.message);
    else setLoginPassword("");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  // Live Draft Mode: page-local only, never written to Supabase until the
  // "Submit" button below (which goes through a validated Supabase function
  // that requires James's login, not a raw table write) — but kept in
  // localStorage (this device only) so an accidental refresh mid-draft
  // doesn't lose what's been typed in. Exactly draftConfig.slotsPerManager
  // {player, price} slots per manager, keyed by manager id.
  const [liveModeOn, setLiveModeOn] = useState(() => {
    try {
      return localStorage.getItem("draft-live-mode-on") === "true";
    } catch {
      return false;
    }
  });
  const [liveSlotsByManager, setLiveSlotsByManager] = useState(() => {
    try {
      const raw = localStorage.getItem("draft-live-slots-by-manager");
      const parsed = raw ? JSON.parse(raw) : null;
      return parsed && typeof parsed === "object" ? parsed : {};
    } catch {
      return {};
    }
  });

  const getManagerSlots = (managerId) =>
    getManagerSlotsFrom(liveSlotsByManager, managerId, draftConfig.slotsPerManager);

  const updateLiveSlot = (managerId, index, field, value) => {
    setLiveSlotsByManager((prev) => {
      const current = getManagerSlotsFrom(prev, managerId, draftConfig.slotsPerManager);
      const next = current.map((s, i) => (i === index ? { ...s, [field]: value } : s));
      return { ...prev, [managerId]: next };
    });
  };

  useEffect(() => {
    try {
      localStorage.setItem("draft-live-mode-on", String(liveModeOn));
    } catch {
      // localStorage unavailable — Live Draft Mode still works, just won't survive a refresh
    }
  }, [liveModeOn]);

  useEffect(() => {
    try {
      localStorage.setItem("draft-live-slots-by-manager", JSON.stringify(liveSlotsByManager));
    } catch {
      // localStorage unavailable — Live Draft Mode still works, just won't survive a refresh
    }
  }, [liveSlotsByManager]);

  useEffect(() => {
    draftReady.then(() => setDataVersion((v) => v + 1));
  }, []);

  const elements = useMemo(
    () => (mainData && Array.isArray(mainData.elements) ? mainData.elements : []),
    [mainData]
  );

  useEffect(() => {
    const playedEventIds = (mainData?.events || [])
      .filter((e) => e.finished || e.is_current)
      .map((e) => e.id);
    if (!playedEventIds.length) return;
    let cancelled = false;
    fetchDefconBonusCounts(playedEventIds).then((counts) => {
      if (!cancelled) setDefconBonusCounts(counts);
    });
    return () => {
      cancelled = true;
    };
  }, [mainData]);

  const teamShortNameById = useMemo(() => {
    const map = new Map();
    (mainData?.teams || []).forEach((t) => map.set(t.id, t.short_name));
    return map;
  }, [mainData]);

  const watchlistSet = useMemo(() => new Set(watchlist), [watchlist]);

  // Load the shared watchlist from Supabase once on mount (falling back to this device's copy)
  useEffect(() => {
    let cancelled = false;
    const local = loadLocalWatchlist();
    fetchWatchlist()
      .then((remote) => {
        if (cancelled) return;
        if (remote) {
          setWatchlist(remote);
          setWatchlistSaveState("saved");
        } else if (local.length) {
          // Nothing in Supabase yet: adopt this device's copy and push it up once
          setWatchlistSaveState("saving");
          saveWatchlist(local)
            .then(() => !cancelled && setWatchlistSaveState("saved"))
            .catch(() => !cancelled && setWatchlistSaveState("error"));
        } else {
          setWatchlistSaveState("saved");
        }
      })
      .catch(() => {
        if (!cancelled) setWatchlistSaveState("error");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const toggleWatchlist = (code) => {
    const next = watchlist.includes(code) ? watchlist.filter((c) => c !== code) : [...watchlist, code];
    setWatchlist(next);
    setWatchlistSaveState("saving");
    saveWatchlist(next)
      .then(() => setWatchlistSaveState((s) => (s === "saving" ? "saved" : s)))
      .catch(() => setWatchlistSaveState("error"));
  };

  const elementByCode = useMemo(() => {
    const map = new Map();
    elements.forEach((el) => map.set(el.code, el));
    return map;
  }, [elements]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const ownership = useMemo(() => computeOwnershipAsOf(), [dataVersion]);

  const enrichedOwnership = useMemo(
    () =>
      ownership.map((o) => {
        const live = o.playerCode != null ? elementByCode.get(o.playerCode) : null;
        return {
          ...o,
          key: o.playerCode ?? o.playerName,
          points: live ? live.total_points : null,
          form: live ? live.form : null,
          currentPrice: live ? live.now_cost / 10 : null,
          status: live ? live.status : null,
          news: live ? live.news : null,
        };
      }),
    [ownership, elementByCode]
  );

  const ownerByKey = useMemo(() => {
    const owners = new Map();
    enrichedOwnership.forEach((o) => {
      if (o.playerCode != null) owners.set(`code:${o.playerCode}`, o.managerId);
      owners.set(`name:${o.playerName?.toLowerCase()}`, o.managerId);
    });
    return owners;
  }, [enrichedOwnership]);

  const squadsByManager = useMemo(() => {
    const map = new Map(MANAGERS.map((m) => [m.id, []]));
    enrichedOwnership.forEach((o) => {
      if (!map.has(o.managerId)) map.set(o.managerId, []);
      map.get(o.managerId).push(o);
    });
    return map;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enrichedOwnership, dataVersion]);

  const teamByTeamId = useMemo(() => new Map(fdrTeams.map((t) => [t.id, t])), [fdrTeams]);

  const maxMinutes = useMemo(
    () => elements.reduce((max, el) => Math.max(max, el.minutes || 0), 0),
    [elements]
  );

  // Prior-seasons score per player code, from cached element-summary
  // `history_past` rows (api_cache) — fetched once on mount, not per render.
  const [priorScoreByCode, setPriorScoreByCode] = useState(new Map());
  useEffect(() => {
    let cancelled = false;
    supabase
      .from("api_cache")
      .select("history_past:data->history_past")
      .like("endpoint", "%element-summary%")
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) {
          console.error("Failed to load player history from api_cache:", error.message);
          return;
        }
        setPriorScoreByCode(computePriorScoreByCode((data || []).map((row) => row.history_past)));
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Average FDR difficulty of each team's next 5 unplayed fixtures, using the
  // same opponent-strength convention as cardlist.js: a team's fixture
  // difficulty is the OPPONENT's away rating when at home, or home rating
  // when away.
  const avgDifficultyByTeamId = useMemo(() => {
    const map = new Map();
    if (!fixturesData?.length || !teamByTeamId.size) return map;
    const byTeam = new Map();
    fixturesData
      .filter((f) => !f.finished)
      .forEach((f) => {
        [
          { teamId: f.team_h, home: true, oppId: f.team_a },
          { teamId: f.team_a, home: false, oppId: f.team_h },
        ].forEach(({ teamId, home, oppId }) => {
          if (!byTeam.has(teamId)) byTeam.set(teamId, []);
          byTeam.get(teamId).push({ event: f.event, home, oppId });
        });
      });
    byTeam.forEach((fixtures, teamId) => {
      const next = [...fixtures].sort((a, b) => (a.event || 999) - (b.event || 999)).slice(0, 5);
      if (!next.length) return;
      const total = next.reduce((sum, fx) => {
        const opp = teamByTeamId.get(fx.oppId);
        const diff = opp ? (fx.home ? opp.a_diff : opp.h_diff) : 5;
        return sum + (diff || 5);
      }, 0);
      map.set(teamId, total / next.length);
    });
    return map;
  }, [fixturesData, teamByTeamId]);

  // Each manager's 5 slots parsed independently — null for an untouched slot,
  // {error} for a slot with something in it that doesn't resolve, otherwise a
  // resolved {playerCode, playerName, price}.
  const parsedSlotsByManager = useMemo(() => {
    const result = {};
    if (!liveModeOn) return result;
    MANAGERS.forEach((m) => {
      result[m.id] = getManagerSlots(m.id).map((slot) => parseLiveSlot(slot, elements));
    });
    return result;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [liveModeOn, liveSlotsByManager, elements, draftConfig]);

  const livePicks = useMemo(() => {
    const list = [];
    MANAGERS.forEach((m) => {
      (parsedSlotsByManager[m.id] || []).forEach((parsed) => {
        if (parsed) list.push({ ...parsed, managerId: m.id });
      });
    });
    return list;
  }, [parsedSlotsByManager]);
  const liveValidPicks = useMemo(() => livePicks.filter((p) => !p.error), [livePicks]);
  const liveSoldCodes = useMemo(
    () => new Set(liveValidPicks.map((p) => p.playerCode)),
    [liveValidPicks]
  );
  const liveSoldManagerByCode = useMemo(
    () => new Map(liveValidPicks.map((p) => [p.playerCode, p.managerId])),
    [liveValidPicks]
  );
  const liveSpend = useMemo(
    () => liveValidPicks.reduce((sum, p) => sum + p.price, 0),
    [liveValidPicks]
  );

  // Per-manager draft board: draftConfig.slotsPerManager slots and
  // draftConfig.managerBudget each, rendered directly from slot inputs +
  // parse results.
  const liveBoard = useMemo(
    () =>
      MANAGERS.map((manager) => {
        const slots = getManagerSlots(manager.id);
        const parsedSlots = parsedSlotsByManager[manager.id] || [];
        const spent = parsedSlots.reduce((sum, p) => sum + (p && !p.error ? p.price : 0), 0);
        return {
          manager,
          slots,
          parsedSlots,
          spent,
          remaining: Math.max(0, draftConfig.managerBudget - spent),
        };
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [liveSlotsByManager, parsedSlotsByManager, draftConfig]
  );

  const handleSubmitLivePicks = async () => {
    if (!liveValidPicks.length) return;
    setSubmitState("submitting");
    setSubmitMessage("");
    const rows = liveValidPicks.map((p) => ({
      manager_id: p.managerId,
      player_code: p.playerCode,
      player_name: p.playerName,
      position: p.position,
      price: p.price,
      action: "buy",
    }));
    const { error } = await supabase.rpc("submit_draft_picks", { event_id: targetEventId, rows });
    if (error) {
      setSubmitState("error");
      setSubmitMessage(error.message);
    } else {
      // Re-fetch so Current Squads / Draft History reflect this immediately —
      // TRANSACTIONS is otherwise only loaded once, at page mount.
      await loadDraftData();
      setDataVersion((v) => v + 1);
      setSubmitState("success");
      setSubmitMessage(`Submitted ${rows.length} pick${rows.length === 1 ? "" : "s"} to ${targetEventId}.`);
    }
  };

  // Rolling over to a new cycle (event or season) starts the next round's
  // research from a clean slate — last cycle's shortlist doesn't carry over.
  const clearWatchlistForRollover = () => {
    setWatchlist([]);
    setWatchlistSaveState("saving");
    saveWatchlist([])
      .then(() => setWatchlistSaveState((s) => (s === "saving" ? "saved" : s)))
      .catch(() => setWatchlistSaveState("error"));
  };

  // Locks the current event in (draft_events.completed_at), then pivots
  // planning to whatever's next overall — clears the local board (it was for
  // the event just finished) and switches draftType to the next event's
  // type, e.g. Mini Draft 1 done -> Main Draft 2 (price up every player).
  // Re-pricing for the new cycle needs no extra code here: pricedPool is a
  // memo over draftType + current ownership, both of which just changed, so
  // it recomputes on next render — the whole pool for a Main Draft, or just
  // the free-agent pool for a Mini Draft.
  const handleMarkEventDone = async () => {
    if (!confirmingMarkDone) {
      setConfirmingMarkDone(true);
      return;
    }
    setConfirmingMarkDone(false);
    setMarkDoneState("working");
    setMarkDoneMessage("");
    const { error } = await supabase.rpc("mark_draft_event_done", { event_id: targetEventId });
    if (error) {
      setMarkDoneState("error");
      setMarkDoneMessage(error.message);
      return;
    }
    await loadDraftData();
    setDataVersion((v) => v + 1);
    setLiveSlotsByManager({});
    clearWatchlistForRollover();
    const upcoming = [...DRAFT_EVENTS]
      .filter((e) => !e.completed_at)
      .sort((a, b) => a.sort_order - b.sort_order)[0];
    if (upcoming) setDraftType(upcoming.type);
    setMarkDoneState("success");
    setMarkDoneMessage(
      upcoming
        ? `${targetEventId} marked done. Now planning for ${upcoming.label} (${upcoming.id}).`
        : `${targetEventId} marked done. No further events scheduled.`
    );
  };

  // Whether every known draft event is locked in — the season-rollover
  // button only makes sense once there's nothing left pending.
  const seasonComplete = DRAFT_EVENTS.length > 0 && DRAFT_EVENTS.every((e) => e.completed_at);

  // Closes out the season: mark_season_done() (server-side, also refuses if
  // anything's still pending) creates the next season's 4 events (Main 1,
  // Mini 1, Main 2, Mini 2) and this pivots planning onto the new Main Draft
  // 1, same as handleMarkEventDone does for a single event.
  const handleMarkSeasonDone = async () => {
    if (!confirmingSeasonDone) {
      setConfirmingSeasonDone(true);
      return;
    }
    setConfirmingSeasonDone(false);
    setSeasonDoneState("working");
    setSeasonDoneMessage("");
    const { error } = await supabase.rpc("mark_season_done");
    if (error) {
      setSeasonDoneState("error");
      setSeasonDoneMessage(error.message);
      return;
    }
    await loadDraftData();
    setDataVersion((v) => v + 1);
    setLiveSlotsByManager({});
    clearWatchlistForRollover();
    const upcoming = [...DRAFT_EVENTS]
      .filter((e) => !e.completed_at)
      .sort((a, b) => a.sort_order - b.sort_order)[0];
    if (upcoming) setDraftType(upcoming.type);
    setSeasonDoneState("success");
    setSeasonDoneMessage(
      upcoming
        ? `New season started. Now planning for ${upcoming.label} (${upcoming.id}).`
        : "New season started."
    );
  };

  // Two predicted prices per player, both value-above-replacement (Step 5):
  // "Pre £" is a fixed pre-draft baseline so it stays put for comparison;
  // "Live £" re-runs the same method against whatever Live Draft Mode has
  // actually removed from the pool and spent from the budget, so the two can
  // be compared as the draft unfolds. Pool differs by draftType: Mini only
  // pools free agents (current ownership respected); Main wipes every squad,
  // so the whole player universe is in scope regardless of who owns whom now.
  const pricedPool = useMemo(() => {
    const result = new Map();
    if (!elements.length) return result;

    const persistedUnowned =
      draftType === "main"
        ? elements
        : elements.filter(
            (el) => !(ownerByKey.get(`code:${el.code}`) ?? ownerByKey.get(`name:${el.web_name?.toLowerCase()}`))
          );
    const totalBudget = draftConfig.managerBudget * 5;
    const totalSlots = draftConfig.slotsPerManager * 5;
    const prePrices = computeEstimates(
      persistedUnowned,
      avgDifficultyByTeamId,
      teamByTeamId,
      maxMinutes,
      priorScoreByCode,
      totalBudget,
      totalSlots,
      draftConfig.managerBudget
    );

    const stillAvailable = persistedUnowned.filter((el) => !liveSoldCodes.has(el.code));
    const remainingBudget = Math.max(0, totalBudget - liveSpend);
    const remainingSlots = Math.max(1, totalSlots - liveValidPicks.length);
    const livePrices = computeEstimates(
      stillAvailable,
      avgDifficultyByTeamId,
      teamByTeamId,
      maxMinutes,
      priorScoreByCode,
      remainingBudget,
      remainingSlots,
      draftConfig.managerBudget
    );

    persistedUnowned.forEach((el) => {
      result.set(el.code, {
        prePrice: prePrices.get(el.code) || 0,
        livePrice: livePrices.get(el.code) || 0,
      });
    });

    return result;
  }, [
    elements,
    ownerByKey,
    draftType,
    draftConfig,
    avgDifficultyByTeamId,
    teamByTeamId,
    maxMinutes,
    priorScoreByCode,
    liveSoldCodes,
    liveSpend,
    liveValidPicks.length,
  ]);

  const availablePlayers = useMemo(() => {
    if (!elements.length) return [];
    const withOwners = elements.map((el) => ({
      ...el,
      teamName: teamShortNameById.get(el.team) || "",
      // null until the gameweek live data arrives, then 0 for anyone who never earned it
      defconBonuses: defconBonusCounts ? defconBonusCounts.get(el.id) || 0 : null,
      ownerId:
        liveSoldManagerByCode.get(el.code) ??
        ownerByKey.get(`code:${el.code}`) ??
        ownerByKey.get(`name:${el.web_name?.toLowerCase()}`),
      liveSold: liveSoldManagerByCode.has(el.code),
      // Only ever set for players unowned as of before this draft — pricedPool
      // prices that pool only (Pre £ fixed, Live £ shrinks as picks come in)
      ...(pricedPool.get(el.code) || { prePrice: 0, livePrice: 0 }),
    }));
    const showingWatchlist = availableView === "watchlist";
    const query = searchQuery.trim().toLowerCase();
    const filtered = withOwners.filter((el) => {
      if (showingWatchlist && !watchlistSet.has(el.code)) return false;
      if (!showingWatchlist && el.ownerId && !includeDrafted) return false;
      if (positionFilter !== "all" && el.element_type !== Number(positionFilter)) return false;
      if (query) {
        const haystack = `${el.web_name || ""} ${el.first_name || ""} ${el.second_name || ""}`.toLowerCase();
        if (!haystack.includes(query)) return false;
      }
      return true;
    });

    const column = AVAILABLE_COLUMNS.find((c) => c.key === sortKey) || AVAILABLE_COLUMNS[0];
    const dir = sortDir === "asc" ? 1 : -1;
    const sorted = [...filtered].sort((a, b) => {
      const va = column.value(a);
      const vb = column.value(b);
      const cmp = typeof va === "string" ? va.localeCompare(vb) : va - vb;
      // Tie-break on total points so equal values still land in a sensible order
      return cmp * dir || (b.total_points || 0) - (a.total_points || 0);
    });

    return sorted;
  }, [
    elements,
    teamShortNameById,
    defconBonusCounts,
    ownerByKey,
    pricedPool,
    liveSoldManagerByCode,
    includeDrafted,
    availableView,
    watchlistSet,
    positionFilter,
    searchQuery,
    sortKey,
    sortDir,
  ]);

  // Back to page 1 whenever the list itself changes (sort, filters, view)
  useEffect(() => {
    setAvailablePage(0);
  }, [includeDrafted, availableView, positionFilter, searchQuery, sortKey, sortDir]);

  const availablePageCount = Math.max(1, Math.ceil(availablePlayers.length / AVAILABLE_PAGE_SIZE));
  const currentAvailablePage = Math.min(availablePage, availablePageCount - 1);
  const availablePageOffset = currentAvailablePage * AVAILABLE_PAGE_SIZE;
  const availablePagePlayers = availablePlayers.slice(
    availablePageOffset,
    availablePageOffset + AVAILABLE_PAGE_SIZE
  );

  const goToAvailablePage = (page) => {
    setAvailablePage(page);
    document.querySelector(".draft-available-section")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSort = (column) => {
    if (column.key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(column.key);
      setSortDir(column.firstDir || "desc");
    }
  };

  const handleSquadSort = (column) => {
    if (column.key === squadSortKey) {
      setSquadSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSquadSortKey(column.key);
      setSquadSortDir(column.firstDir || "desc");
    }
  };

  const rankManagerSquad = useMemo(
    () => squadsByManager.get(rankManagerId) || [],
    [squadsByManager, rankManagerId]
  );

  // Load this manager's saved ranking from Supabase (falling back to this device's copy)
  useEffect(() => {
    let cancelled = false;
    setSavedRanking(null);
    setRankingSaveState("idle");
    setConfirmingReset(false);
    const local = loadLocalRanking(rankManagerId);
    fetchRanking(rankManagerId)
      .then((remote) => {
        if (cancelled) return;
        if (remote) {
          setSavedRanking({ managerId: rankManagerId, ...remote });
          setRankingSaveState("saved");
        } else {
          // Nothing in Supabase yet: adopt anything saved on this device and push it up once
          setSavedRanking({ managerId: rankManagerId, ...local });
          if (local.orderKeys || Object.keys(local.statuses).length) {
            setRankingSaveState("saving");
            saveRanking(rankManagerId, {
              orderKeys: local.orderKeys || [],
              statuses: local.statuses,
            })
              .then(() => !cancelled && setRankingSaveState("saved"))
              .catch(() => !cancelled && setRankingSaveState("error"));
          }
        }
      })
      .catch(() => {
        if (cancelled) return;
        setSavedRanking({ managerId: rankManagerId, ...local });
        setRankingSaveState("error");
      });
    return () => {
      cancelled = true;
    };
  }, [rankManagerId]);

  const pointsDefaultOrder = useMemo(
    () =>
      [...rankManagerSquad].sort((a, b) => (b.points || 0) - (a.points || 0)).map((p) => p.key),
    [rankManagerSquad]
  );

  // Apply the saved order to the current squad: saved players keep their exact positions,
  // anyone new to the squad (e.g. after a mini draft) is appended in points order
  useEffect(() => {
    if (!savedRanking || savedRanking.managerId !== rankManagerId) {
      setOrderedKeys([]);
      setStatuses({});
      return;
    }
    const squadKeys = new Set(rankManagerSquad.map((p) => p.key));
    const saved = savedRanking.orderKeys || [];
    const savedFiltered = saved.filter((k) => squadKeys.has(k));
    const missing = pointsDefaultOrder.filter((k) => !savedFiltered.includes(k));
    setOrderedKeys([...savedFiltered, ...missing]);
    setStatuses(savedRanking.statuses || {});
  }, [savedRanking, rankManagerId, rankManagerSquad, pointsDefaultOrder]);

  const persistRanking = (nextOrder, nextStatuses) => {
    const managerId = rankManagerId;
    setSavedRanking({ managerId, orderKeys: nextOrder, statuses: nextStatuses });
    setRankingSaveState("saving");
    saveRanking(managerId, { orderKeys: nextOrder, statuses: nextStatuses })
      .then(() => setRankingSaveState((s) => (s === "saving" ? "saved" : s)))
      .catch(() => setRankingSaveState("error"));
  };

  const rankingReady = savedRanking?.managerId === rankManagerId;

  const toggleStatus = (key, statusId) => {
    if (!rankingReady) return;
    const next = { ...statuses };
    if (next[key] === statusId) delete next[key];
    else next[key] = statusId;
    setStatuses(next);
    persistRanking(orderedKeys, next);
  };

  const rankedPlayers = useMemo(() => {
    const byKey = new Map(rankManagerSquad.map((p) => [p.key, p]));
    return orderedKeys.map((k) => byKey.get(k)).filter(Boolean);
  }, [orderedKeys, rankManagerSquad]);

  const handleDrop = (targetIndex) => {
    if (!rankingReady || dragIndex === null || dragIndex === targetIndex) return;
    const next = [...orderedKeys];
    const [moved] = next.splice(dragIndex, 1);
    next.splice(targetIndex, 0, moved);
    setOrderedKeys(next);
    setDragIndex(null);
    persistRanking(next, statuses);
  };

  // Two clicks needed so the saved order can't be wiped by a stray tap
  const resetRankOrder = () => {
    if (!rankingReady) return;
    if (!confirmingReset) {
      setConfirmingReset(true);
      return;
    }
    setConfirmingReset(false);
    setOrderedKeys(pointsDefaultOrder);
    persistRanking(pointsDefaultOrder, statuses);
  };

  return (
    <div className="draft-page-container">
      <header className="draft-hero">
        <span className="draft-hero-eyebrow">🔒 Private research</span>
        <h1>Draft League</h1>
        <p className="draft-hero-lede">
          Squads, keep/drop planning and free-agent scouting for the {MANAGERS.length || 5}-manager
          league.
        </p>
      </header>

      <div className="draft-tabs">
        <button
          className={activeTab === "squads" ? "active" : ""}
          onClick={() => setActiveTab("squads")}
        >
          Current Squads
        </button>
        <button
          className={activeTab === "ranking" ? "active" : ""}
          onClick={() => setActiveTab("ranking")}
        >
          Keep/Drop Ranking
        </button>
        <button
          className={activeTab === "history" ? "active" : ""}
          onClick={() => setActiveTab("history")}
        >
          Draft History
        </button>
        <button
          className={activeTab === "available" ? "active" : ""}
          onClick={() => setActiveTab("available")}
        >
          Available Players
        </button>
      </div>

      {activeTab === "squads" && (
        <div className="draft-squads-grid">
          {MANAGERS.map((manager) => {
            const squad = squadsByManager.get(manager.id) || [];
            const totalPoints = squad.reduce((sum, p) => sum + (p.points || 0), 0);
            const positionCounts = squad.reduce((acc, p) => {
              if (!p.position) return acc;
              const name = POSITION_NAMES[p.position] || p.position;
              acc[name] = (acc[name] || 0) + 1;
              return acc;
            }, {});

            return (
              <div className="draft-manager-card" key={manager.id}>
                <h3>{manager.name}</h3>
                {squad.length > 0 && <p className="draft-manager-points">{totalPoints} pts</p>}
                <p className="draft-manager-summary">
                  {["GK", "DEF", "MID", "FWD"]
                    .filter((pos) => positionCounts[pos])
                    .map((pos) => `${positionCounts[pos]} ${pos}`)
                    .join(", ") || "no squad recorded yet"}
                </p>
                {squad.length === 0 ? (
                  <p className="draft-empty-state">
                    No players recorded yet. Ask Claude to load the draft results in.
                  </p>
                ) : (
                  <table className="draft-squad-table">
                    <thead>
                      <tr>
                        {SQUAD_COLUMNS.map((c) => (
                          <th
                            key={c.key}
                            className={`draft-sortable ${c.num ? "num" : ""} ${
                              squadSortKey === c.key ? "sorted" : ""
                            }`}
                            onClick={() => handleSquadSort(c)}
                            aria-sort={
                              squadSortKey === c.key
                                ? squadSortDir === "asc"
                                  ? "ascending"
                                  : "descending"
                                : "none"
                            }
                          >
                            {c.label}
                            {squadSortKey === c.key && (
                              <span className="draft-sort-arrow">
                                {squadSortDir === "asc" ? "▲" : "▼"}
                              </span>
                            )}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {squad
                        .slice()
                        .sort((a, b) => {
                          const column =
                            SQUAD_COLUMNS.find((c) => c.key === squadSortKey) || SQUAD_COLUMNS[3];
                          const dir = squadSortDir === "asc" ? 1 : -1;
                          const va = column.value(a);
                          const vb = column.value(b);
                          const cmp = typeof va === "string" ? va.localeCompare(vb) : va - vb;
                          return cmp * dir || (b.points || 0) - (a.points || 0);
                        })
                        .map((p, idx) => (
                          <tr key={idx}>
                            <td>{p.playerName}</td>
                            <td>
                              <PositionChip position={p.position} />
                            </td>
                            <td className="num">£{p.price}m</td>
                            <td className="num">{p.points ?? "—"}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                )}
              </div>
            );
          })}
        </div>
      )}

      {activeTab === "ranking" && (
        <div className="draft-ranking-section">
          <div className="draft-ranking-inner">
            <div className="draft-ranking-controls">
              <label>
                Manager:
                <select value={rankManagerId} onChange={(e) => setRankManagerId(e.target.value)}>
                  {MANAGERS.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </label>
              <div className="draft-ranking-actions">
                <span className={`draft-save-state ${rankingSaveState}`}>
                  {!rankingReady
                    ? "Loading…"
                    : rankingSaveState === "saving"
                    ? "Saving…"
                    : rankingSaveState === "saved"
                    ? "Saved"
                    : rankingSaveState === "error"
                    ? "Not saved to Supabase — kept on this device only"
                    : ""}
                </span>
                <button
                  className={`draft-reset-btn ${confirmingReset ? "confirming" : ""}`}
                  onClick={resetRankOrder}
                  onBlur={() => setConfirmingReset(false)}
                  disabled={!rankingReady}
                >
                  {confirmingReset ? "Click again to reset" : "Reset to points order"}
                </button>
              </div>
            </div>
            <p className="draft-page-subtitle">
              Drag rows to reorder — top is most likely to keep, bottom is most likely to drop.
              Your order and Keep/Maybe/Drop picks are saved to Supabase for each manager.
            </p>
            {!rankingReady ? (
              <p className="draft-empty-state">Loading saved ranking…</p>
            ) : rankedPlayers.length === 0 ? (
              <p className="draft-empty-state">No squad recorded for this manager yet.</p>
            ) : (
              <ol className="draft-ranking-list">
                {rankedPlayers.map((p, idx) => (
                  <li
                    key={p.key}
                    className={`draft-ranking-row ${dragIndex === idx ? "dragging" : ""} ${
                      statuses[p.key] ? `status-${statuses[p.key]}` : ""
                    }`}
                    draggable
                    onDragStart={() => setDragIndex(idx)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => handleDrop(idx)}
                    onDragEnd={() => setDragIndex(null)}
                  >
                    <span className="draft-ranking-position">{idx + 1}</span>
                    <span className="draft-ranking-name">
                      {p.playerName}
                      <AvailabilityIcon status={p.status} news={p.news} />
                    </span>
                    <span className="draft-ranking-pos-tag">
                      <PositionChip position={p.position} />
                    </span>
                    <span className="draft-ranking-price">£{p.price}m</span>
                    <span className="draft-ranking-points">{p.points ?? "—"} pts</span>
                    <span className="draft-status-buttons">
                      {KEEP_STATUSES.map((st) => (
                        <button
                          key={st.id}
                          className={`draft-status-btn ${st.id} ${
                            statuses[p.key] === st.id ? "selected" : ""
                          }`}
                          onClick={() => toggleStatus(p.key, st.id)}
                        >
                          {st.label}
                        </button>
                      ))}
                    </span>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </div>
      )}

      {activeTab === "history" && (
        <div className="draft-history-list">
          {DRAFT_EVENTS.map((event) => {
            const eventTx = TRANSACTIONS.filter((t) => t.event_id === event.id);
            const buys = eventTx.filter((t) => t.action === "buy");
            const drops = eventTx.filter((t) => t.action === "drop");

            const buysByManager = new Map();
            buys.forEach((t) => {
              if (!buysByManager.has(t.manager_id)) buysByManager.set(t.manager_id, []);
              buysByManager.get(t.manager_id).push(t);
            });
            const dropsByManager = new Map();
            drops.forEach((t) => {
              if (!dropsByManager.has(t.manager_id)) dropsByManager.set(t.manager_id, []);
              dropsByManager.get(t.manager_id).push(t);
            });

            return (
              <div className="draft-history-item" key={event.id}>
                <div className="draft-history-header">
                  <span className="draft-history-label">{event.label}</span>
                  <span className="draft-history-badge">{event.type}</span>
                  {event.budget != null && (
                    <span className="draft-history-budget">£{event.budget}m budget</span>
                  )}
                </div>
                {event.note && <p className="draft-history-note">{event.note}</p>}
                {eventTx.length === 0 ? (
                  <p className="draft-empty-state">Not yet happened.</p>
                ) : event.type === "main" ? (
                  <>
                    <p className="draft-history-summary">
                      {buysByManager.size} managers drafted {buys.length} players in total — £
                      {buys.reduce((sum, t) => sum + (t.price || 0), 0)}m combined spend.
                    </p>
                    <div className="draft-squads-grid draft-history-grid">
                      {MANAGERS.map((manager) => {
                        const managerBuys = (buysByManager.get(manager.id) || [])
                          .slice()
                          .sort((a, b) => (b.price || 0) - (a.price || 0));
                        return (
                          <div className="draft-manager-card" key={manager.id}>
                            <h3>{manager.name}</h3>
                            <table className="draft-squad-table draft-history-table">
                              <thead>
                                <tr>
                                  <th>Player</th>
                                  <th>Pos</th>
                                  <th className="num">Price</th>
                                </tr>
                              </thead>
                              <tbody>
                                {managerBuys.map((t, idx) => (
                                  <tr key={idx}>
                                    <td>{t.player_name}</td>
                                    <td>
                                      <PositionChip position={t.position} />
                                    </td>
                                    <td className="num">£{t.price}m</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        );
                      })}
                    </div>
                  </>
                ) : (
                  <div className="draft-squads-grid draft-history-grid">
                    {MANAGERS.map((manager, _, all) => {
                      // Pad every card to the event's biggest in/out count so short lists show "N/A" slots
                      const slotCount = Math.max(
                        0,
                        ...all.map((m) =>
                          Math.max(
                            (dropsByManager.get(m.id) || []).length,
                            (buysByManager.get(m.id) || []).length
                          )
                        )
                      );
                      const managerDrops = dropsByManager.get(manager.id) || [];
                      const managerBuys = (buysByManager.get(manager.id) || [])
                        .slice()
                        .sort((a, b) => (b.price || 0) - (a.price || 0));
                      const spend = managerBuys.reduce((sum, t) => sum + (t.price || 0), 0);
                      const renderRows = (list, kind) =>
                        Array.from({ length: slotCount }, (_, idx) => {
                          const t = list[idx];
                          return (
                            <tr
                              key={`${kind}-${idx}`}
                              className={`draft-swap-row ${kind} ${t ? "" : "empty"}`}
                            >
                              <td>
                                <span className="draft-swap-marker">{kind === "in" ? "+" : "−"}</span>
                                {t ? t.player_name : "N/A"}
                              </td>
                              <td>
                                {t && <PositionChip position={t.position} />}
                              </td>
                              <td className="num">{t && kind === "in" ? `£${t.price}m` : ""}</td>
                            </tr>
                          );
                        });
                      return (
                        <div className="draft-manager-card" key={manager.id}>
                          <h3>{manager.name}</h3>
                          {managerDrops.length + managerBuys.length === 0 ? (
                            <p className="draft-empty-state">No changes.</p>
                          ) : (
                            <>
                              <p className="draft-manager-summary">
                                £{spend}m spent
                                {event.budget != null && ` of £${event.budget}m`}
                              </p>
                              <table className="draft-swap-table">
                                <colgroup>
                                  <col className="draft-swap-col-name" />
                                  <col className="draft-swap-col-pos" />
                                  <col className="draft-swap-col-price" />
                                </colgroup>
                                <tbody>
                                  <tr className="draft-swap-heading out">
                                    <th colSpan={3}>Out</th>
                                  </tr>
                                  {renderRows(managerDrops, "out")}
                                  <tr className="draft-swap-heading in">
                                    <th colSpan={3}>In</th>
                                  </tr>
                                  {renderRows(managerBuys, "in")}
                                </tbody>
                              </table>
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
          {DRAFT_EVENTS.length === 0 && (
            <p className="draft-empty-state">Loading draft history...</p>
          )}
        </div>
      )}

      {activeTab === "available" && (
        <div className="draft-available-section">
          <div className="draft-subtabs">
            <button
              className={availableView === "all" ? "active" : ""}
              onClick={() => setAvailableView("all")}
            >
              All players
            </button>
            <button
              className={availableView === "watchlist" ? "active" : ""}
              onClick={() => setAvailableView("watchlist")}
            >
              Watchlist
              <span className="draft-subtab-count">{watchlist.length}</span>
            </button>
            {availableView === "watchlist" && (
              <span className={`draft-save-state ${watchlistSaveState}`}>
                {watchlistSaveState === "saving"
                  ? "Saving…"
                  : watchlistSaveState === "saved"
                  ? "Saved"
                  : watchlistSaveState === "error"
                  ? "Not saved to Supabase — kept on this device only"
                  : ""}
              </span>
            )}
          </div>
          <div className="draft-available-controls">
            <input
              type="search"
              className="draft-search-input"
              placeholder="Search players..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search players"
            />
            <label>
              Position:
              <select value={positionFilter} onChange={(e) => setPositionFilter(e.target.value)}>
                <option value="all">All</option>
                <option value="1">GK</option>
                <option value="2">DEF</option>
                <option value="3">MID</option>
                <option value="4">FWD</option>
              </select>
            </label>
            {availableView === "all" && (
              <label>
                Draft:
                <select value={draftType} onChange={(e) => setDraftType(e.target.value)}>
                  {Object.values(DRAFT_TYPES).map((dt) => (
                    <option key={dt.id} value={dt.id}>
                      {dt.label}
                    </option>
                  ))}
                </select>
              </label>
            )}
            {availableView === "all" && (
              <button
                className={`draft-toggle-btn ${includeDrafted ? "on" : ""}`}
                onClick={() => setIncludeDrafted((v) => !v)}
                aria-pressed={includeDrafted}
              >
                {includeDrafted ? "Including drafted players" : "Excluding drafted players"}
              </button>
            )}
            {availableView === "all" && (
              <button
                className={`draft-toggle-btn ${liveModeOn ? "on" : ""}`}
                onClick={() => setLiveModeOn((v) => !v)}
                aria-pressed={liveModeOn}
              >
                {liveModeOn ? "Live Draft Mode: on" : "Live Draft Mode: off"}
              </button>
            )}
          </div>

          {availableView === "all" && elements.length > 0 && (
            <p className="draft-pricing-note">
              Pre £ and Live £ are both predicted {draftConfig.label} auction prices (£
              {draftConfig.managerBudget} × 5 budget, targeting <code>{targetEventId}</code>) from
              current stats + fixtures — Pre £ is a fixed pre-draft baseline, Live £ re-runs the same
              method against what Live Draft Mode says is actually left, so you can compare them as
              the draft happens.
              {draftType === "mini"
                ? " Neither yet includes players managers might drop, since drops aren't revealed until bidding starts."
                : " A Main Draft wipes every squad, so every player is in scope regardless of who currently owns whom."}
            </p>
          )}

          {availableView === "all" && liveModeOn && (
            <div className="draft-live-mode-panel">
              <h3 className="draft-live-submit-title">{targetEventLabel}</h3>
              <p className="draft-live-board-intro">
                Fill in each manager's 5 slots directly — a player field and a price field per row.
                Kept on this device only (survives a refresh, never sent to Supabase); it recomputes Live £
                for what's left as the draft happens.
              </p>
              <div className="draft-live-board">
                {liveBoard.map(({ manager, slots, parsedSlots, spent, remaining }) => (
                  <div className="draft-live-board-manager" key={manager.id}>
                    <div className="draft-live-board-header">
                      <span className="draft-live-board-name">{manager.name}</span>
                      <span className="draft-live-board-budget">
                        £{remaining}m left{spent > 0 ? ` (of £${draftConfig.managerBudget}m)` : ""}
                      </span>
                    </div>
                    <ol className="draft-live-board-slots">
                      {slots.map((slot, i) => {
                        const parsed = parsedSlots[i];
                        return (
                          <li
                            key={i}
                            className={parsed?.error ? "error" : parsed ? "filled" : "empty"}
                          >
                            <input
                              type="text"
                              className="draft-live-slot-player"
                              placeholder="Player"
                              value={slot.player}
                              onChange={(e) => updateLiveSlot(manager.id, i, "player", e.target.value)}
                              title={parsed?.error || undefined}
                            />
                            <input
                              type="text"
                              inputMode="decimal"
                              className="draft-live-slot-price"
                              placeholder="£m"
                              value={slot.price}
                              onChange={(e) => updateLiveSlot(manager.id, i, "price", e.target.value)}
                            />
                          </li>
                        );
                      })}
                    </ol>
                    {parsedSlots.some((p) => p?.error) && (
                      <ul className="draft-live-board-errors">
                        {parsedSlots.map(
                          (p, i) =>
                            p?.error && (
                              <li key={i}>
                                Slot {i + 1}: {p.error}
                              </li>
                            )
                        )}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
              <div className="draft-live-status">
                <span>
                  {liveValidPicks.length} pick{liveValidPicks.length === 1 ? "" : "s"} applied — £
                  {Math.max(0, draftConfig.managerBudget * 5 - liveSpend)}m left league-wide across{" "}
                  {Math.max(0, draftConfig.slotsPerManager * 5 - liveValidPicks.length)} slots
                </span>
              </div>
              <div className="draft-live-submit">
                <div className="draft-live-submit-controls">
                  {!session ? (
                    <form className="draft-login-form" onSubmit={handleLogin}>
                      <span className="draft-login-label">Log in to submit results:</span>
                      <input
                        type="email"
                        placeholder="Email"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        autoComplete="username"
                      />
                      <input
                        type="password"
                        placeholder="Password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        autoComplete="current-password"
                      />
                      <button type="submit" className="draft-toggle-btn">
                        Log in
                      </button>
                      {loginError && <span className="draft-live-submit-message error">{loginError}</span>}
                    </form>
                  ) : (
                    <>
                      <span className="draft-login-label">Logged in as {session.user.email}</span>
                      <button className="draft-toggle-btn" onClick={handleLogout}>
                        Log out
                      </button>
                      <button
                        className="draft-toggle-btn on"
                        disabled={submitState === "submitting" || liveValidPicks.length === 0}
                        onClick={handleSubmitLivePicks}
                      >
                        {submitState === "submitting"
                          ? "Submitting…"
                          : `Submit ${liveValidPicks.length} pick${liveValidPicks.length === 1 ? "" : "s"}`}
                      </button>
                      {submitMessage && (
                        <span className={`draft-live-submit-message ${submitState}`}>{submitMessage}</span>
                      )}
                      <button
                        className={`draft-toggle-btn draft-markdone-btn ${confirmingMarkDone ? "confirming" : ""}`}
                        disabled={markDoneState === "working"}
                        onClick={handleMarkEventDone}
                        title="Locks this event in and moves planning on to whatever's next"
                      >
                        {markDoneState === "working"
                          ? "Marking done…"
                          : confirmingMarkDone
                          ? "Click again to confirm"
                          : "Mark as done"}
                      </button>
                      {markDoneMessage && (
                        <span className={`draft-live-submit-message ${markDoneState}`}>{markDoneMessage}</span>
                      )}
                      <button
                        className={`draft-toggle-btn draft-markdone-btn ${
                          confirmingSeasonDone ? "confirming" : ""
                        }`}
                        disabled={!seasonComplete || seasonDoneState === "working"}
                        onClick={handleMarkSeasonDone}
                        title={
                          seasonComplete
                            ? "Closes out the season and starts next season's Main Draft 1"
                            : "Available once every draft event this season is marked done"
                        }
                      >
                        {seasonDoneState === "working"
                          ? "Starting new season…"
                          : confirmingSeasonDone
                          ? "Click again to confirm"
                          : "Mark season as done"}
                      </button>
                      {seasonDoneMessage && (
                        <span className={`draft-live-submit-message ${seasonDoneState}`}>
                          {seasonDoneMessage}
                        </span>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {!elements.length ? (
            <p className="draft-empty-state">Loading FPL data...</p>
          ) : availableView === "watchlist" && availablePlayers.length === 0 ? (
            <div className="draft-panel">
              <p className="draft-empty-state draft-watchlist-empty">
                {watchlist.length === 0
                  ? "No players on your watchlist yet — tap the ☆ next to a player in All players to add them."
                  : "No watchlisted players match this position filter."}
              </p>
            </div>
          ) : availableView === "all" && availablePlayers.length === 0 ? (
            <div className="draft-panel">
              <p className="draft-empty-state">No players match your search/filters.</p>
            </div>
          ) : (
            <div className="draft-panel">
              <div className="draft-table-scroll">
                <table className="draft-available-table">
                  <thead>
                    <tr>
                      <th className="draft-available-rank">#</th>
                      <th className="draft-col-star" aria-label="Watchlist" />
                      {AVAILABLE_COLUMNS.map((c) => (
                        <th
                          key={c.key}
                          className={`draft-sortable draft-col-${c.key} ${c.num ? "num" : ""} ${
                            c.groupStart ? "group-start" : ""
                          } ${sortKey === c.key ? "sorted" : ""}`}
                          title={c.title}
                          onClick={() => handleSort(c)}
                          aria-sort={
                            sortKey === c.key ? (sortDir === "asc" ? "ascending" : "descending") : "none"
                          }
                        >
                          {c.label}
                          {sortKey === c.key && (
                            <span className="draft-sort-arrow">{sortDir === "asc" ? "▲" : "▼"}</span>
                          )}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {availablePagePlayers.map((p, idx) => (
                      <tr key={p.id} className={p.ownerId ? "drafted" : ""}>
                        <td className="draft-available-rank">{availablePageOffset + idx + 1}</td>
                        <td className="draft-col-star">
                          <button
                            className={`draft-star-btn ${watchlistSet.has(p.code) ? "on" : ""}`}
                            onClick={() => toggleWatchlist(p.code)}
                            aria-pressed={watchlistSet.has(p.code)}
                            title={
                              watchlistSet.has(p.code) ? "Remove from watchlist" : "Add to watchlist"
                            }
                          >
                            {watchlistSet.has(p.code) ? "★" : "☆"}
                          </button>
                        </td>
                        <td className="draft-available-name">
                          {p.web_name}
                          <AvailabilityIcon status={p.status} news={p.news} />
                          {p.ownerId && (
                            <span className="draft-owner-tag">
                              {MANAGERS.find((m) => m.id === p.ownerId)?.name || p.ownerId}
                              {p.liveSold ? " (live)" : ""}
                            </span>
                          )}
                        </td>
                        <td className="draft-col-team">{p.teamName}</td>
                        <td>
                          <PositionChip position={p.element_type} />
                        </td>
                        <td>£{(p.now_cost / 10).toFixed(1)}m</td>
                        <td className="num group-start">{p.minutes}</td>
                        <td className="num group-start">{p.goals_scored}</td>
                        <td className="num">{p.assists}</td>
                        <td className="num">{(parseFloat(p.expected_goals) || 0).toFixed(2)}</td>
                        <td className="num">{(parseFloat(p.expected_assists) || 0).toFixed(2)}</td>
                        <td className="num group-start">{p.clean_sheets}</td>
                        <td className="num">{p.defconBonuses ?? "…"}</td>
                        <td className="num group-start">{p.bonus}</td>
                        <td className="num group-start">{p.form}</td>
                        <td className="num draft-available-pts">{p.total_points}</td>
                        <td className="num group-start">£{p.prePrice || 0}m</td>
                        <td className="num">£{p.livePrice || 0}m</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {availablePageCount > 1 && (
                <div className="draft-pager">
                  <button
                    onClick={() => goToAvailablePage(currentAvailablePage - 1)}
                    disabled={currentAvailablePage === 0}
                  >
                    ← Prev
                  </button>
                  <span className="draft-pager-info">
                    {availablePageOffset + 1}–
                    {Math.min(availablePageOffset + AVAILABLE_PAGE_SIZE, availablePlayers.length)} of{" "}
                    {availablePlayers.length}
                  </span>
                  <button
                    onClick={() => goToAvailablePage(currentAvailablePage + 1)}
                    disabled={currentAvailablePage >= availablePageCount - 1}
                  >
                    Next →
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DraftPage;
