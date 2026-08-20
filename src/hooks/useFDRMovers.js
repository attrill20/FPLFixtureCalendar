import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { getSupaIdToLocalIdMap } from '../utils/teamIdMap';

/**
 * Fetches FDR weekly snapshots and computes week-over-week movers.
 * Returns up to 3 gameweeks of recap data (needs 4 snapshots to compute 3 diffs).
 * Also includes a live recap for the current in-progress gameweek if snapshot data exists.
 */
export function useFDRMovers() {
  const [recaps, setRecaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchMovers() {
      try {
        // Fetch finished GWs, current in-progress GW, and the stale-Supabase-id ->
        // this-season's-dummy.js-id translation map in parallel
        const [finishedResult, currentResult, idMap] = await Promise.all([
          supabase
            .from('gameweeks')
            .select('id, name')
            .eq('finished', true)
            .order('id', { ascending: false })
            .limit(6),
          supabase
            .from('gameweeks')
            .select('id, name')
            .eq('is_current', true)
            .eq('finished', false)
            .limit(1),
          getSupaIdToLocalIdMap()
        ]);

        if (finishedResult.error) throw finishedResult.error;
        if (currentResult.error) throw currentResult.error;

        const recentGWs = finishedResult.data || [];
        const currentGW = currentResult.data && currentResult.data.length > 0
          ? currentResult.data[0]
          : null;

        // Collect all GW IDs we need snapshots for
        const allGWs = [...recentGWs];
        if (currentGW) allGWs.push(currentGW);

        if (allGWs.length < 2) {
          // Need at least 2 gameweeks to compute a diff
          if (!cancelled) {
            setRecaps([]);
            setLoading(false);
          }
          return;
        }

        const gwIds = allGWs.map(gw => gw.id);

        // Fetch snapshots, kickoff times, and player stats for match reconstruction
        const [
          { data: snapshots, error: snapError },
          { data: kickoffs, error: koError },
          { data: playerStats, error: psError }
        ] = await Promise.all([
          supabase
            .from('fdr_weekly_snapshots')
            .select('*')
            .in('gameweek_id', gwIds),
          supabase
            .from('player_gameweek_stats')
            .select('gameweek_id, kickoff_time')
            .in('gameweek_id', gwIds)
            .order('kickoff_time', { ascending: false }),
          supabase
            .from('player_gameweek_stats')
            .select('gameweek_id, goals_conceded, was_home, opponent_team, players(team_id)')
            .in('gameweek_id', gwIds)
            .gt('minutes', 0)
        ]);

        if (snapError) throw snapError;
        if (koError) throw koError;
        if (psError) console.warn('Could not fetch player stats for match reconstruction:', psError.message);

        // Translate snapshot team_ids from Supabase's stale season-numbering to
        // this season's dummy.js ids; drop rows for clubs no longer in the league
        // (e.g. relegated teams) rather than let them collide with a reused id
        const translatedSnapshots = (snapshots || [])
          .map(s => ({ ...s, team_id: idMap[s.team_id] }))
          .filter(s => s.team_id != null);

        // Count matches played in live GW (separate try/catch so failure doesn't break finished recaps)
        let liveMatchesPlayed = 0;
        if (currentGW) {
          try {
            const { data: homeRows, error: matchError } = await supabase
              .from('player_gameweek_stats')
              .select('opponent_team')
              .eq('gameweek_id', currentGW.id)
              .eq('was_home', true)
              .gt('minutes', 0);
            if (!matchError && homeRows) {
              const uniqueOpponents = new Set(homeRows.map(r => r.opponent_team));
              liveMatchesPlayed = uniqueOpponents.size;
            }
          } catch (e) {
            console.warn('Could not fetch match count for live GW:', e.message);
          }
        }

        // Build map of last kickoff time per gameweek
        const lastKickoffByGW = {};
        if (kickoffs) {
          kickoffs.forEach(k => {
            if (!lastKickoffByGW[k.gameweek_id] || k.kickoff_time > lastKickoffByGW[k.gameweek_id]) {
              lastKickoffByGW[k.gameweek_id] = k.kickoff_time;
            }
          });
        }

        // Reconstruct match results from goals_conceded (more reliable than summing goals_scored).
        // Logic: a team's score = MAX(goals_conceded) of the OPPOSING team's players who played.
        // goals_conceded is a defensive team stat always present on the opposing side, so it works
        // even when the goal scorer's row is missing from our DB.
        const matchesByGW = {};
        if (playerStats && playerStats.length > 0) {
          const groups = {};
          playerStats.forEach(row => {
            const teamId = idMap[row.players?.team_id];
            const opponentId = idMap[row.opponent_team];
            if (teamId == null || opponentId == null) return;
            const key = `${row.gameweek_id}-${teamId}-${opponentId}-${row.was_home}`;
            if (!groups[key]) {
              groups[key] = { gameweek_id: row.gameweek_id, team_id: teamId, opponent_team: opponentId, was_home: row.was_home, maxGoalsConceded: 0 };
            }
            groups[key].maxGoalsConceded = Math.max(groups[key].maxGoalsConceded, row.goals_conceded || 0);
          });

          Object.values(groups).forEach(group => {
            if (!group.was_home) return;
            const team_h = group.team_id;
            const team_a = group.opponent_team;
            const gwId = group.gameweek_id;
            const awayKey = `${gwId}-${team_a}-${team_h}-false`;
            const awayGroup = groups[awayKey];
            // Home team's score = MAX goals_conceded of away team players (away GC = home goals scored)
            // Away team's score = MAX goals_conceded of home team players (home GC = away goals scored)
            const team_h_score = awayGroup ? awayGroup.maxGoalsConceded : 0;
            const team_a_score = group.maxGoalsConceded;
            if (!matchesByGW[gwId]) matchesByGW[gwId] = [];
            matchesByGW[gwId].push({ team_h, team_a, team_h_score, team_a_score });
          });
        }

        if (translatedSnapshots.length === 0) {
          if (!cancelled) {
            setRecaps([]);
            setLoading(false);
          }
          return;
        }

        // Group snapshots by gameweek_id
        const byGW = {};
        translatedSnapshots.forEach(s => {
          if (!byGW[s.gameweek_id]) byGW[s.gameweek_id] = [];
          byGW[s.gameweek_id].push(s);
        });

        // Get latest updated_at from current GW snapshots (for live indicator)
        let liveUpdatedAt = null;
        if (currentGW && byGW[currentGW.id]) {
          byGW[currentGW.id].forEach(s => {
            if (s.updated_at && (!liveUpdatedAt || s.updated_at > liveUpdatedAt)) {
              liveUpdatedAt = s.updated_at;
            }
          });
        }

        // Sort finished GWs ascending (oldest first) so we can pair consecutive ones
        const sortedFinished = [...recentGWs].sort((a, b) => a.id - b.id);

        // Build recap pairs from finished GWs (previous → current)
        const recapData = [];
        for (let i = 1; i < sortedFinished.length; i++) {
          const prevGW = sortedFinished[i - 1];
          const currGW = sortedFinished[i];
          const prevSnaps = byGW[prevGW.id];
          const currSnaps = byGW[currGW.id];

          if (prevSnaps && prevSnaps.length > 0 && currSnaps && currSnaps.length > 0) {
            recapData.push({
              gameweekId: currGW.id,
              gameweekName: currGW.name,
              lastKickoff: lastKickoffByGW[currGW.id] || null,
              currentSnapshots: currSnaps,
              previousSnapshots: prevSnaps,
              isLive: false,
              matchesPlayed: null,
              updatedAt: null,
              matches: matchesByGW[currGW.id] || []
            });
          }
        }

        // Build live recap if current GW has snapshot data
        if (currentGW && byGW[currentGW.id] && byGW[currentGW.id].length > 0) {
          // The previous GW for the live recap is the most recent finished GW
          const lastFinishedGW = sortedFinished.length > 0
            ? sortedFinished[sortedFinished.length - 1]
            : null;

          if (lastFinishedGW && byGW[lastFinishedGW.id] && byGW[lastFinishedGW.id].length > 0) {
            recapData.push({
              gameweekId: currentGW.id,
              gameweekName: currentGW.name,
              lastKickoff: null,
              currentSnapshots: byGW[currentGW.id],
              previousSnapshots: byGW[lastFinishedGW.id],
              isLive: true,
              matchesPlayed: liveMatchesPlayed,
              updatedAt: liveUpdatedAt,
              matches: matchesByGW[currentGW.id] || []
            });
          }
        }

        // Reverse so most recent is first (live GW at top), limit to 3
        if (!cancelled) {
          setRecaps(recapData.reverse().slice(0, 5));
          setLoading(false);
        }
      } catch (err) {
        console.error('Error fetching FDR movers:', err);
        if (!cancelled) {
          setError(err.message);
          setLoading(false);
        }
      }
    }

    fetchMovers();
    return () => { cancelled = true; };
  }, []);

  return { recaps, loading, error };
}
