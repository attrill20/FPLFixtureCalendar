import React from 'react';
import './GWRecapPost.css';

// Difficulty color map matching existing card.css palette
const difficultyColors = {
  1: 'rgb(159, 251, 159)',
  2: 'rgb(152, 241, 130)',
  3: 'rgb(162, 236, 143)',
  4: 'rgb(187, 219, 132)',
  5: 'rgb(223, 237, 153)',
  6: 'rgb(245, 245, 137)',
  7: 'rgb(250, 214, 143)',
  8: 'rgb(245, 189, 137)',
  9: 'rgb(240, 164, 164)',
  10: 'rgb(243, 143, 143)'
};

function getDifficultyColor(value) {
  const rounded = Math.min(10, Math.max(1, Math.round(value)));
  return difficultyColors[rounded] || difficultyColors[5];
}

/**
 * Determines the primary reasons for an FDR change by comparing individual metric deltas.
 * Each metric is evaluated independently for more specific reason text.
 */
function generateReason(current, previous, direction) {
  const factors = [];
  const up = direction === 'up';

  // Helper: only compare when both snapshots have real data for a field
  const hasBoth = (field) => current[field] != null && previous[field] != null && current[field] !== 0 && previous[field] !== 0;
  const delta = (field) => (current[field] || 0) - (previous[field] || 0);

  // Overall form
  const formDelta = hasBoth('recent_form_score') ? delta('recent_form_score') : 0;
  if (Math.abs(formDelta) > 0.1) {
    factors.push({
      magnitude: Math.abs(formDelta),
      text: up ? 'Improved overall form' : 'Declining overall form'
    });
  }

  // Goals scored per 90 — home
  const gsHomeDelta = hasBoth('home_goals_scored_per_90') ? delta('home_goals_scored_per_90') : 0;
  if (Math.abs(gsHomeDelta) > 0.05) {
    factors.push({
      magnitude: Math.abs(gsHomeDelta) * 2.5,
      text: up ? 'Scoring more goals at home' : 'Scoring less goals at home'
    });
  }

  // Goals scored per 90 — away
  const gsAwayDelta = hasBoth('away_goals_scored_per_90') ? delta('away_goals_scored_per_90') : 0;
  if (Math.abs(gsAwayDelta) > 0.05) {
    factors.push({
      magnitude: Math.abs(gsAwayDelta) * 2.5,
      text: up ? 'Scoring more goals away' : 'Scoring less goals away'
    });
  }

  // Goals conceded per 90 — home
  const gcHomeDelta = hasBoth('home_goals_conceded_per_90') ? delta('home_goals_conceded_per_90') : 0;
  if (Math.abs(gcHomeDelta) > 0.05) {
    factors.push({
      magnitude: Math.abs(gcHomeDelta) * 3,
      text: up ? 'Conceding less goals at home' : 'Conceding more goals at home'
    });
  }

  // Goals conceded per 90 — away
  const gcAwayDelta = hasBoth('away_goals_conceded_per_90') ? delta('away_goals_conceded_per_90') : 0;
  if (Math.abs(gcAwayDelta) > 0.05) {
    factors.push({
      magnitude: Math.abs(gcAwayDelta) * 3,
      text: up ? 'Conceding less goals away' : 'Conceding more goals away'
    });
  }

  // xG per 90 — home
  const xgHomeDelta = hasBoth('home_xg_per_90') ? delta('home_xg_per_90') : 0;
  if (Math.abs(xgHomeDelta) > 0.05) {
    factors.push({
      magnitude: Math.abs(xgHomeDelta) * 2,
      text: up ? 'Creating higher home xG' : 'Creating lower home xG'
    });
  }

  // xG per 90 — away
  const xgAwayDelta = hasBoth('away_xg_per_90') ? delta('away_xg_per_90') : 0;
  if (Math.abs(xgAwayDelta) > 0.05) {
    factors.push({
      magnitude: Math.abs(xgAwayDelta) * 2,
      text: up ? 'Creating higher away xG' : 'Creating lower away xG'
    });
  }

  // xGC per 90 — home
  const xgcHomeDelta = hasBoth('home_xgc_per_90') ? delta('home_xgc_per_90') : 0;
  if (Math.abs(xgcHomeDelta) > 0.05) {
    factors.push({
      magnitude: Math.abs(xgcHomeDelta) * 2,
      text: up ? 'Conceding lower home xGC' : 'Conceding higher home xGC'
    });
  }

  // xGC per 90 — away
  const xgcAwayDelta = hasBoth('away_xgc_per_90') ? delta('away_xgc_per_90') : 0;
  if (Math.abs(xgcAwayDelta) > 0.05) {
    factors.push({
      magnitude: Math.abs(xgcAwayDelta) * 2,
      text: up ? 'Conceding lower away xGC' : 'Conceding higher away xGC'
    });
  }

  // Home PPG (Last 5)
  const homePpgDelta = hasBoth('home_ppg_recent_score') ? delta('home_ppg_recent_score') : 0;
  if (Math.abs(homePpgDelta) > 0.1) {
    factors.push({
      magnitude: Math.abs(homePpgDelta) * 1.5,
      text: up ? 'Increasing home PPG (last 5)' : 'Decreasing home PPG (last 5)'
    });
  }

  // Away PPG (Last 5)
  const awayPpgDelta = hasBoth('away_ppg_recent_score') ? delta('away_ppg_recent_score') : 0;
  if (Math.abs(awayPpgDelta) > 0.1) {
    factors.push({
      magnitude: Math.abs(awayPpgDelta) * 1.5,
      text: up ? 'Better away PPG (last 5)' : 'Worse away PPG (last 5)'
    });
  }

  // Sort by magnitude and pick top 2 reasons
  factors.sort((a, b) => b.magnitude - a.magnitude);
  if (factors.length === 0) {
    return [up ? 'Small improvements across metrics' : 'Small declines across metrics'];
  }
  return factors.slice(0, 2).map(f => f.text);
}

/**
 * GWRecapPost - Displays FDR movers (top 3 risers and top 3 fallers) for a gameweek.
 *
 * Props:
 *  - currentSnapshots: array of team snapshots for the current GW
 *  - previousSnapshots: array of team snapshots for the previous GW
 *  - gameweekName: string (e.g. "Gameweek 12")
 *  - teams: teams array from dummy.js (for badges and names)
 *  - isLight: boolean for alternating background
 */
const GWRecapPost = ({ currentSnapshots, previousSnapshots, gameweekName, lastKickoff, teams, isLight, isLive, matchesPlayed, updatedAt }) => {
  // Build lookup maps by team_id
  const currMap = {};
  currentSnapshots.forEach(s => { currMap[s.team_id] = s; });
  const prevMap = {};
  previousSnapshots.forEach(s => { prevMap[s.team_id] = s; });

  // Compute total difficulty change for each team present in both snapshots
  const movers = [];
  Object.keys(currMap).forEach(teamId => {
    const tid = parseInt(teamId);
    const curr = currMap[tid];
    const prev = prevMap[tid];
    if (!curr || !prev) return;

    // Round to 1dp first so displayed values and change are consistent
    const round1 = (v) => Math.round(parseFloat(v) * 10) / 10;
    const currHome = round1(curr.home_difficulty);
    const currAway = round1(curr.away_difficulty);
    const prevHome = round1(prev.home_difficulty);
    const prevAway = round1(prev.away_difficulty);
    const change = (currHome + currAway) - (prevHome + prevAway);

    movers.push({
      team_id: tid,
      change,
      homeChange: currHome - prevHome,
      awayChange: currAway - prevAway,
      currHome,
      currAway,
      prevHome,
      prevAway,
      current: curr,
      previous: prev
    });
  });

  // Sort: risers (biggest positive change first), fallers (biggest negative change first)
  const risers = movers
    .filter(m => m.change > 0)
    .sort((a, b) => b.change - a.change)
    .slice(0, 3);

  const fallers = movers
    .filter(m => m.change < 0)
    .sort((a, b) => a.change - b.change)
    .slice(0, 3);

  // Don't render if there are no movers at all
  if (risers.length === 0 && fallers.length === 0) return null;

  const getTeam = (teamId) => teams.find(t => t.id === teamId) || { name: 'Unknown', badge: null, initial: '???' };

  const formatChange = (val) => {
    const sign = val > 0 ? '+' : '';
    return `${sign}${val.toFixed(1)}`;
  };

  const renderMoverCard = (mover, direction) => {
    const team = getTeam(mover.team_id);
    const reasons = generateReason(mover.current, mover.previous, direction);

    return (
      <div key={mover.team_id} className={`mover-card mover-${direction}`}>
        <div className="mover-card-header">
          {team.badge && (
            <img src={team.badge} alt={team.name} className="mover-badge" />
          )}
          <div className="mover-card-info">
            <span className="mover-team-name">{team.name}</span>
            <span className={`mover-change mover-change-${direction}`}>
              {direction === 'up' ? '\u25B2' : '\u25BC'} {formatChange(mover.change)}
            </span>
          </div>
        </div>
        <div className="mover-details">
          <div className="mover-difficulty-row">
            <span className="mover-venue-label">H:</span>
            <span
              className="mover-difficulty-badge"
              style={{ backgroundColor: getDifficultyColor(mover.prevHome) }}
            >
              {mover.prevHome.toFixed(1)}
            </span>
            <span className="mover-arrow">{'\u2192'}</span>
            <span
              className="mover-difficulty-badge"
              style={{ backgroundColor: getDifficultyColor(mover.currHome) }}
            >
              {mover.currHome.toFixed(1)}
            </span>
          </div>
          <div className="mover-difficulty-row">
            <span className="mover-venue-label">A:</span>
            <span
              className="mover-difficulty-badge"
              style={{ backgroundColor: getDifficultyColor(mover.prevAway) }}
            >
              {mover.prevAway.toFixed(1)}
            </span>
            <span className="mover-arrow">{'\u2192'}</span>
            <span
              className="mover-difficulty-badge"
              style={{ backgroundColor: getDifficultyColor(mover.currAway) }}
            >
              {mover.currAway.toFixed(1)}
            </span>
          </div>
        </div>
        <ul className="mover-reasons">
          {reasons.map((r, i) => (
            <li key={i} className="mover-reason">{r}</li>
          ))}
        </ul>
      </div>
    );
  };

  // Extract GW number from name (e.g. "Gameweek 12" → "12")
  const gwNumber = gameweekName ? gameweekName.replace(/\D/g, '') : '';

  // Format date string depending on live vs finished state
  const dateDisplay = (() => {
    if (isLive && updatedAt) {
      const date = new Date(updatedAt);
      const dateStr = date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
      const timeStr = date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
      return `Last updated: ${dateStr} at ${timeStr}`;
    }
    const date = lastKickoff ? new Date(lastKickoff) : new Date();
    return `Posted: ${date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}`;
  })();

  const description = isLive
    ? `Here are the biggest FDR changes during Gameweek ${gwNumber} (${matchesPlayed}/10 matches played) — updates hourly based on goals, xG, defensive record, and recent form.`
    : `Here are the biggest FDR changes following Gameweek ${gwNumber}, automatically calculated based on goals, xG, defensive record, and recent form.`;

  return (
    <section className={isLight ? 'section-light' : 'section-white'}>
      <div className="fdr-wrapper">
        <div className="fdr-heading">
          <div className="recap-title-row">
            <h2>GW{gwNumber} FDR Movers</h2>
            {isLive && <span className="recap-live-badge">LIVE</span>}
            <span className="recap-date">{dateDisplay}</span>
          </div>
          <p>{description}</p>

          <div className="movers-container">
            {risers.length > 0 && (
              <div className="movers-section">
                <h3 className="movers-section-title movers-title-up">Biggest Risers</h3>
                <div className="movers-row">
                  {risers.map(m => renderMoverCard(m, 'up'))}
                </div>
              </div>
            )}
            {fallers.length > 0 && (
              <div className="movers-section">
                <h3 className="movers-section-title movers-title-down">Biggest Fallers</h3>
                <div className="movers-row">
                  {fallers.map(m => renderMoverCard(m, 'down'))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default GWRecapPost;
