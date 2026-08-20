import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { getSupaIdToLocalIdMap } from '../utils/teamIdMap';

/**
 * Fetches the latest mid-season update and its associated FDR snapshots.
 * Returns snapshot data for the baseline and current gameweeks so the
 * GWRecapPost component can compute movers over the break period.
 */
export function useMidSeasonUpdate() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchMidSeasonUpdate() {
      try {
        // Get latest mid-season update
        const { data: updates, error: updateError } = await supabase
          .from('mid_season_updates')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(1);

        if (updateError) throw updateError;

        if (!updates || updates.length === 0) {
          if (!cancelled) {
            setData(null);
            setLoading(false);
          }
          return;
        }

        const update = updates[0];

        // Fetch snapshots, gameweek names, and the stale-Supabase-id -> this-season's-
        // dummy.js-id translation map in parallel
        const [
          { data: baselineSnapshots, error: bsError },
          { data: currentSnapshots, error: csError },
          { data: baselineGW, error: bgError },
          { data: currentGW, error: cgError },
          idMap
        ] = await Promise.all([
          supabase
            .from('fdr_weekly_snapshots')
            .select('*')
            .eq('gameweek_id', update.baseline_gameweek_id),
          supabase
            .from('fdr_weekly_snapshots')
            .select('*')
            .eq('gameweek_id', update.current_gameweek_id),
          supabase
            .from('gameweeks')
            .select('id, name')
            .eq('id', update.baseline_gameweek_id)
            .single(),
          supabase
            .from('gameweeks')
            .select('id, name')
            .eq('id', update.current_gameweek_id)
            .single(),
          getSupaIdToLocalIdMap()
        ]);

        if (bsError) throw bsError;
        if (csError) throw csError;
        if (bgError) throw bgError;
        if (cgError) throw cgError;

        if (!baselineSnapshots?.length || !currentSnapshots?.length) {
          if (!cancelled) {
            setData(null);
            setLoading(false);
          }
          return;
        }

        // Translate snapshot team_ids from Supabase's stale season-numbering to this
        // season's dummy.js ids; drop rows for clubs no longer in the league
        const translateSnapshots = (rows) => rows
          .map(s => ({ ...s, team_id: idMap[s.team_id] }))
          .filter(s => s.team_id != null);

        if (!cancelled) {
          setData({
            update,
            baselineSnapshots: translateSnapshots(baselineSnapshots),
            currentSnapshots: translateSnapshots(currentSnapshots),
            baselineGWName: baselineGW.name,
            currentGWName: currentGW.name
          });
          setLoading(false);
        }
      } catch (err) {
        console.error('Error fetching mid-season update:', err);
        if (!cancelled) {
          setError(err.message);
          setLoading(false);
        }
      }
    }

    fetchMidSeasonUpdate();
    return () => { cancelled = true; };
  }, []);

  return { data, loading, error };
}
