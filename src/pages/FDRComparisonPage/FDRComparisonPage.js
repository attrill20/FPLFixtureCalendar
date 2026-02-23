import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { teams as calendarTeams } from '../../components/dummyArrays/dummy';
import './FDRComparisonPage.css';

const badgeMap = {
  'ARS': require('../../components/badges/ARSbadge.png'),
  'AVL': require('../../components/badges/AVLbadge.png'),
  'BOU': require('../../components/badges/BOUbadge.png'),
  'BRE': require('../../components/badges/BREbadge.png'),
  'BHA': require('../../components/badges/BHAbadge.png'),
  'CHE': require('../../components/badges/CHEbadge.png'),
  'CRY': require('../../components/badges/CRYbadge.png'),
  'EVE': require('../../components/badges/EVEbadge.png'),
  'FUL': require('../../components/badges/FULbadge.png'),
  'IPS': require('../../components/badges/IPSbadge.png'),
  'LEI': require('../../components/badges/LEIbadge.png'),
  'LIV': require('../../components/badges/LIVbadge2.png'),
  'MCI': require('../../components/badges/MCIbadge.png'),
  'MUN': require('../../components/badges/MUNbadge.png'),
  'NEW': require('../../components/badges/NEWbadge.png'),
  'NFO': require('../../components/badges/NFObadge.png'),
  'SOU': require('../../components/badges/SOUbadge.png'),
  'TOT': require('../../components/badges/TOTbadge.png'),
  'WHU': require('../../components/badges/WHUbadge.png'),
  'WOL': require('../../components/badges/WOLbadge.png'),
  'SUN': require('../../components/badges/SUNbadge.png'),
  'LEE': require('../../components/badges/LEEbadge.png'),
  'BUR': require('../../components/badges/BURbadge.png'),
  'LUT': require('../../components/badges/LUTbadge.png'),
  'SHU': require('../../components/badges/SHUbadge.png'),
};

const getDisplayName = (team) => calendarTeams[team.id]?.name || team.name;

const formatRaw = (value, suffix = ' per 90', decimals = 2) => {
  if (value == null) return '—';
  return `${parseFloat(value).toFixed(decimals)}${suffix}`;
};

const BreakdownContent = ({ team, getDifficultyClass, isMobile }) => {
  const homeMetrics = [
    { label: 'Goals Scored', score: team.home_goals_scored_per_90_score, raw: team.home_goals_scored_per_90, suffix: ' per 90' },
    { label: 'xG', score: team.home_xg_per_90_score, raw: team.home_xg_per_90, suffix: ' per 90' },
    { label: 'Goals Conceded', score: team.home_goals_conceded_per_90_score, raw: team.home_goals_conceded_per_90, suffix: ' per 90' },
    { label: 'xGC', score: team.home_xgc_per_90_score, raw: team.home_xgc_per_90, suffix: ' per 90' },
    { label: 'Overall Form', score: team.recent_form_score, raw: team.recent_form, suffix: '' },
    { label: 'Home PPG (Last 5)', mobileLabel: 'Home PPG', score: team.home_ppg_recent_score, raw: team.home_ppg_recent, suffix: ' points', decimals: 0 },
  ];

  const awayMetrics = [
    { label: 'Goals Scored', score: team.away_goals_scored_per_90_score, raw: team.away_goals_scored_per_90, suffix: ' per 90' },
    { label: 'xG', score: team.away_xg_per_90_score, raw: team.away_xg_per_90, suffix: ' per 90' },
    { label: 'Goals Conceded', score: team.away_goals_conceded_per_90_score, raw: team.away_goals_conceded_per_90, suffix: ' per 90' },
    { label: 'xGC', score: team.away_xgc_per_90_score, raw: team.away_xgc_per_90, suffix: ' per 90' },
    { label: 'Overall Form', score: team.recent_form_score, raw: team.recent_form, suffix: '' },
    { label: 'Away PPG (Last 5)', mobileLabel: 'Away PPG', score: team.away_ppg_recent_score, raw: team.away_ppg_recent, suffix: ' points', decimals: 0 },
  ];

  const renderTile = (m) => (
    <div className="metric-tile">
      <span className="metric-tile-label">{isMobile && m.mobileLabel ? m.mobileLabel : m.label}</span>
      <span className={`metric-score ${m.score != null ? getDifficultyClass(m.score) : ''}`}>
        {m.score != null ? Math.round(m.score) : '—'}
      </span>
      <span className="metric-raw">{formatRaw(m.raw, m.suffix, m.decimals)}</span>
    </div>
  );

  return { homeMetrics, awayMetrics, renderTile };
};

const FDRComparisonPage = () => {
  const [oracleRatings, setOracleRatings] = useState([]);
  const [fplRatings, setFplRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [sortBy, setSortBy] = useState('name'); // 'name', 'homeDiff', 'awayDiff', 'totalDiff'
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'
  const [expandedTeams, setExpandedTeams] = useState(new Set());
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleBreakdown = (teamId) => {
    setExpandedTeams(prev => {
      const next = new Set(prev);
      if (next.has(teamId)) next.delete(teamId);
      else next.add(teamId);
      return next;
    });
  };

  useEffect(() => {
    fetchRatings();
  }, []);

  const fetchRatings = async () => {
    setLoading(true);

    try {
      // Get team info and FPL ratings from teams table
      const { data: teamsData, error: teamsError } = await supabase
        .from('teams')
        .select('id, name, short_name, fpl_home_difficulty, fpl_away_difficulty, updated_at')
        .order('name');

      // Get Oracle FDR from team_fdr_calculations (full decimal precision + metric breakdowns)
      const { data: fdrData, error: fdrError } = await supabase
        .from('team_fdr_calculations')
        .select('team_id, home_difficulty, away_difficulty, home_goals_scored_per_90, home_goals_scored_per_90_score, home_goals_conceded_per_90, home_goals_conceded_per_90_score, home_xg_per_90, home_xg_per_90_score, home_xgc_per_90, home_xgc_per_90_score, away_goals_scored_per_90, away_goals_scored_per_90_score, away_goals_conceded_per_90, away_goals_conceded_per_90_score, away_xg_per_90, away_xg_per_90_score, away_xgc_per_90, away_xgc_per_90_score, recent_form, recent_form_score, home_ppg_recent, home_ppg_recent_score, away_ppg_recent, away_ppg_recent_score');

      if (teamsError) {
        console.error('Error fetching teams:', teamsError);
      } else if (fdrError) {
        console.error('Error fetching FDR calculations:', fdrError);
      } else {
        // Merge Oracle FDR decimals + metric breakdowns into team data
        const oracleData = (teamsData || []).map(team => {
          const fdr = (fdrData || []).find(f => f.team_id === team.id);
          return {
            ...team,
            home_difficulty: fdr ? parseFloat(fdr.home_difficulty) : 5,
            away_difficulty: fdr ? parseFloat(fdr.away_difficulty) : 5,
            // Metric breakdowns
            home_goals_scored_per_90: fdr?.home_goals_scored_per_90,
            home_goals_scored_per_90_score: fdr?.home_goals_scored_per_90_score,
            home_goals_conceded_per_90: fdr?.home_goals_conceded_per_90,
            home_goals_conceded_per_90_score: fdr?.home_goals_conceded_per_90_score,
            home_xg_per_90: fdr?.home_xg_per_90,
            home_xg_per_90_score: fdr?.home_xg_per_90_score,
            home_xgc_per_90: fdr?.home_xgc_per_90,
            home_xgc_per_90_score: fdr?.home_xgc_per_90_score,
            away_goals_scored_per_90: fdr?.away_goals_scored_per_90,
            away_goals_scored_per_90_score: fdr?.away_goals_scored_per_90_score,
            away_goals_conceded_per_90: fdr?.away_goals_conceded_per_90,
            away_goals_conceded_per_90_score: fdr?.away_goals_conceded_per_90_score,
            away_xg_per_90: fdr?.away_xg_per_90,
            away_xg_per_90_score: fdr?.away_xg_per_90_score,
            away_xgc_per_90: fdr?.away_xgc_per_90,
            away_xgc_per_90_score: fdr?.away_xgc_per_90_score,
            recent_form: fdr?.recent_form,
            recent_form_score: fdr?.recent_form_score,
            home_ppg_recent: fdr?.home_ppg_recent,
            home_ppg_recent_score: fdr?.home_ppg_recent_score,
            away_ppg_recent: fdr?.away_ppg_recent,
            away_ppg_recent_score: fdr?.away_ppg_recent_score,
          };
        });
        setOracleRatings(oracleData);
        setLastUpdated(teamsData[0]?.updated_at);

        // FPL FDR (double 1-5 scale to get 2-10)
        const fplTeams = (teamsData || []).map(team => ({
          id: team.id,
          name: team.name,
          home_difficulty: (team.fpl_home_difficulty || 3) * 2,
          away_difficulty: (team.fpl_away_difficulty || 3) * 2
        }));
        setFplRatings(fplTeams);
      }

    } catch (error) {
      console.error('Error loading ratings:', error);
    } finally {
      setLoading(false);
    }
  };


  const getDifficultyClass = (rating) => {
    // Match calendar page Oracle FDR colour scheme (1-10 scale)
    const roundedRating = Math.round(rating);
    return `custom-difficulty-${Math.max(1, Math.min(10, roundedRating))}`;
  };

  const getDiffClass = (diff) => {
    // Colour scale based on absolute difference (rounds to nearest integer)
    const absDiff = Math.abs(diff);
    if (absDiff < 0.5) return 'diff-0';
    if (absDiff < 1.5) return 'diff-1';
    if (absDiff < 2.5) return 'diff-2';
    if (absDiff < 3.5) return 'diff-3';
    if (absDiff < 4.5) return 'diff-4';
    return 'diff-5-plus';
  };

  const calculateStats = () => {
    if (oracleRatings.length === 0 || fplRatings.length === 0) {
      return { avgDiff: 0, matchCount: 0, closeMatches: 0, totalComparisons: 0 };
    }

    let totalDiff = 0;
    let matchCount = 0;
    let closeMatches = 0;
    let bigDiscrepancies = 0;
    let totalComparisons = 0;

    oracleRatings.forEach(oracle => {
      const fpl = fplRatings.find(f => f.id === oracle.id);
      if (fpl) {
        const homeDiff = Math.abs(oracle.home_difficulty - fpl.home_difficulty);
        const awayDiff = Math.abs(oracle.away_difficulty - fpl.away_difficulty);

        totalDiff += homeDiff + awayDiff;
        if (homeDiff === 0) matchCount++;
        if (awayDiff === 0) matchCount++;
        if (homeDiff <= 1) closeMatches++;
        if (awayDiff <= 1) closeMatches++;
        if (homeDiff > 2) bigDiscrepancies++;
        if (awayDiff > 2) bigDiscrepancies++;
        totalComparisons += 2;
      }
    });

    return {
      avgDiff: totalComparisons > 0 ? (totalDiff / totalComparisons).toFixed(2) : 0,
      matchCount,
      closeMatches,
      bigDiscrepancies,
      totalComparisons,
      matchRate: totalComparisons > 0 ? ((matchCount / totalComparisons) * 100).toFixed(1) : 0,
      closeMatchRate: totalComparisons > 0 ? ((closeMatches / totalComparisons) * 100).toFixed(1) : 0,
      bigDiscrepancyRate: totalComparisons > 0 ? ((bigDiscrepancies / totalComparisons) * 100).toFixed(1) : 0
    };
  };

  const getTeamExtremes = () => {
    if (oracleRatings.length === 0 || fplRatings.length === 0) return {};

    let mostOverratedHome = null;
    let mostUnderratedHome = null;
    let mostOverratedAway = null;
    let mostUnderratedAway = null;

    oracleRatings.forEach(oracle => {
      const fpl = fplRatings.find(f => f.id === oracle.id);
      if (!fpl) return;

      const homeDiff = parseFloat((fpl.home_difficulty - oracle.home_difficulty).toFixed(1));
      const awayDiff = parseFloat((fpl.away_difficulty - oracle.away_difficulty).toFixed(1));
      const team = { ...oracle, homeDiff, awayDiff };

      if (!mostOverratedHome || homeDiff > mostOverratedHome.homeDiff) mostOverratedHome = team;
      if (!mostUnderratedHome || homeDiff < mostUnderratedHome.homeDiff) mostUnderratedHome = team;
      if (!mostOverratedAway || awayDiff > mostOverratedAway.awayDiff) mostOverratedAway = team;
      if (!mostUnderratedAway || awayDiff < mostUnderratedAway.awayDiff) mostUnderratedAway = team;
    });

    return { mostOverratedHome, mostUnderratedHome, mostOverratedAway, mostUnderratedAway };
  };

  const stats = calculateStats();
  const arsenalHome = (() => { const ars = oracleRatings.find(t => t.short_name === 'ARS'); return ars ? Number(ars.home_difficulty).toFixed(1) : '...'; })();

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder(column === 'name' ? 'asc' : 'desc');
    }
  };

  const sortArrow = (column) => {
    const isActive = sortBy === column;
    const icon = isActive ? (sortOrder === 'asc' ? '▲' : '▼') : '↕';
    return <span className={`sort-icon ${isActive ? 'active' : ''}`}>{icon}</span>;
  };

  const getSortedTeams = () => {
    const teamsWithDiffs = oracleRatings.map(oracle => {
      const fpl = fplRatings.find(f => f.id === oracle.id);
      if (!fpl) return null;

      const homeDiffSigned = fpl.home_difficulty - oracle.home_difficulty;
      const awayDiffSigned = fpl.away_difficulty - oracle.away_difficulty;
      const homeDiff = Math.abs(homeDiffSigned);
      const awayDiff = Math.abs(awayDiffSigned);
      const totalDiff = homeDiff + awayDiff;

      return {
        ...oracle,
        fpl,
        homeDiff,
        homeDiffSigned,
        awayDiff,
        awayDiffSigned,
        totalDiff
      };
    }).filter(Boolean);

    return teamsWithDiffs.sort((a, b) => {
      let compareValue = 0;

      switch (sortBy) {
        case 'name':
          compareValue = a.name.localeCompare(b.name);
          break;
        case 'fplHome':
          compareValue = a.fpl.home_difficulty - b.fpl.home_difficulty;
          break;
        case 'oracleHome':
          compareValue = a.home_difficulty - b.home_difficulty;
          break;
        case 'homeDiff':
          compareValue = a.homeDiffSigned - b.homeDiffSigned;
          break;
        case 'fplAway':
          compareValue = a.fpl.away_difficulty - b.fpl.away_difficulty;
          break;
        case 'oracleAway':
          compareValue = a.away_difficulty - b.away_difficulty;
          break;
        case 'awayDiff':
          compareValue = a.awayDiffSigned - b.awayDiffSigned;
          break;
        case 'totalDiff':
          compareValue = a.totalDiff - b.totalDiff;
          break;
        default:
          compareValue = 0;
      }

      return sortOrder === 'asc' ? compareValue : -compareValue;
    });
  };

  const sortedTeams = getSortedTeams();

  const calculateAverages = () => {
    if (sortedTeams.length === 0) {
      return {
        avgFplHome: 0,
        avgOracleHome: 0,
        avgHomeDiff: 0,
        avgFplAway: 0,
        avgOracleAway: 0,
        avgAwayDiff: 0
      };
    }

    let totalFplHome = 0;
    let totalOracleHome = 0;
    let totalFplAway = 0;
    let totalOracleAway = 0;

    sortedTeams.forEach(team => {
      totalFplHome += team.fpl.home_difficulty;
      totalOracleHome += team.home_difficulty;
      totalFplAway += team.fpl.away_difficulty;
      totalOracleAway += team.away_difficulty;
    });

    const count = sortedTeams.length;

    const avgFplHome = totalFplHome / count;
    const avgOracleHome = totalOracleHome / count;
    const avgFplAway = totalFplAway / count;
    const avgOracleAway = totalOracleAway / count;

    return {
      avgFplHome: avgFplHome.toFixed(1),
      avgOracleHome: avgOracleHome.toFixed(1),
      avgHomeDiff: (avgFplHome - avgOracleHome).toFixed(1),
      avgFplAway: avgFplAway.toFixed(1),
      avgOracleAway: avgOracleAway.toFixed(1),
      avgAwayDiff: (avgFplAway - avgOracleAway).toFixed(1)
    };
  };

  const averages = calculateAverages();

  if (loading) {
    return (
      <div className="fdr-comparison-page">
        <div className="loading">Loading FDR comparison data...</div>
      </div>
    );
  }

  return (
    <div className="fdr-comparison-page">
      <div className="comparison-info">
        <p className="description">
          The table below compare the two difficulty rating systems (all on 1-10 scale):
          <strong> FPL Official</strong> (doubled from 1-5) and
          <strong> Oracle FDR</strong> (automatically generated from home / away underlying data).
        </p>
        <p className="description">
          <strong>Home Strength</strong> is a measure of how tough a team is when they are playing at home, <strong>Away Strength</strong> is their strength when they are playing on the road. The values on the Fixture Difficulty Calendar are reversed to show the fixture difficulty — e.g. Arsenal have a <strong>Home Strength: {arsenalHome}</strong>, so a team playing away at Arsenal would show as <strong>FDR: {arsenalHome} (A)</strong> for this fixture.
        </p>

        {lastUpdated && (
          <p className="last-updated">
            Oracle FDR last updated: {new Date(lastUpdated).toLocaleString()}
          </p>
        )}

        <div className="stats-summary">
          <div className="stat-box">
            <div className="stat-label">FPL v Oracle</div>
            <div className="stat-value">{parseFloat(stats.avgDiff) > 0 ? `+${stats.avgDiff}` : stats.avgDiff}</div>
            <div className="stat-subtitle">average difference</div>
          </div>
          <div className="stat-box">
            <div className="stat-label">Exact Matches</div>
            <div className="stat-value">{stats.matchCount}/{stats.totalComparisons}</div>
            <div className="stat-subtitle">{stats.matchRate}% exact matches</div>
          </div>
          <div className="stat-box">
            <div className="stat-label">Close Matches</div>
            <div className="stat-value">{stats.closeMatches}/{stats.totalComparisons}</div>
            <div className="stat-subtitle">{stats.closeMatchRate}% within ±1 </div>
          </div>
          <div className="stat-box">
            <div className="stat-label">Big Discrepancies</div>
            <div className="stat-value">{stats.bigDiscrepancies}/{stats.totalComparisons}</div>
            <div className="stat-subtitle">{stats.bigDiscrepancyRate}% with &gt;2.0 diff</div>
          </div>
        </div>

        {(() => {
          const extremes = getTeamExtremes();
          const badges = [
            { key: 'overratedHome', label: 'Most Overrated Home', team: extremes.mostOverratedHome, diff: extremes.mostOverratedHome?.homeDiff, type: 'overrated' },
            { key: 'underratedHome', label: 'Most Underrated Home', team: extremes.mostUnderratedHome, diff: extremes.mostUnderratedHome?.homeDiff, type: 'underrated' },
            { key: 'overratedAway', label: 'Most Overrated Away', team: extremes.mostOverratedAway, diff: extremes.mostOverratedAway?.awayDiff, type: 'overrated' },
            { key: 'underratedAway', label: 'Most Underrated Away', team: extremes.mostUnderratedAway, diff: extremes.mostUnderratedAway?.awayDiff, type: 'underrated' },
          ];
          return (
            <div className="badge-stats">
              {badges.map(({ key, label, team, diff, type }) => team && (
                <div key={key} className={`badge-stat-box ${type}`}>
                  <img src={badgeMap[team.short_name]} alt={team.name} />
                  <div className="badge-stat-info">
                    <div className="badge-stat-label">{label}</div>
                    <div className="badge-stat-team">{getDisplayName(team)}</div>
                    <div className={`badge-stat-diff ${type}`}>
                      {diff > 0 ? `+${diff}` : diff}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          );
        })()}
      </div>

      <div className="comparison-table-container">
        <table className="comparison-table">
          <colgroup>
            <col className="col-team" />
            <col className="col-data" />
            <col className="col-data" />
            <col className="col-data" />
            <col className="col-data" />
            <col className="col-data" />
            <col className="col-data" />
          </colgroup>
          <thead>
            <tr>
              <th rowSpan="2" onClick={() => handleSort('name')} className="sortable">
                Team{sortArrow('name')}
              </th>
              <th colSpan="3" className="home-section">Home Strength</th>
              <th colSpan="3" className="away-section">Away Strength</th>
            </tr>
            <tr>
              <th className="home-section sortable" onClick={() => handleSort('fplHome')}>
                FPL{sortArrow('fplHome')}
              </th>
              <th className="home-section sortable" onClick={() => handleSort('oracleHome')}>
                Oracle{sortArrow('oracleHome')}
              </th>
              <th className="home-section sortable" onClick={() => handleSort('homeDiff')}>
                Diff{sortArrow('homeDiff')}
              </th>
              <th className="away-section sortable" onClick={() => handleSort('fplAway')}>
                FPL{sortArrow('fplAway')}
              </th>
              <th className="away-section sortable" onClick={() => handleSort('oracleAway')}>
                Oracle{sortArrow('oracleAway')}
              </th>
              <th className="away-section sortable" onClick={() => handleSort('awayDiff')}>
                Diff{sortArrow('awayDiff')}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedTeams.map((team) => {
              const homeDiffSigned = parseFloat((team.fpl.home_difficulty - team.home_difficulty).toFixed(1));
              const awayDiffSigned = parseFloat((team.fpl.away_difficulty - team.away_difficulty).toFixed(1));
              const isExpanded = expandedTeams.has(team.id);

              return (
                <React.Fragment key={team.id}>
                  <tr className={isExpanded ? 'expanded-team-row' : ''}>
                    <td className="team-name clickable" onClick={() => toggleBreakdown(team.id)}>
                      {badgeMap[team.short_name] && (
                        <img className="table-team-badge" src={badgeMap[team.short_name]} alt={team.name} />
                      )}
                      <span className="team-name-text">{getDisplayName(team)}</span>
                      <span className={`expand-arrow ${isExpanded ? 'expanded' : ''}`}>&#9662;</span>
                    </td>

                    {/* Home ratings */}
                    <td className={`rating home-section ${getDifficultyClass(team.fpl.home_difficulty)}`}>
                      {team.fpl.home_difficulty}
                    </td>
                    <td
                      className={`rating home-section clickable ${getDifficultyClass(team.home_difficulty)}`}
                      onClick={() => toggleBreakdown(team.id)}
                      title="Click to see breakdown"
                    >
                      {Number(team.home_difficulty).toFixed(1)}
                      <span className={`expand-arrow rating-arrow ${isExpanded ? 'expanded' : ''}`}>&#9662;</span>
                    </td>
                    <td className={`diff home-section ${getDiffClass(homeDiffSigned)}`}>
                      {homeDiffSigned > 0 ? `+${homeDiffSigned}` : homeDiffSigned}
                    </td>

                    {/* Away ratings */}
                    <td className={`rating away-section ${getDifficultyClass(team.fpl.away_difficulty)}`}>
                      {team.fpl.away_difficulty}
                    </td>
                    <td
                      className={`rating away-section clickable ${getDifficultyClass(team.away_difficulty)}`}
                      onClick={() => toggleBreakdown(team.id)}
                      title="Click to see breakdown"
                    >
                      {Number(team.away_difficulty).toFixed(1)}
                      <span className={`expand-arrow rating-arrow ${isExpanded ? 'expanded' : ''}`}>&#9662;</span>
                    </td>
                    <td className={`diff away-section ${getDiffClass(awayDiffSigned)}`}>
                      {awayDiffSigned > 0 ? `+${awayDiffSigned}` : awayDiffSigned}
                    </td>
                  </tr>
                  {isExpanded && (() => {
                    const { homeMetrics, awayMetrics, renderTile } = BreakdownContent({ team, getDifficultyClass, isMobile });
                    return (
                      <tr className="breakdown-row">
                        <td className="breakdown-cell breakdown-team-cell">
                          <div className="breakdown-summary">
                            <div className="summary-line">
                              <span className="summary-label">{isMobile ? 'Home:' : 'Home Strength:'}</span>
                              <span className={`summary-score ${getDifficultyClass(team.home_difficulty)}`}>
                                {Number(team.home_difficulty).toFixed(1)}
                              </span>
                            </div>
                            <div className="summary-line">
                              <span className="summary-label">{isMobile ? 'Away:' : 'Away Strength:'}</span>
                              <span className={`summary-score ${getDifficultyClass(team.away_difficulty)}`}>
                                {Number(team.away_difficulty).toFixed(1)}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td colSpan="3" className="breakdown-cell breakdown-home-cell">
                          <div className="breakdown-side">
                            {homeMetrics.map((m, i) => <React.Fragment key={i}>{renderTile(m)}</React.Fragment>)}
                          </div>
                        </td>
                        <td colSpan="3" className="breakdown-cell breakdown-away-cell">
                          <div className="breakdown-side">
                            {awayMetrics.map((m, i) => <React.Fragment key={i}>{renderTile(m)}</React.Fragment>)}
                          </div>
                        </td>
                      </tr>
                    );
                  })()}
                </React.Fragment>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="totals-row">
              <td className="team-name"><strong>Average</strong></td>

              {/* Home averages */}
              <td className="rating home-section">
                <strong>{averages.avgFplHome}</strong>
              </td>
              <td className="rating home-section">
                <strong>{averages.avgOracleHome}</strong>
              </td>
              <td className="diff home-section">
                <strong>{parseFloat(averages.avgHomeDiff) > 0 ? `+${averages.avgHomeDiff}` : averages.avgHomeDiff}</strong>
              </td>

              {/* Away averages */}
              <td className="rating away-section">
                <strong>{averages.avgFplAway}</strong>
              </td>
              <td className="rating away-section">
                <strong>{averages.avgOracleAway}</strong>
              </td>
              <td className="diff away-section">
                <strong>{parseFloat(averages.avgAwayDiff) > 0 ? `+${averages.avgAwayDiff}` : averages.avgAwayDiff}</strong>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default FDRComparisonPage;
