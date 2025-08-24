import React from 'react';
import "./TeamsPage.css";

const TeamsPage = ({ xgData, fixturesData, teams }) => {
  const fixtures = fixturesData && Array.isArray(fixturesData) ? fixturesData : [];

  const calculateTeamStats = (xgData, fixtures, teams) => {
    const teamStats = {};

    teams.slice(1).forEach((team) => {
      const teamData = xgData.find(data => data.team === team.name);
      if (teamData) {  
        teamStats[team.id] = {
          teamName: team.name,
          badge: team.badge,
          totalXG: parseFloat(teamData.xg) || 0,
          totalXGC: parseFloat(teamData.xgc) || 0,
          totalGoals: 0,
          totalConceded: 0,
        };
      }
    });

    fixtures.forEach(({ team_h, team_a, team_h_score, team_a_score }) => {
      if (teamStats[team_h]) {
        teamStats[team_h].totalGoals += team_h_score || 0;
        teamStats[team_h].totalConceded += team_a_score || 0;
      }
      if (teamStats[team_a]) {
        teamStats[team_a].totalGoals += team_a_score || 0;
        teamStats[team_a].totalConceded += team_h_score || 0;
      }
    });

    return teamStats;
  };

  const teamStats = calculateTeamStats(xgData, fixtures, teams);

  const top10TeamsXG = Object.values(teamStats)
    .sort((a, b) => b.totalXG - a.totalXG)
    .slice(0, 10);

  const top10TeamsXGC = Object.values(teamStats)
    .sort((a, b) => a.totalXGC - b.totalXGC)
    .slice(0, 10);
  
  return (
    <div className="teams-page">
      <div className="top-10-sub-heading">
        <p>Below is a range of stats for all 20 of the Premier League teams.</p>
        <p>Use the data below to help identify which team has been over or under performing their underlying data!</p>
      </div>

      <div className="player-pics player-pics-lists">
        <p className="top-10-title">Top 10 Team xG (Goals Scored)</p>
        {top10TeamsXG.length > 0 && (
          <div className="pics-wrapper">
            {top10TeamsXG.map((team, index) => (
              <div key={index} className="player-pic-container">
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
        <p className="top-10-title">Top 10 Team xGC (Goals Conceded)</p>
        {top10TeamsXGC.length > 0 && (
          <div className="pics-wrapper">
            {top10TeamsXGC.map((team, index) => (
              <div key={index} className="player-pic-container">
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
    </div>
  );
};

export default TeamsPage;
