import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

/**
 * Fetches FDR weekly snapshots and computes week-over-week movers.
 * Returns up to 3 gameweeks of recap data (needs 4 snapshots to compute 3 diffs).
 */
export function useFDRMovers() {
  const [recaps, setRecaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchMovers() {
      try {
        // Get the last 4 finished gameweeks (to produce up to 3 diffs)
        const { data: recentGWs, error: gwError } = await supabase
          .from('gameweeks')
          .select('id, name')
          .eq('finished', true)
          .order('id', { ascending: false })
          .limit(4);

        if (gwError) throw gwError;
        if (!recentGWs || recentGWs.length < 2) {
          // Need at least 2 gameweeks to compute a diff
          if (!cancelled) {
            setRecaps([]);
            setLoading(false);
          }
          return;
        }

        // Fetch snapshots for those gameweeks
        const gwIds = recentGWs.map(gw => gw.id);
        const { data: snapshots, error: snapError } = await supabase
          .from('fdr_weekly_snapshots')
          .select('*')
          .in('gameweek_id', gwIds);

        if (snapError) throw snapError;
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

        // Sort GWs ascending (oldest first) so we can pair consecutive ones
        const sortedGWs = recentGWs.sort((a, b) => a.id - b.id);

        // Build recap pairs (previous → current)
        const recapData = [];
        for (let i = 1; i < sortedGWs.length; i++) {
          const prevGW = sortedGWs[i - 1];
          const currGW = sortedGWs[i];
          const prevSnaps = byGW[prevGW.id];
          const currSnaps = byGW[currGW.id];

          // Both GWs must have snapshot data
          if (prevSnaps && prevSnaps.length > 0 && currSnaps && currSnaps.length > 0) {
            recapData.push({
              gameweekId: currGW.id,
              gameweekName: currGW.name,
              currentSnapshots: currSnaps,
              previousSnapshots: prevSnaps
            });
          }
        }

        // Reverse so most recent is first, limit to 3
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
