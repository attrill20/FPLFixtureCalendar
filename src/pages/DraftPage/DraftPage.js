import React, { useEffect, useMemo, useState } from "react";
import "./DraftPage.css";
import { MANAGERS, DRAFT_EVENTS, TRANSACTIONS, computeOwnershipAsOf, draftReady } from "./draftData";
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

const AvailabilityIcon = ({ status, news }) => {
  let type = null;
  if (status === "s") type = "suspended";
  else if (status === "i") type = "injured";
  else if (status === "d") type = "doubtful";
  else if (status === "u" || status === "n") {
    type = /joined|loan|left the club|departed|returned to|transferred/i.test(news || "") ? "left" : "unavailable";
  }
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
const DraftPage = ({ mainData }) => {
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

  const availablePlayers = useMemo(() => {
    if (!elements.length) return [];
    const withOwners = elements.map((el) => ({
      ...el,
      teamName: teamShortNameById.get(el.team) || "",
      // null until the gameweek live data arrives, then 0 for anyone who never earned it
      defconBonuses: defconBonusCounts ? defconBonusCounts.get(el.id) || 0 : null,
      ownerId:
        ownerByKey.get(`code:${el.code}`) ?? ownerByKey.get(`name:${el.web_name?.toLowerCase()}`),
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
              <button
                className={`draft-toggle-btn ${includeDrafted ? "on" : ""}`}
                onClick={() => setIncludeDrafted((v) => !v)}
                aria-pressed={includeDrafted}
              >
                {includeDrafted ? "Including drafted players" : "Excluding drafted players"}
              </button>
            )}
          </div>

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
                        <td className="num group-start">{p.clean_sheets}</td>
                        <td className="num">{p.defconBonuses ?? "…"}</td>
                        <td className="num group-start">{p.bonus}</td>
                        <td className="num group-start">{p.form}</td>
                        <td className="num draft-available-pts">{p.total_points}</td>
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
