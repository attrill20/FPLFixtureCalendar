import React, { useState, useRef, useEffect } from 'react';
import "./Top10Page.css";

const Top10Page = ({ mainData, teams, fixturesData }) => {
  const elements = mainData && Array.isArray(mainData.elements) ? mainData.elements : [];
  const [selectedTeamIds, setSelectedTeamIds] = useState([]);
  const [selectedPositions, setSelectedPositions] = useState([]);
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [isTeamDropdownOpen, setIsTeamDropdownOpen] = useState(false);
  const [isPositionDropdownOpen, setIsPositionDropdownOpen] = useState(false);
  const [isPriceDropdownOpen, setIsPriceDropdownOpen] = useState(false);

  const teamDropdownRef = useRef(null);
  const positionDropdownRef = useRef(null);
  const priceDropdownRef = useRef(null);
  
  const sortedPlayersTotalPoints = [...elements].sort((a, b) => b.total_points - a.total_points);
  const sortedPlayersGWPoints = [...elements].sort((a, b) => b.event_points - a.event_points);
  const sortedPlayersForm = [...elements].sort((a, b) => b.form - a.form);
  const sortedPlayersOwnership = [...elements].sort((a, b) => b.selected_by_percent - a.selected_by_percent);
  const sortedPlayersXGI = [...elements].sort((a, b) => b.expected_goal_involvements - a.expected_goal_involvements);
  const sortedPlayersGoals = [...elements].sort((a, b) => b.goals_scored - a.goals_scored);
  const sortedPlayersAssists = [...elements].sort((a, b) => b.assists - a.assists);
  const top10CleanSheets = [...elements].sort((a, b) => (b.clean_sheets || 0) - (a.clean_sheets || 0));
  const top10DefensiveContributions = [...elements].sort((a, b) => (b.defensive_contributions || 0) - (a.defensive_contributions || 0));
  const top10Bonus = [...elements].sort((a, b) => b.bonus - a.bonus);
  const top10BPS = [...elements].sort((a, b) => b.bps - a.bps);
  const top10PointsPerMillion = [...elements].sort((a, b) => (b.total_points / b.now_cost) - (a.total_points / a.now_cost));

  const positions = [
    { id: 1, name: "Goalkeepers" },
    { id: 2, name: "Defenders" },
    { id: 3, name: "Midfielders" },
    { id: 4, name: "Forwards" },
    // { id: 5, name: "Managers" },
  ];

  const minPrice = 4.0;
  const maxPrice = Math.ceil(Math.max(...elements.map(player => player.now_cost / 10 || minPrice)));
  
  const priceOptions = [];
  for (let price = minPrice; price <= maxPrice; price += price < 10.0 ? 0.5 : 1.0) {
    priceOptions.push(price);
  }

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
          positionDropdownRef.current && !positionDropdownRef.current.contains(event.target) &&
          priceDropdownRef.current && !priceDropdownRef.current.contains(event.target)
        ) {
          setIsTeamDropdownOpen(false);
          setIsPositionDropdownOpen(false);
          setIsPriceDropdownOpen(false);
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
      if (positionId === "all") {
        setSelectedPositions([]);
      } else {
        setSelectedPositions(prevSelected =>
          prevSelected.includes(positionId)
            ? prevSelected.filter(id => id !== positionId)
            : [...prevSelected, positionId]
        );
      }
    };
    
    const handlePriceSelect = (price) => {
      setSelectedPrice(price);
      setIsPriceDropdownOpen(false);
    };

    const handleToggleDropdown = (event, dropdownType) => {
      event.stopPropagation();
      if (dropdownType === 'team') {
        setIsTeamDropdownOpen(prev => !prev);
        setIsPositionDropdownOpen(false);
        setIsPriceDropdownOpen(false);
      } else if (dropdownType === 'position') {
        setIsPositionDropdownOpen(prev => !prev);
        setIsTeamDropdownOpen(false);
        setIsPriceDropdownOpen(false);
      } else if (dropdownType === 'price') {
        setIsPriceDropdownOpen(prev => !prev);
        setIsTeamDropdownOpen(false);
        setIsPositionDropdownOpen(false);
      }
    };
  
    const displaySelectedTeams = () => (
      selectedTeamIds.length === 0 || selectedTeamIds.length === teams.length
        ? 'All Teams Selected'
        : `${selectedTeamIds.length} Team${selectedTeamIds.length > 1 ? 's' : ''} Selected`
    );
  
    const displaySelectedPositions = () => {
      return selectedPositions.length === positions.length || selectedPositions.length === 0
        ? 'All Positions Selected'
        : `${selectedPositions.length} Position${selectedPositions.length > 1 ? 's' : ''} Selected`;
    };
    
    const displaySelectedPrice = () => selectedPrice ? `Max Price: £${selectedPrice}m` : `Max Price: £${maxPrice}m`;
  
    const filterPlayers = (players) => {
      let filteredPlayers = players;
  
      if (selectedTeamIds.length > 0 && selectedTeamIds.length < teams.length) {
        filteredPlayers = filteredPlayers.filter(player => selectedTeamIds.includes(player.team));
      }
      if (selectedPositions.length > 0 && selectedPositions.length < positions.length) {
        filteredPlayers = filteredPlayers.filter(player => selectedPositions.includes(player.element_type));
      }
      if (selectedPrice !== null) {
        filteredPlayers = filteredPlayers.filter(player => (player.now_cost / 10) <= selectedPrice);
      }
      return filteredPlayers;
    };

  return (
    <div>
      <div className="top-10-sub-heading">
        <p>Use these Top 10 lists to help you notice current trends and in form players to help you decide who to pick for your team.</p>
        <p>'All Teams' and 'All Positions' and the highest 'Max Price' are all set as default, use the dropdowns to filter for a specific combination of teams, positions and price!</p>
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
              <div className="dropdown-item" onClick={() => handlePositionSelect("all")}>
              <input type="checkbox" checked={selectedPositions.length === 0} readOnly />
                All Positions
              </div>
              {positions.map(position => (
                <div 
                  key={position.id} 
                  className="dropdown-item" 
                  onClick={(e) => { e.stopPropagation(); handlePositionSelect(position.id); }}
                >
                  <input 
                    type="checkbox" 
                    checked={selectedPositions.includes(position.id)} 
                    readOnly 
                  />
                  {position.name}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="dropdown" ref={priceDropdownRef} onClick={(event) => handleToggleDropdown(event, 'price')}>
          <span><strong>{displaySelectedPrice()}</strong></span>
          <span className="dropdown-arrow">▼</span>
          {isPriceDropdownOpen && (
            <div className="dropdown-list">
              <div className="dropdown-item" onClick={() => handlePriceSelect(null)}>
                <input type="radio" checked={selectedPrice === null} readOnly />
                All Prices
              </div>
              {priceOptions.map(price => (
                <div key={price} className="dropdown-item" onClick={(e) => { e.stopPropagation(); handlePriceSelect(price); }}>
                  <input type="radio" checked={selectedPrice === price} readOnly />
                  £{price}m
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
                    src={
                      player.element_type === 5
                        ? `https://resources.premierleague.com/premierleague/photos/players/250x250/${player.opta_code}.png`
                        : `https://resources.premierleague.com/premierleague/photos/players/250x250/p${player.code}.png`
                    }
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
                    src={
                      player.element_type === 5
                        ? `https://resources.premierleague.com/premierleague/photos/players/250x250/${player.opta_code}.png`
                        : `https://resources.premierleague.com/premierleague/photos/players/250x250/p${player.code}.png`
                    }
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
                  src={
                    player.element_type === 5
                      ? `https://resources.premierleague.com/premierleague/photos/players/250x250/${player.opta_code}.png`
                      : `https://resources.premierleague.com/premierleague/photos/players/250x250/p${player.code}.png`
                  }
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
                  src={
                    player.element_type === 5
                      ? `https://resources.premierleague.com/premierleague/photos/players/250x250/${player.opta_code}.png`
                      : `https://resources.premierleague.com/premierleague/photos/players/250x250/p${player.code}.png`
                  }
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
                  src={
                    player.element_type === 5
                      ? `https://resources.premierleague.com/premierleague/photos/players/250x250/${player.opta_code}.png`
                      : `https://resources.premierleague.com/premierleague/photos/players/250x250/p${player.code}.png`
                  }
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
                  src={
                    player.element_type === 5
                      ? `https://resources.premierleague.com/premierleague/photos/players/250x250/${player.opta_code}.png`
                      : `https://resources.premierleague.com/premierleague/photos/players/250x250/p${player.code}.png`
                  }
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
                  src={
                    player.element_type === 5
                      ? `https://resources.premierleague.com/premierleague/photos/players/250x250/${player.opta_code}.png`
                      : `https://resources.premierleague.com/premierleague/photos/players/250x250/p${player.code}.png`
                  }
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
                  src={
                    player.element_type === 5
                      ? `https://resources.premierleague.com/premierleague/photos/players/250x250/${player.opta_code}.png`
                      : `https://resources.premierleague.com/premierleague/photos/players/250x250/p${player.code}.png`
                  }
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
                  src={
                    player.element_type === 5
                      ? `https://resources.premierleague.com/premierleague/photos/players/250x250/${player.opta_code}.png`
                      : `https://resources.premierleague.com/premierleague/photos/players/250x250/p${player.code}.png`
                  }
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
        <p className="top-10-title">Top 10 Clean Sheets (Per Start)</p> 
        {elements.length > 0 && (
          <div className="pics-wrapper">
            {filterPlayers(top10CleanSheets).slice(0, 10).map((player, index) => (
              <div key={player.code} className="player-pic-container">
                <img
                  className="player-pic-top-10"
                  src={
                    player.element_type === 5
                      ? `https://resources.premierleague.com/premierleague/photos/players/250x250/${player.opta_code}.png`
                      : `https://resources.premierleague.com/premierleague/photos/players/250x250/p${player.code}.png`
                  }
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
                <p className="player-stat">{player.clean_sheets || 0}</p>
                <p className="player-stat">({player.starts > 0 ? (((player.clean_sheets || 0) / player.starts) * 100).toFixed(1) : "0.0"}%)</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="player-pics player-pics-lists">
        <p className="top-10-title">Top 10 Defensive Contributions (Per Start)</p> 
        {elements.length > 0 && (
          <div className="pics-wrapper">
            {filterPlayers(top10DefensiveContributions).slice(0, 10).map((player, index) => (
              <div key={player.code} className="player-pic-container">
                <img
                  className="player-pic-top-10"
                  src={
                    player.element_type === 5
                      ? `https://resources.premierleague.com/premierleague/photos/players/250x250/${player.opta_code}.png`
                      : `https://resources.premierleague.com/premierleague/photos/players/250x250/p${player.code}.png`
                  }
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
                <p className="player-stat">{player.defensive_contributions || 0}</p>
                <p className="player-stat">({player.starts > 0 ? (((player.defensive_contributions || 0) / player.starts) * 100).toFixed(1) : "0.0"}%)</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="player-pics player-pics-lists">
        <p className="top-10-title">Top 10 Bonus (Per 90 Minutes)</p> 
        {elements.length > 0 && (
          <div className="pics-wrapper">
            {filterPlayers(top10Bonus).slice(0, 10).map((player, index) => (
              <div key={player.code} className="player-pic-container">
                <img
                  className="player-pic-top-10"
                  src={
                    player.element_type === 5
                      ? `https://resources.premierleague.com/premierleague/photos/players/250x250/${player.opta_code}.png`
                      : `https://resources.premierleague.com/premierleague/photos/players/250x250/p${player.code}.png`
                  }
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
                <p className="player-stat">({player.bonus > 0 && player.minutes > 0 ? ((player.bonus / player.minutes) * 90).toFixed(2) : "0.00"})</p>
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
                  src={
                    player.element_type === 5
                      ? `https://resources.premierleague.com/premierleague/photos/players/250x250/${player.opta_code}.png`
                      : `https://resources.premierleague.com/premierleague/photos/players/250x250/p${player.code}.png`
                  }
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
                <p className="player-stat">({player.bps > 0 && player.minutes > 0 ? ((player.bps / player.minutes) * 90).toFixed(2) : "0.00"})</p>
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
                  src={
                    player.element_type === 5
                      ? `https://resources.premierleague.com/premierleague/photos/players/250x250/${player.opta_code}.png`
                      : `https://resources.premierleague.com/premierleague/photos/players/250x250/p${player.code}.png`
                  }
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
    </div>
  );
};

export default Top10Page;
