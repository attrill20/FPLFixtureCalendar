import React, { useState, useRef, useEffect } from 'react';
import "./Top10Page.css";

const Top10Page = ({ mainData, teams, fixturesData }) => {
  const elements = mainData && Array.isArray(mainData.elements) ? mainData.elements : [];
  const fixtures = fixturesData && Array.isArray(fixturesData) ? fixturesData : [];
  const [selectedTeamIds, setSelectedTeamIds] = useState([]);
  const [selectedPositions, setSelectedPositions] = useState([]);
  const [isTeamDropdownOpen, setIsTeamDropdownOpen] = useState(false);
  const [isPositionDropdownOpen, setIsPositionDropdownOpen] = useState(false);

  const teamDropdownRef = useRef(null);
  const positionDropdownRef = useRef(null);
  
  const sortedPlayersTotalPoints = [...elements].sort((a, b) => b.total_points - a.total_points);
  const sortedPlayersGWPoints = [...elements].sort((a, b) => b.event_points - a.event_points);
  const sortedPlayersForm = [...elements].sort((a, b) => b.form - a.form);
  const sortedPlayersOwnership = [...elements].sort((a, b) => b.selected_by_percent - a.selected_by_percent);
  const sortedPlayersXGI = [...elements].sort((a, b) => b.expected_goal_involvements - a.expected_goal_involvements);
  const sortedPlayersGoals = [...elements].sort((a, b) => b.goals_scored - a.goals_scored);
  const sortedPlayersAssists = [...elements].sort((a, b) => b.assists - a.assists);
  const top10Bonus = [...elements].sort((a, b) => b.bonus - a.bonus);
  const top10BPS = [...elements].sort((a, b) => b.bps - a.bps);
  const top10PointsPerMillion = [...elements].sort((a, b) => (b.total_points / b.now_cost) - (a.total_points / a.now_cost));

  const positions = [
    { id: 1, name: "Goalkeepers" },
    { id: 2, name: "Defenders" },
    { id: 3, name: "Midfielders" },
    { id: 4, name: "Forwards" },
  ];

  const calculateTotalXGAndGoalsPerTeam = (elements, fixtures, teams) => {
    const teamStats = {};

    teams.forEach(team => {
      if (team.id !== 0) { 
      teamStats[team.id] = {
          teamName: team.name,
          badge: team.badge,
          totalXG: 0,
          totalGoals: 0,
      };
  }});
    
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
    .filter(player => player.xGUnderPerformance >= 0)
    .sort((a, b) => b.xGUnderPerformance - a.xGUnderPerformance);

  const sortedPlayersXGOverPerformance = [...elements]
    .map(player => ({
      ...player,
      xGOverPerformance: player.goals_scored - player.expected_goals
    }))
    .filter(player => player.xGOverPerformance >= 0)
    .sort((a, b) => b.xGOverPerformance - a.xGOverPerformance)
    
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (
          teamDropdownRef.current && !teamDropdownRef.current.contains(event.target) &&
          positionDropdownRef.current && !positionDropdownRef.current.contains(event.target)
        ) {
          setIsTeamDropdownOpen(false);
          setIsPositionDropdownOpen(false);
        }
      };
  
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, []);
  
    const handleTeamSelect = (teamId) => {
      setSelectedTeamIds((prevSelected) => (
        prevSelected.includes(teamId)
          ? prevSelected.filter((id) => id !== teamId)
          : [...prevSelected, teamId]
      ));
    };
  
    const handlePositionSelect = (positionId) => {
      setSelectedPositions((prevSelected) => (
        prevSelected.includes(positionId)
          ? prevSelected.filter((id) => id !== positionId)
          : [...prevSelected, positionId]
      ));
    };

    const handleToggleDropdown = (event, dropdownType) => {
      event.stopPropagation();
      if (dropdownType === 'team') {
        setIsTeamDropdownOpen((prev) => !prev);
        setIsPositionDropdownOpen(false);
      } else if (dropdownType === 'position') {
        setIsPositionDropdownOpen((prev) => !prev);
        setIsTeamDropdownOpen(false);
      }
    };
  
    const displaySelectedTeams = () => (
      selectedTeamIds.length === 0 || selectedTeamIds.length === teams.length
        ? 'All Teams Selected'
        : `${selectedTeamIds.length} Team${selectedTeamIds.length > 1 ? 's' : ''} Selected`
    );
  
    const displaySelectedPositions = () => (
      selectedPositions.length === 0 || selectedPositions.length === positions.length
        ? 'All Positions Selected'
        : `${selectedPositions.length} Position${selectedPositions.length > 1 ? 's' : ''} Selected`
    );
  
    const filterPlayers = (players) => {
      let filteredPlayers = players;
  
      if (selectedTeamIds.length > 0 && selectedTeamIds.length < teams.length) {
        filteredPlayers = filteredPlayers.filter(player => selectedTeamIds.includes(player.team));
      }
      if (selectedPositions.length > 0) {
        filteredPlayers = filteredPlayers.filter(player => selectedPositions.includes(player.element_type));
      }
      return filteredPlayers;
    };
    console.log('Top 10 Teams Data:', top10TeamsXGAndGoals);

  return (
    <div>
      <div className="top-10-sub-heading">
        <p>Use these Top 10 lists to help you notice current trends and in form players to help you decide who to pick for your team.</p>
        <p>'All Teams' and 'All Positions' are set as default, use the dropdowns to filter for individual or a combination of teams and positions!</p>
      </div>

      <div className="dropdown-container">
        <div className="dropdown" ref={teamDropdownRef} onClick={(event) => handleToggleDropdown(event, 'team')}>
          <span><strong>{displaySelectedTeams()}</strong></span>
          <span className="dropdown-arrow">▼</span>
          {isTeamDropdownOpen && (
            <div className="dropdown-list">
              <div className="dropdown-item" onClick={() => setSelectedTeamIds([])}>
                <input type="checkbox" checked={selectedTeamIds.length === 0} readOnly />
                All Teams
              </div>
              {teams.slice(1).map(team => (
                <div key={team.id} className="dropdown-item" onClick={(e) => { e.stopPropagation(); handleTeamSelect(team.id); }}>
                  <input type="checkbox" checked={selectedTeamIds.includes(team.id)} readOnly />
                  {team.name}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="dropdown" ref={positionDropdownRef} onClick={(event) => handleToggleDropdown(event, 'position')}>
          <span><strong>{displaySelectedPositions()}</strong></span>
          <span className="dropdown-arrow">▼</span>
          {isPositionDropdownOpen && (
            <div className="dropdown-list">
              <div className="dropdown-item" onClick={() => setSelectedPositions([])}>
                <input type="checkbox" checked={selectedPositions.length === 0} readOnly />
                All Positions
              </div>
              {positions.map(position => (
                <div key={position.id} className="dropdown-item" onClick={(e) => { e.stopPropagation(); handlePositionSelect(position.id); }}>
                  <input type="checkbox" checked={selectedPositions.includes(position.id)} readOnly />
                  {position.name}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="player-pics player-pics-lists">
        <p className="top-10-title">Top 10 Total Points</p> 
        {elements.length > 0 && (
          <div className="pics-wrapper">
            {filterPlayers(sortedPlayersTotalPoints).slice(0, 10).map((player, index) => (
              <div key={player.code} className="player-pic-container">
                <img
                    className="player-pic-top-10"
                    src={`https://resources.premierleague.com/premierleague/photos/players/250x250/p${player.code}.png`}
                    alt={`player-${index + 1}`}
                    onError={(e) => {
                      if (player.element_type === 1) {
                        e.target.src = `https://fantasy.premierleague.com/dist/img/shirts/standard/shirt_${player.team_code}_1-110.png`;
                      } else {
                        e.target.src = `https://fantasy.premierleague.com/dist/img/shirts/standard/shirt_${player.team_code}-110.png`;
                      }
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
            {filterPlayers(sortedPlayersForm).slice(0, 10).map((player, index) => (
              <div key={player.code} className="player-pic-container">
                <img
                    className="player-pic-top-10"
                    src={`https://resources.premierleague.com/premierleague/photos/players/250x250/p${player.code}.png`}
                    alt={`player-${index + 1}`}
                    onError={(e) => {
                      if (player.element_type === 1) {
                        e.target.src = `https://fantasy.premierleague.com/dist/img/shirts/standard/shirt_${player.team_code}_1-110.png`;
                      } else {
                        e.target.src = `https://fantasy.premierleague.com/dist/img/shirts/standard/shirt_${player.team_code}-110.png`;
                      }
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
            {filterPlayers(sortedPlayersGWPoints).slice(0, 10).map((player, index) => (
              <div key={player.code} className="player-pic-container">
                <img
                  className="player-pic-top-10"
                  src={`https://resources.premierleague.com/premierleague/photos/players/250x250/p${player.code}.png`}
                  alt={`player-${index + 1}`}
                  onError={(e) => {
                      if (player.element_type === 1) {
                        e.target.src = `https://fantasy.premierleague.com/dist/img/shirts/standard/shirt_${player.team_code}_1-110.png`;
                      } else {
                        e.target.src = `https://fantasy.premierleague.com/dist/img/shirts/standard/shirt_${player.team_code}-110.png`;
                      }
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
        <p className="top-10-title">Top 10 Owned Players (Net GW Transfers)</p> 
        {elements.length > 0 && (
          <div className="pics-wrapper">
            {filterPlayers(sortedPlayersOwnership).slice(0, 10).map((player, index) => (
              <div key={player.code} className="player-pic-container">
                <img
                  className="player-pic-top-10"
                  src={`https://resources.premierleague.com/premierleague/photos/players/250x250/p${player.code}.png`}
                  alt={`player-${index + 1}`}
                  onError={(e) => {
                      if (player.element_type === 1) {
                        e.target.src = `https://fantasy.premierleague.com/dist/img/shirts/standard/shirt_${player.team_code}_1-110.png`;
                      } else {
                        e.target.src = `https://fantasy.premierleague.com/dist/img/shirts/standard/shirt_${player.team_code}-110.png`;
                      }
                    }}
                />
                <p className="player-stat-name">{player.web_name}</p> 
                <p className="player-stat">{player.selected_by_percent}%</p>
                <p className="player-stat-transfers">
                  {(() => {
                    const netTransfers = player.transfers_in_event - player.transfers_out_event;
                    const formattedValue =
                      Math.abs(netTransfers) >= 1000
                        ? `${netTransfers > 0 ? '+' : ''}${(netTransfers / 1000).toFixed(1)}k`
                        : `${netTransfers > 0 ? '+' : ''}${netTransfers}`;

                    return (
                      <>
                        (<span className={netTransfers > 0 ? 'positive' : 'negative'}>
                          {formattedValue}
                        </span>)
                      </>
                    );
                  })()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="player-pics player-pics-lists">
        <p className="top-10-title">Top 10 xGI (Total Goal Involvements) </p> 
        {elements.length > 0 && (
          <div className="pics-wrapper">
            {filterPlayers(sortedPlayersXGI).slice(0, 10).map((player, index) => (
              <div key={player.code} className="player-pic-container">
                <img
                  className="player-pic-top-10"
                  src={`https://resources.premierleague.com/premierleague/photos/players/250x250/p${player.code}.png`}
                  alt={`player-${index + 1}`}
                  onError={(e) => {
                      if (player.element_type === 1) {
                        e.target.src = `https://fantasy.premierleague.com/dist/img/shirts/standard/shirt_${player.team_code}_1-110.png`;
                      } else {
                        e.target.src = `https://fantasy.premierleague.com/dist/img/shirts/standard/shirt_${player.team_code}-110.png`;
                      }
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
        <p className="top-10-title">Top 10 Goals (xG) </p> 
        {elements.length > 0 && (
          <div className="pics-wrapper">
            {filterPlayers(sortedPlayersGoals).slice(0, 10).map((player, index) => (
              <div key={player.code} className="player-pic-container">
                <img
                  className="player-pic-top-10"
                  src={`https://resources.premierleague.com/premierleague/photos/players/250x250/p${player.code}.png`}
                  alt={`player-${index + 1}`}
                  onError={(e) => {
                      if (player.element_type === 1) {
                        e.target.src = `https://fantasy.premierleague.com/dist/img/shirts/standard/shirt_${player.team_code}_1-110.png`;
                      } else {
                        e.target.src = `https://fantasy.premierleague.com/dist/img/shirts/standard/shirt_${player.team_code}-110.png`;
                      }
                    }}
                />
                <p className="player-stat-name">{player.web_name}</p>
                <p className="player-stat">{player.goals_scored}</p>
                <p className="player-stat">({player.expected_goals})</p> 
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="player-pics player-pics-lists">
        <p className="top-10-title">Top 10 Assists (xA) </p> 
        {elements.length > 0 && (
          <div className="pics-wrapper">
            {filterPlayers(sortedPlayersAssists).slice(0, 10).map((player, index) => (
              <div key={player.code} className="player-pic-container">
                <img
                  className="player-pic-top-10"
                  src={`https://resources.premierleague.com/premierleague/photos/players/250x250/p${player.code}.png`}
                  alt={`player-${index + 1}`}
                  onError={(e) => {
                      if (player.element_type === 1) {
                        e.target.src = `https://fantasy.premierleague.com/dist/img/shirts/standard/shirt_${player.team_code}_1-110.png`;
                      } else {
                        e.target.src = `https://fantasy.premierleague.com/dist/img/shirts/standard/shirt_${player.team_code}-110.png`;
                      }
                    }}
                />
                <p className="player-stat-name">{player.web_name}</p>
                <p className="player-stat">{player.assists}</p>
                <p className="player-stat">({player.expected_assists})</p> 
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="player-pics player-pics-lists">
        <p className="top-10-title">Top 10 xG Over Performance (Goals) </p> 
        {elements.length > 0 && (
          <div className="pics-wrapper">
            {filterPlayers(sortedPlayersXGOverPerformance).slice(0, 10).map((player, index) => (
              <div key={player.code} className="player-pic-container">
                <img
                  className="player-pic-top-10"
                  src={`https://resources.premierleague.com/premierleague/photos/players/250x250/p${player.code}.png`}
                  alt={`player-${index + 1}`}
                  onError={(e) => {
                      if (player.element_type === 1) {
                        e.target.src = `https://fantasy.premierleague.com/dist/img/shirts/standard/shirt_${player.team_code}_1-110.png`;
                      } else {
                        e.target.src = `https://fantasy.premierleague.com/dist/img/shirts/standard/shirt_${player.team_code}-110.png`;
                      }
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
        <p className="top-10-title">Top 10 xG Under Performance (Goals) </p> 
        {elements.length > 0 && (
          <div className="pics-wrapper">
            {filterPlayers(sortedPlayersXGUnderPerformance).slice(0, 10).map((player, index) => (
              <div key={player.code} className="player-pic-container">
                <img
                  className="player-pic-top-10"
                  src={`https://resources.premierleague.com/premierleague/photos/players/250x250/p${player.code}.png`}
                  alt={`player-${index + 1}`}
                  onError={(e) => {
                      if (player.element_type === 1) {
                        e.target.src = `https://fantasy.premierleague.com/dist/img/shirts/standard/shirt_${player.team_code}_1-110.png`;
                      } else {
                        e.target.src = `https://fantasy.premierleague.com/dist/img/shirts/standard/shirt_${player.team_code}-110.png`;
                      }
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
        <p className="top-10-title">Top 10 Bonus (Per 90 minutes)</p> 
        {elements.length > 0 && (
          <div className="pics-wrapper">
            {filterPlayers(top10Bonus).slice(0, 10).map((player, index) => (
              <div key={player.code} className="player-pic-container">
                <img
                  className="player-pic-top-10"
                  src={`https://resources.premierleague.com/premierleague/photos/players/250x250/p${player.code}.png`}
                  alt={`player-${index + 1}`}
                  onError={(e) => {
                      if (player.element_type === 1) {
                        e.target.src = `https://fantasy.premierleague.com/dist/img/shirts/standard/shirt_${player.team_code}_1-110.png`;
                      } else {
                        e.target.src = `https://fantasy.premierleague.com/dist/img/shirts/standard/shirt_${player.team_code}-110.png`;
                      }
                    }}
                />
                <p className="player-stat-name">{player.web_name}</p>
                <p className="player-stat">{player.bonus}</p>
                <p className="player-stat">({((player.bonus / player.minutes)*90).toFixed(2)})</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="player-pics player-pics-lists">
        <p className="top-10-title">Top 10 BPS (Per 90 Minutes)</p> 
        {elements.length > 0 && (
          <div className="pics-wrapper">
            {filterPlayers(top10BPS).slice(0, 10).map((player, index) => (
              <div key={player.code} className="player-pic-container">
                <img
                  className="player-pic-top-10"
                  src={`https://resources.premierleague.com/premierleague/photos/players/250x250/p${player.code}.png`}
                  alt={`player-${index + 1}`}
                  onError={(e) => {
                      if (player.element_type === 1) {
                        e.target.src = `https://fantasy.premierleague.com/dist/img/shirts/standard/shirt_${player.team_code}_1-110.png`;
                      } else {
                        e.target.src = `https://fantasy.premierleague.com/dist/img/shirts/standard/shirt_${player.team_code}-110.png`;
                      }
                    }}
                />
                <p className="player-stat-name">{player.web_name}</p>
                <p className="player-stat">{player.bps}</p>
                <p className="player-stat">({((player.bps / player.minutes)*90).toFixed(2)})</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="player-pics player-pics-lists">
        <p className="top-10-title">Top 10 Points Per Million</p> 
        {elements.length > 0 && (
          <div className="pics-wrapper">
            {filterPlayers(top10PointsPerMillion).slice(0, 10).map((player, index) => (
              <div key={player.code} className="player-pic-container">
                <img
                  className="player-pic-top-10"
                  src={`https://resources.premierleague.com/premierleague/photos/players/250x250/p${player.code}.png`}
                  alt={`player-${index + 1}`}
                  onError={(e) => {
                      if (player.element_type === 1) {
                        e.target.src = `https://fantasy.premierleague.com/dist/img/shirts/standard/shirt_${player.team_code}_1-110.png`;
                      } else {
                        e.target.src = `https://fantasy.premierleague.com/dist/img/shirts/standard/shirt_${player.team_code}-110.png`;
                      }
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
