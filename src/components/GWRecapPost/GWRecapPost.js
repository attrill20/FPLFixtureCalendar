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
 * Determines the primary reason for an FDR change by comparing metric deltas.
 */
function generateReason(current, previous, direction) {
  const factors = [];

  // Form change
  const formDelta = (current.recent_form_score || 0) - (previous.recent_form_score || 0);
  if (Math.abs(formDelta) > 0.1) {
    factors.push({
      magnitude: Math.abs(formDelta),
      text: direction === 'up'
        ? 'Improved recent form'
        : 'Declining recent form'
    });
  }

  // Goals conceded change (higher = leakier defence = easier to attack)
  const gcHomeDelta = (current.home_goals_conceded_per_90 || 0) - (previous.home_goals_conceded_per_90 || 0);
  const gcAwayDelta = (current.away_goals_conceded_per_90 || 0) - (previous.away_goals_conceded_per_90 || 0);
  const gcAvgDelta = (gcHomeDelta + gcAwayDelta) / 2;
  if (Math.abs(gcAvgDelta) > 0.05) {
    factors.push({
      magnitude: Math.abs(gcAvgDelta) * 3, // Weight defence changes
      text: direction === 'up'
        ? 'Tighter defence'
        : 'Leakier defence'
    });
  }

  // Goals scored change
  const gsHomeDelta = (current.home_goals_scored_per_90 || 0) - (previous.home_goals_scored_per_90 || 0);
  const gsAwayDelta = (current.away_goals_scored_per_90 || 0) - (previous.away_goals_scored_per_90 || 0);
  const gsAvgDelta = (gsHomeDelta + gsAwayDelta) / 2;
  if (Math.abs(gsAvgDelta) > 0.05) {
    factors.push({
      magnitude: Math.abs(gsAvgDelta) * 2.5,
      text: direction === 'up'
        ? 'More attacking threat'
        : 'Less attacking threat'
    });
  }

  // xG / xGC changes
  const xgHomeDelta = (current.home_xg_per_90 || 0) - (previous.home_xg_per_90 || 0);
  const xgAwayDelta = (current.away_xg_per_90 || 0) - (previous.away_xg_per_90 || 0);
  const xgcHomeDelta = (current.home_xgc_per_90 || 0) - (previous.home_xgc_per_90 || 0);
  const xgcAwayDelta = (current.away_xgc_per_90 || 0) - (previous.away_xgc_per_90 || 0);
  const xgAvg = Math.abs((xgHomeDelta + xgAwayDelta + xgcHomeDelta + xgcAwayDelta) / 4);
  if (xgAvg > 0.05) {
    factors.push({
      magnitude: xgAvg * 2,
      text: direction === 'up'
        ? 'Better underlying numbers'
        : 'Worse underlying numbers'
    });
  }

  // Sort by magnitude and pick top 2 reasons
  factors.sort((a, b) => b.magnitude - a.magnitude);
  if (factors.length === 0) {
    return [direction === 'up' ? 'Marginal improvements across metrics' : 'Marginal decline across metrics'];
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
const GWRecapPost = ({ currentSnapshots, previousSnapshots, gameweekName, teams, isLight }) => {
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

    const currTotal = parseFloat(curr.home_difficulty) + parseFloat(curr.away_difficulty);
    const prevTotal = parseFloat(prev.home_difficulty) + parseFloat(prev.away_difficulty);
    const change = currTotal - prevTotal;

    movers.push({
      team_id: tid,
      change,
      homeChange: parseFloat(curr.home_difficulty) - parseFloat(prev.home_difficulty),
      awayChange: parseFloat(curr.away_difficulty) - parseFloat(prev.away_difficulty),
      currHome: parseFloat(curr.home_difficulty),
      currAway: parseFloat(curr.away_difficulty),
      prevHome: parseFloat(prev.home_difficulty),
      prevAway: parseFloat(prev.away_difficulty),
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

  // Format the posted date from the snapshot's created_at, or fall back to now
  const postedDate = (() => {
    const timestamp = currentSnapshots[0]?.created_at;
    const date = timestamp ? new Date(timestamp) : new Date();
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  })();

  return (
    <section className={isLight ? 'section-light' : 'section-white'}>
      <div className="fdr-wrapper">
        <div className="fdr-heading">
          <div className="recap-title-row">
            <h2>GW{gwNumber} FDR Movers</h2>
            <span className="recap-date">Posted: <strong>{postedDate}</strong></span>
          </div>
          <p>Here are the biggest FDR changes following Gameweek {gwNumber}, automatically calculated based on goals, xG, defensive record, and recent form.</p>

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
