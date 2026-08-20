import { supabase } from '../supabaseClient';
import { teams as calendarTeams } from '../components/dummyArrays/dummy';

let cachedMapPromise = null;

// Supabase's `teams.id` is reassigned by the FPL API alphabetically each season,
// so it drifts out of sync with dummy.js's ids whenever promotions/relegations
// change the alphabetical order (the sync job that would keep them aligned can
// lag or fail — see fdr_weekly_snapshots / players / player_gameweek_stats, which
// all store team references using this same stale id). Translate through the
// permanent FPL `code` so those rows always resolve to the correct club.
export function getSupaIdToLocalIdMap() {
  if (!cachedMapPromise) {
    cachedMapPromise = supabase
      .from('teams')
      .select('id, code')
      .then(({ data, error }) => {
        if (error || !data) return {};
        const codeToLocalId = {};
        calendarTeams.forEach(t => { codeToLocalId[t.code] = t.id; });
        const map = {};
        data.forEach(row => {
          if (codeToLocalId[row.code] != null) {
            map[row.id] = codeToLocalId[row.code];
          }
        });
        return map;
      });
  }
  return cachedMapPromise;
}
