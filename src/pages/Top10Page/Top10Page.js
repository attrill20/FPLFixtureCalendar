import React, { useState, useRef, useEffect } from 'react';
import "./Top10Page.css";

const Top10Page = ({ mainData, teams, fixturesData }) => {
  const elements = mainData && Array.isArray(mainData.elements) ? mainData.elements : [];
  const fixtures = fixturesData && Array.isArray(fixturesData) ? fixturesData : [];
  const [selectedTeamIds, setSelectedTeamIds] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const sortedPlayersTotalPoints = [...elements].sort((a, b) => b.total_points - a.total_points);
  const sortedPlayersGWPoints = [...elements].sort((a, b) => b.event_points - a.event_points);
  const sortedPlayersForm = [...elements].sort((a, b) => b.form - a.form);
  const sortedPlayersOwnership = [...elements].sort((a, b) => b.selected_by_percent - a.selected_by_percent);
  const sortedPlayersXGI = [...elements].sort((a, b) => b.expected_goal_involvements - a.expected_goal_involvements);
  const top10Goalkeepers = [...elements].filter(player => player.element_type === 1).sort((a, b) => b.total_points - a.total_points); 
  const top10Defenders = [...elements].filter(player => player.element_type === 2).sort((a, b) => b.total_points - a.total_points);
  const top10Midfielders = [...elements].filter(player => player.element_type === 3).sort((a, b) => b.total_points - a.total_points);
  const top10Forwards = [...elements].filter(player => player.element_type === 4).sort((a, b) => b.total_points - a.total_points);
  const top10Bonus = [...elements].sort((a, b) => b.bonus - a.bonus);
  const top10BPS = [...elements].sort((a, b) => b.bps - a.bps);
  const top10PointsPerMillion = [...elements].sort((a, b) => (b.total_points / b.now_cost) - (a.total_points / a.now_cost));

  const calculateTotalXGAndGoalsPerTeam = (elements, fixtures, teams) => {
    const teamStats = {};
    
    teams.forEach(team => {
        teamStats[team.id] = {
        teamName: team.name,
        badge: team.badge,
        totalXG: 0,
        totalGoals: 0,
        };
    });
    
    elements.forEach(player => {
        const teamId = player.team;
        
        if (player.minutes > 0) {
        const xG = parseFloat(player.expected_goals) || 0;
        if (teamStats[teamId]) {
            teamStats[teamId].totalXG += xG;
        }
        }
    });
    
    fixtures.forEach(fixture => {
        const { team_h, team_a, team_h_score, team_a_score } = fixture;
    
        if (teamStats[team_h]) {
        teamStats[team_h].totalGoals += team_h_score || 0;
        }
    
        if (teamStats[team_a]) {
        teamStats[team_a].totalGoals += team_a_score || 0;
        }
    });
    
    const sortedTeamStats = Object.values(teamStats)
        .sort((a, b) => b.totalXG - a.totalXG)
        .slice(0, 10);
    
    return sortedTeamStats;
  };
    
  const top10TeamsXGAndGoals = calculateTotalXGAndGoalsPerTeam(elements, fixtures, teams);

  const calculateTotalXGCAndConcededGoalsPerTeam = (elements, fixtures, teams) => {
    const teamStats = {};
  
    teams.forEach(team => {
        if (team.id !== 0) { 
        teamStats[team.id] = {
            teamName: team.name,
            badge: team.badge,
            totalXGC: 0,
            totalGoalsConceded: 0,
        };
    }});
  
    elements.forEach(player => {
      if (player.element_type === 1 && player.minutes > 0) {
        const teamId = player.team;
        const xGC = parseFloat(player.expected_goals_conceded) || 0;
  
        if (teamStats[teamId]) {
          teamStats[teamId].totalXGC += xGC;
        }
      }
    });
  
    fixtures.forEach(fixture => {
      const { team_h, team_a, team_h_score, team_a_score } = fixture;
  
      if (teamStats[team_h]) {
        teamStats[team_h].totalGoalsConceded += team_a_score || 0;
      }
  
      if (teamStats[team_a]) {
        teamStats[team_a].totalGoalsConceded += team_h_score || 0;
      }
    });
  
    const sortedTeamStats = Object.values(teamStats)
      .sort((a, b) => a.totalXGC - b.totalXGC)
      .slice(0, 10);
  
    return sortedTeamStats;
  };
  
  const top10TeamsXGCAndConcededGoals = calculateTotalXGCAndConcededGoalsPerTeam(elements, fixtures, teams);

  const sortedPlayersXGUnderPerformance = [...elements]
    .map(player => ({
      ...player,
      xGUnderPerformance: (player.expected_goals || 0) - (player.goals_scored || 0)
    }))
    .sort((a, b) => b.xGUnderPerformance - a.xGUnderPerformance);

  const sortedPlayersXGOverPerformance = [...elements]
    .map(player => ({
      ...player,
      xGOverPerformance: player.goals_scored - player.expected_goals
    }))
    .sort((a, b) => b.xGOverPerformance - a.xGOverPerformance)

    
  const dropdownListRef = useRef(null);

  const handleTeamSelect = (teamId) => {
    setSelectedTeamIds((prevSelected) => {
      if (prevSelected.length === 0 || prevSelected.length === teams.length) {
        return [teamId];
      }
      return prevSelected.includes(teamId)
        ? prevSelected.filter((id) => id !== teamId)
        : [...prevSelected, teamId];
    });
  };

  const handleToggleDropdown = (event) => {
    event.stopPropagation();
    setIsDropdownOpen(prev => !prev);
  };
  
  const handleClickOutside = (event) => {
    if (dropdownListRef.current && !dropdownListRef.current.contains(event.target) &&
        !event.target.closest('.dropdown')) {
      setIsDropdownOpen(false);
    }
  };
  
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const handleSelectAllTeams = () => {
    setSelectedTeamIds([]);
  };

  const displaySelectedTeams = () => {
    if (selectedTeamIds.length === 0 || selectedTeamIds.length === teams.length) {
      return 'All Teams Selected';
    } else {
      return `${selectedTeamIds.length} Team${selectedTeamIds.length > 1 ? 's' : ''} Selected`;
    }
  };

  const filterByTeam = (players) => {
    // Show all teams if no team is specifically selected
    return selectedTeamIds.length > 0 && selectedTeamIds.length < teams.length
      ? players.filter((player) => selectedTeamIds.includes(player.team))
      : players;
  };

  return (
    <div>
      <div className="top-10-sub-heading">
        <p>Use these Top 10 lists to help you notice current trends and in form players to help you decide who to pick for your team.</p>
        <p>'All Teams' is set as default, use the dropdown to filter for individual or a combination of teams!</p>
      </div>

      <div className="dropdown-container">
        <label htmlFor="team-select"></label>
        <div className={`dropdown ${isDropdownOpen ? 'open' : ''}`} onClick={handleToggleDropdown}>
          <span>{displaySelectedTeams()}</span>
          <span className="dropdown-arrow">▼</span>
        </div>
        {isDropdownOpen && (
          <div className="dropdown-list" ref={dropdownListRef}>
            <div className="dropdown-item" onClick={handleSelectAllTeams}>
              <input type="checkbox" checked={selectedTeamIds.length === 0} readOnly />
              All Teams
            </div>
            {teams.slice(1).map(team => (
              <div key={team.id} className="dropdown-item" onClick={() => handleTeamSelect(team.id)}>
                <input type="checkbox" checked={selectedTeamIds.includes(team.id)} readOnly />
                {team.name}
              </div>
            ))}
          </div>
        )}
      </div>



      <div className="player-pics player-pics-lists">
        <p className="top-10-title">Top 10 Overall Points</p> 
        {elements.length > 0 && (
          <div className="pics-wrapper">
            {filterByTeam(sortedPlayersTotalPoints).slice(0, 10).map((player, index) => (
              <div key={player.code} className="player-pic-container">
                <img
                    className="player-pic-top-10"
                    src={`https://resources.premierleague.com/premierleague/photos/players/250x250/p${player.code}.png`}
                    alt={`player-${index + 1}`}
                    onError={(e) => {
                      e.target.src = `https://fantasy.premierleague.com/dist/img/shirts/standard/shirt_${player.team_code}-110.png`;
                    }}
                />
                <p className="player-stat-name">{player.web_name}</p>
                <p className="player-stat">{player.total_points}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="player-pics player-pics-lists">
        <p className="top-10-title">Top 10 Form (Last 4 Games Average)</p> 
        {elements.length > 0 && (
          <div className="pics-wrapper">
            {filterByTeam(sortedPlayersForm).slice(0, 10).map((player, index) => (
              <div key={player.code} className="player-pic-container">
                <img
                    className="player-pic-top-10"
                    src={`https://resources.premierleague.com/premierleague/photos/players/250x250/p${player.code}.png`}
                    alt={`player-${index + 1}`}
                    onError={(e) => {
                      e.target.src = `https://fantasy.premierleague.com/dist/img/shirts/standard/shirt_${player.team_code}-110.png`;
                    }}
                />
                <p className="player-stat-name">{player.web_name}</p>
                <p className="player-stat">{player.form}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="player-pics player-pics-lists">
        <p className="top-10-title">Top 10 GW Points</p> 
        {elements.length > 0 && (
          <div className="pics-wrapper">
            {filterByTeam(sortedPlayersGWPoints).slice(0, 10).map((player, index) => (
              <div key={player.code} className="player-pic-container">
                <img
                  className="player-pic-top-10"
                  src={`https://resources.premierleague.com/premierleague/photos/players/250x250/p${player.code}.png`}
                  alt={`player-${index + 1}`}
                  onError={(e) => {
                      e.target.src = `https://fantasy.premierleague.com/dist/img/shirts/standard/shirt_${player.team_code}-110.png`;
                  }}
                />
                <p className="player-stat-name">{player.web_name}</p>
                <p className="player-stat">{player.event_points}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="player-pics player-pics-lists">
        <p className="top-10-title">Top 10 Owned Players</p> 
        {elements.length > 0 && (
          <div className="pics-wrapper">
            {filterByTeam(sortedPlayersOwnership).slice(0, 10).map((player, index) => (
              <div key={player.code} className="player-pic-container">
                <img
                  className="player-pic-top-10"
                  src={`https://resources.premierleague.com/premierleague/photos/players/250x250/p${player.code}.png`}
                  alt={`player-${index + 1}`}
                  onError={(e) => {
                      e.target.src = `https://fantasy.premierleague.com/dist/img/shirts/standard/shirt_${player.team_code}-110.png`;
                  }}
                />
                <p className="player-stat-name">{player.web_name}</p> 
                <p className="player-stat">{player.selected_by_percent}%</p> 
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="player-pics player-pics-lists">
        <p className="top-10-title">Top 10 xGI (Total Goal Involvements) </p> 
        {elements.length > 0 && (
          <div className="pics-wrapper">
            {filterByTeam(sortedPlayersXGI).slice(0, 10).map((player, index) => (
              <div key={player.code} className="player-pic-container">
                <img
                  className="player-pic-top-10"
                  src={`https://resources.premierleague.com/premierleague/photos/players/250x250/p${player.code}.png`}
                  alt={`player-${index + 1}`}
                  onError={(e) => {
                      e.target.src = `https://fantasy.premierleague.com/dist/img/shirts/standard/shirt_${player.team_code}-110.png`;
                  }}
                />
                <p className="player-stat-name">{player.web_name}</p>
                <p className="player-stat">{player.expected_goal_involvements}</p>
                <p className="player-stat">({player.goals_scored + player.assists})</p> 
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="player-pics player-pics-lists">
        <p className="top-10-title">Top 10 xG Under Performance (Goals) </p> 
        {elements.length > 0 && (
          <div className="pics-wrapper">
            {filterByTeam(sortedPlayersXGUnderPerformance).slice(0, 10).map((player, index) => (
              <div key={player.code} className="player-pic-container">
                <img
                  className="player-pic-top-10"
                  src={`https://resources.premierleague.com/premierleague/photos/players/250x250/p${player.code}.png`}
                  alt={`player-${index + 1}`}
                  onError={(e) => {
                      e.target.src = `https://fantasy.premierleague.com/dist/img/shirts/standard/shirt_${player.team_code}-110.png`;
                  }}
                />
                <p className="player-stat-name">{player.web_name}</p>
                <p className="player-stat">{(player.goals_scored - player.expected_goals).toFixed(2)}</p>
                <p className="player-stat">({player.goals_scored})</p> 
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="player-pics player-pics-lists">
        <p className="top-10-title">Top 10 xG Over Performance (Goals) </p> 
        {elements.length > 0 && (
          <div className="pics-wrapper">
            {filterByTeam(sortedPlayersXGOverPerformance).slice(0, 10).map((player, index) => (
              <div key={player.code} className="player-pic-container">
                <img
                  className="player-pic-top-10"
                  src={`https://resources.premierleague.com/premierleague/photos/players/250x250/p${player.code}.png`}
                  alt={`player-${index + 1}`}
                  onError={(e) => {
                      e.target.src = `https://fantasy.premierleague.com/dist/img/shirts/standard/shirt_${player.team_code}-110.png`;
                  }}
                />
                <p className="player-stat-name">{player.web_name}</p>
                <p className="player-stat">+{(player.goals_scored - player.expected_goals).toFixed(2)}</p>
                <p className="player-stat">({player.goals_scored})</p> 
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="player-pics player-pics-lists">
        <p className="top-10-title">Top 10 Goalkeepers</p> 
        {elements.length > 0 && (
          <div className="pics-wrapper">
            {filterByTeam(top10Goalkeepers).slice(0, 10).map((player, index) => (
              <div key={player.code} className="player-pic-container">
                <img
                  className="player-pic-top-10"
                  src={`https://resources.premierleague.com/premierleague/photos/players/250x250/p${player.code}.png`}
                  alt={`player-${index + 1}`}
                  onError={(e) => {
                    e.target.src = `https://fantasy.premierleague.com/dist/img/shirts/standard/shirt_${player.team_code}_1-110.png`;
                  }}
                />
                <p className="player-stat-name">{player.web_name}</p>
                <p className="player-stat">{player.total_points}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="player-pics player-pics-lists">
        <p className="top-10-title">Top 10 Defenders</p> 
        {elements.length > 0 && (
          <div className="pics-wrapper">
            {filterByTeam(top10Defenders).slice(0, 10).map((player, index) => (
              <div key={player.code} className="player-pic-container">
                <img
                  className="player-pic-top-10"
                  src={`https://resources.premierleague.com/premierleague/photos/players/250x250/p${player.code}.png`}
                  alt={`player-${index + 1}`}
                  onError={(e) => {
                    e.target.src = `https://fantasy.premierleague.com/dist/img/shirts/standard/shirt_${player.team_code}-110.png`;
                  }}
                />
                <p className="player-stat-name">{player.web_name}</p>
                <p className="player-stat">{player.total_points}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="player-pics player-pics-lists">
        <p className="top-10-title">Top 10 Midfielders</p> 
        {elements.length > 0 && (
          <div className="pics-wrapper">
            {filterByTeam(top10Midfielders).slice(0, 10).map((player, index) => (
              <div key={player.code} className="player-pic-container">
                <img
                  className="player-pic-top-10"
                  src={`https://resources.premierleague.com/premierleague/photos/players/250x250/p${player.code}.png`}
                  alt={`player-${index + 1}`}
                  onError={(e) => {
                      e.target.src = `https://fantasy.premierleague.com/dist/img/shirts/standard/shirt_${player.team_code}-110.png`;
                  }}
                />
                <p className="player-stat-name">{player.web_name}</p>
                <p className="player-stat">{player.total_points}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="player-pics player-pics-lists">
        <p className="top-10-title">Top 10 Forwards</p> 
        {elements.length > 0 && (
          <div className="pics-wrapper">
            {filterByTeam(top10Forwards).slice(0, 10).map((player, index) => (
              <div key={player.code} className="player-pic-container">
                <img
                  className="player-pic-top-10"
                  src={`https://resources.premierleague.com/premierleague/photos/players/250x250/p${player.code}.png`}
                  alt={`player-${index + 1}`}
                  onError={(e) => {
                      e.target.src = `https://fantasy.premierleague.com/dist/img/shirts/standard/shirt_${player.team_code}-110.png`;
                  }}
                />
                <p className="player-stat-name">{player.web_name}</p>
                <p className="player-stat">{player.total_points}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="player-pics player-pics-lists">
        <p className="top-10-title">Top 10 Bonus</p> 
        {elements.length > 0 && (
          <div className="pics-wrapper">
            {filterByTeam(top10Bonus).slice(0, 10).map((player, index) => (
              <div key={player.code} className="player-pic-container">
                <img
                  className="player-pic-top-10"
                  src={`https://resources.premierleague.com/premierleague/photos/players/250x250/p${player.code}.png`}
                  alt={`player-${index + 1}`}
                  onError={(e) => {
                      e.target.src = `https://fantasy.premierleague.com/dist/img/shirts/standard/shirt_${player.team_code}-110.png`;
                  }}
                />
                <p className="player-stat-name">{player.web_name}</p>
                <p className="player-stat">{player.bonus}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="player-pics player-pics-lists">
        <p className="top-10-title">Top 10 BPS</p> 
        {elements.length > 0 && (
          <div className="pics-wrapper">
            {filterByTeam(top10BPS).slice(0, 10).map((player, index) => (
              <div key={player.code} className="player-pic-container">
                <img
                  className="player-pic-top-10"
                  src={`https://resources.premierleague.com/premierleague/photos/players/250x250/p${player.code}.png`}
                  alt={`player-${index + 1}`}
                  onError={(e) => {
                      e.target.src = `https://fantasy.premierleague.com/dist/img/shirts/standard/shirt_${player.team_code}-110.png`;
                  }}
                />
                <p className="player-stat-name">{player.web_name}</p>
                <p className="player-stat">{player.bps}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="player-pics player-pics-lists">
        <p className="top-10-title">Top 10 Points Per Million</p> 
        {elements.length > 0 && (
          <div className="pics-wrapper">
            {filterByTeam(top10PointsPerMillion).slice(0, 10).map((player, index) => (
              <div key={player.code} className="player-pic-container">
                <img
                  className="player-pic-top-10"
                  src={`https://resources.premierleague.com/premierleague/photos/players/250x250/p${player.code}.png`}
                  alt={`player-${index + 1}`}
                  onError={(e) => {
                      e.target.src = `https://fantasy.premierleague.com/dist/img/shirts/standard/shirt_${player.team_code}-110.png`;
                  }}
                />
                <p className="player-stat-name">{player.web_name}</p>
                <p className="player-stat">{player.total_points && player.now_cost ? ((player.total_points / player.now_cost) * 10).toFixed(2) : 'N/A'}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="player-pics player-pics-lists">
        <p className="top-10-title">Top 10 Team xG (Goals Scored)</p>
        {top10TeamsXGAndGoals.length > 0 && (
            <div className="pics-wrapper">
            {top10TeamsXGAndGoals.map((team, index) => (
                <div key={index} className="player-pic-container">
                {team.badge ? (
                    <img
                    className="team-pic-top-10"
                    src={team.badge}
                    alt={`team-${index + 1}`}
                    />
                ) : (
                    <p>Badge not available</p>
                )}
                <p className="player-stat-name">{team.teamName}</p>
                <p className="player-stat">
                    {typeof team.totalXG === 'number' ? team.totalXG.toFixed(2) : '0.00'}
                </p>
                <p className="player-stat">
                    ({team.totalGoals})
                </p>
                </div>
            ))}
            </div>
        )}
      </div>

      <div className="player-pics player-pics-lists">
        <p className="top-10-title">Top 10 Team xGC (Goals Conceded)</p>
        {top10TeamsXGCAndConcededGoals.length > 0 && (
            <div className="pics-wrapper">
            {top10TeamsXGCAndConcededGoals.map((team, index) => (
                <div key={index} className="player-pic-container">
                {team.badge ? (
                    <img
                    className="team-pic-top-10"
                    src={team.badge}
                    alt={`team-${index + 1}`}
                    />
                ) : (
                    <p>Badge not available</p>
                )}
                <p className="player-stat-name">{team.teamName}</p>
                <p className="player-stat">
                    {typeof team.totalXGC === 'number' ? team.totalXGC.toFixed(2) : '0.00'}
                </p>
                <p className="player-stat">
                    ({team.totalGoalsConceded})
                </p>
                </div>
            ))}
            </div>
        )}
      </div>
      
    </div>
  );
};

export default Top10Page;
