import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

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
        // Fetch finished GWs and current in-progress GW in parallel
        const [finishedResult, currentResult] = await Promise.all([
          supabase
            .from('gameweeks')
            .select('id, name')
            .eq('finished', true)
            .order('id', { ascending: false })
            .limit(4),
          supabase
            .from('gameweeks')
            .select('id, name')
            .eq('is_current', true)
            .eq('finished', false)
            .limit(1)
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

        // Fetch snapshots and kickoff times
        const [{ data: snapshots, error: snapError }, { data: kickoffs, error: koError }] = await Promise.all([
          supabase
            .from('fdr_weekly_snapshots')
            .select('*')
            .in('gameweek_id', gwIds),
          supabase
            .from('player_gameweek_stats')
            .select('gameweek_id, kickoff_time')
            .in('gameweek_id', gwIds)
            .order('kickoff_time', { ascending: false })
        ]);

        if (snapError) throw snapError;
        if (koError) throw koError;

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

        if (!snapshots || snapshots.length === 0) {
          if (!cancelled) {
            setRecaps([]);
            setLoading(false);
          }
          return;
        }

        // Group snapshots by gameweek_id
        const byGW = {};
        snapshots.forEach(s => {
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
              updatedAt: null
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
              updatedAt: liveUpdatedAt
            });
          }
        }

        // Reverse so most recent is first (live GW at top), limit to 3
        if (!cancelled) {
          setRecaps(recapData.reverse().slice(0, 3));
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
