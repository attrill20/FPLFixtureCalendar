import React, { useState, useEffect } from 'react';
import { supabase } from "../../supabaseClient";
import "./TeamsPage.css";

const TeamsPage = ({ teams }) => {
  const [teamStats, setTeamStats] = useState({});
  const [homeStats, setHomeStats] = useState({});
  const [awayStats, setAwayStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeamStats = async () => {
      setLoading(true);
      try {
        // Fetch all team stats from Supabase
        const [overallResult, homeResult, awayResult] = await Promise.all([
          supabase.rpc('get_team_xg_stats'),
          supabase.rpc('get_team_home_stats'),
          supabase.rpc('get_team_away_stats')
        ]);

        if (overallResult.error) {
          console.error('Error fetching team stats:', overallResult.error);
          return;
        }

        // Convert overall stats to object keyed by team_id
        const statsMap = {};
        overallResult.data.forEach(stat => {
          const team = teams.find(t => t.id === stat.team_id);
          if (team) {
            statsMap[stat.team_id] = {
              teamName: stat.team_name,
              badge: team.badge,
              totalXG: parseFloat(stat.total_xg) || 0,
              totalXGC: parseFloat(stat.total_xgc) || 0,
              totalGoals: stat.total_goals || 0,
              totalConceded: stat.total_goals_conceded || 0,
            };
          }
        });

        // Convert home stats to object keyed by team_id
        const homeStatsMap = {};
        if (!homeResult.error && homeResult.data) {
          homeResult.data.forEach(stat => {
            const team = teams.find(t => t.id === stat.team_id);
            if (team) {
              homeStatsMap[stat.team_id] = {
                teamName: stat.team_name,
                badge: team.badge,
                xg: parseFloat(stat.total_xg) || 0,
                xgc: parseFloat(stat.total_xgc) || 0,
                goals: stat.total_goals || 0,
                conceded: stat.total_goals_conceded || 0,
              };
            }
          });
        }

        // Convert away stats to object keyed by team_id
        const awayStatsMap = {};
        if (!awayResult.error && awayResult.data) {
          awayResult.data.forEach(stat => {
            const team = teams.find(t => t.id === stat.team_id);
            if (team) {
              awayStatsMap[stat.team_id] = {
                teamName: stat.team_name,
                badge: team.badge,
                xg: parseFloat(stat.total_xg) || 0,
                xgc: parseFloat(stat.total_xgc) || 0,
                goals: stat.total_goals || 0,
                conceded: stat.total_goals_conceded || 0,
              };
            }
          });
        }

        setTeamStats(statsMap);
        setHomeStats(homeStatsMap);
        setAwayStats(awayStatsMap);
      } catch (error) {
        console.error('Failed to fetch team stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamStats();
  }, [teams]);

  const allTeamsXG = Object.values(teamStats)
    .sort((a, b) => b.totalXG - a.totalXG);

  const allTeamsXGC = Object.values(teamStats)
    .sort((a, b) => a.totalXGC - b.totalXGC);

  // xG over/under performance (goals scored vs xG)
  const allTeamsXGPerformance = Object.values(teamStats)
    .map(team => ({
      ...team,
      xgDiff: team.totalGoals - team.totalXG
    }))
    .sort((a, b) => a.xgDiff - b.xgDiff);

  // xGC over/under performance (goals conceded vs xGC)
  const allTeamsXGCPerformance = Object.values(teamStats)
    .map(team => ({
      ...team,
      xgcDiff: team.totalConceded - team.totalXGC
    }))
    .sort((a, b) => b.xgcDiff - a.xgcDiff);

  // Overall strength (xG - xGC for all games)
  const allTeamsOverallStrength = Object.values(teamStats)
    .map(team => ({
      ...team,
      strength: team.totalXG - team.totalXGC,
      goalDiff: team.totalGoals - team.totalConceded
    }))
    .sort((a, b) => b.strength - a.strength);

  // Home strength (xG - xGC for home games)
  const allTeamsHomeStrength = Object.values(homeStats)
    .map(team => ({
      ...team,
      strength: team.xg - team.xgc,
      goalDiff: team.goals - team.conceded
    }))
    .sort((a, b) => b.strength - a.strength);

  // Away strength (xG - xGC for away games)
  const allTeamsAwayStrength = Object.values(awayStats)
    .map(team => ({
      ...team,
      strength: team.xg - team.xgc,
      goalDiff: team.goals - team.conceded
    }))
    .sort((a, b) => b.strength - a.strength);

  if (loading) {
    return (
      <div className="teams-page">
        <div className="loading-message">
          <p>⏳ Loading Team Stats... ⏳</p>
        </div>
      </div>
    );
  }

  return (
    <div className="teams-page">
      <div className="top-10-sub-heading">
        <p>Below is a range of stats for all 20 of the Premier League teams.</p>
        <p>Use the data below to help identify which team has been over or under performing their underlying data!</p>
      </div>

      <div className="player-pics player-pics-lists">
        <p className="top-10-title">Team xG (Goals Scored)</p>
        {allTeamsXG.length > 0 && (
          <div className="pics-wrapper category-scroll-wrapper">
            {allTeamsXG.map((team, index) => (
              <div key={index} className="player-pic-container">
                <div className="player-rank">#{index + 1}</div>
                {team.badge ? (
                  <img className="team-pic-top-10" src={team.badge} alt={team.teamName} />
                ) : (
                  <p>Badge not available</p>
                )}
                <p className="player-stat-name">{team.teamName}</p>
                <p className="player-stat">{team.totalXG.toFixed(2)}</p>
                <p className="player-stat">({team.totalGoals})</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="player-pics player-pics-lists">
        <p className="top-10-title">Team xGC (Goals Conceded)</p>
        {allTeamsXGC.length > 0 && (
          <div className="pics-wrapper category-scroll-wrapper">
            {allTeamsXGC.map((team, index) => (
              <div key={index} className="player-pic-container">
                <div className="player-rank">#{index + 1}</div>
                {team.badge ? (
                  <img className="team-pic-top-10" src={team.badge} alt={team.teamName} />
                ) : (
                  <p>Badge not available</p>
                )}
                <p className="player-stat-name">{team.teamName}</p>
                <p className="player-stat">{team.totalXGC.toFixed(2)}</p>
                <p className="player-stat">({team.totalConceded})</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="player-pics player-pics-lists">
        <p className="top-10-title">Overall Strength xG-xGC (Goals-Conceded)</p>
        {allTeamsOverallStrength.length > 0 && (
          <div className="pics-wrapper category-scroll-wrapper">
            {allTeamsOverallStrength.map((team, index) => (
              <div key={index} className="player-pic-container">
                <div className="player-rank">#{index + 1}</div>
                {team.badge ? (
                  <img className="team-pic-top-10" src={team.badge} alt={team.teamName} />
                ) : (
                  <p>Badge not available</p>
                )}
                <p className="player-stat-name">{team.teamName}</p>
                <p className="player-stat">{team.strength > 0 ? '+' : ''}{team.strength.toFixed(2)}</p>
                <p className="player-stat">({team.goalDiff > 0 ? '+' : ''}{team.goalDiff})</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="player-pics player-pics-lists">
        <p className="top-10-title">Home Strength xG-xGC (Goals-Conceded)</p>
        {allTeamsHomeStrength.length > 0 && (
          <div className="pics-wrapper category-scroll-wrapper">
            {allTeamsHomeStrength.map((team, index) => (
              <div key={index} className="player-pic-container">
                <div className="player-rank">#{index + 1}</div>
                {team.badge ? (
                  <img className="team-pic-top-10" src={team.badge} alt={team.teamName} />
                ) : (
                  <p>Badge not available</p>
                )}
                <p className="player-stat-name">{team.teamName}</p>
                <p className="player-stat">{team.strength > 0 ? '+' : ''}{team.strength.toFixed(2)}</p>
                <p className="player-stat">({team.goalDiff > 0 ? '+' : ''}{team.goalDiff})</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="player-pics player-pics-lists">
        <p className="top-10-title">Away Strength  xG-xGC (Goals-Conceded)</p>
        {allTeamsAwayStrength.length > 0 && (
          <div className="pics-wrapper category-scroll-wrapper">
            {allTeamsAwayStrength.map((team, index) => (
              <div key={index} className="player-pic-container">
                <div className="player-rank">#{index + 1}</div>
                {team.badge ? (
                  <img className="team-pic-top-10" src={team.badge} alt={team.teamName} />
                ) : (
                  <p>Badge not available</p>
                )}
                <p className="player-stat-name">{team.teamName}</p>
                <p className="player-stat">{team.strength > 0 ? '+' : ''}{team.strength.toFixed(2)}</p>
                <p className="player-stat">({team.goalDiff > 0 ? '+' : ''}{team.goalDiff})</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="player-pics player-pics-lists">
        <p className="top-10-title">xG Over/Under Performance (Goals Scored)</p>
        {allTeamsXGPerformance.length > 0 && (
          <div className="pics-wrapper category-scroll-wrapper">
            {allTeamsXGPerformance.map((team, index) => (
              <div key={index} className="player-pic-container">
                <div className="player-rank">#{index + 1}</div>
                {team.badge ? (
                  <img className="team-pic-top-10" src={team.badge} alt={team.teamName} />
                ) : (
                  <p>Badge not available</p>
                )}
                <p className="player-stat-name">{team.teamName}</p>
                <p className="player-stat">{team.xgDiff > 0 ? '+' : ''}{team.xgDiff.toFixed(2)}</p>
                <p className="player-stat">({team.totalGoals})</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="player-pics player-pics-lists">
        <p className="top-10-title">xGC Over/Under Performance (Goals Conceded)</p>
        {allTeamsXGCPerformance.length > 0 && (
          <div className="pics-wrapper category-scroll-wrapper">
            {allTeamsXGCPerformance.map((team, index) => (
              <div key={index} className="player-pic-container">
                <div className="player-rank">#{index + 1}</div>
                {team.badge ? (
                  <img className="team-pic-top-10" src={team.badge} alt={team.teamName} />
                ) : (
                  <p>Badge not available</p>
                )}
                <p className="player-stat-name">{team.teamName}</p>
                <p className="player-stat">{team.xgcDiff > 0 ? '+' : ''}{team.xgcDiff.toFixed(2)}</p>
                <p className="player-stat">({team.totalConceded})</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamsPage;
