import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import "./Top10Page.css";

const Top10Page = ({ mainData, teams, fixturesData }) => {
  const elements = useMemo(() => mainData && Array.isArray(mainData.elements) ? mainData.elements : [], [mainData]);

  // Calculate overall rank based on total points
  const sortedElementsForOverallRank = [...elements].sort((a, b) => b.total_points - a.total_points);
  const elementsWithOverallRank = sortedElementsForOverallRank.map((player, index) => ({
    ...player,
    overallRank: index + 1,
  }));

  // Calculate overall rank based on form
  const sortedElementsForOverallFormRank = [...elements].sort((a, b) => b.form - a.form);
  const elementsWithOverallFormRank = sortedElementsForOverallFormRank.map((player, index) => ({
    ...player,
    overallFormRank: index + 1,
  }));

  // Calculate overall rank based on GW points
  const sortedElementsForOverallGWPointsRank = [...elements].sort((a, b) => b.event_points - a.event_points);
  const elementsWithOverallGWPointsRank = sortedElementsForOverallGWPointsRank.map((player, index) => ({
    ...player,
    overallGWPointsRank: index + 1,
  }));

  // Calculate overall rank based on ownership
  const sortedElementsForOverallOwnershipRank = [...elements].sort((a, b) => b.selected_by_percent - a.selected_by_percent);
  const elementsWithOverallOwnershipRank = sortedElementsForOverallOwnershipRank.map((player, index) => ({
    ...player,
    overallOwnershipRank: index + 1,
  }));

  // Calculate overall rank based on xGI
  const sortedElementsForOverallXGIRank = [...elements].sort((a, b) => b.expected_goal_involvements - a.expected_goal_involvements);
  const elementsWithOverallXGIRank = sortedElementsForOverallXGIRank.map((player, index) => ({
    ...player,
    overallXGIRank: index + 1,
  }));

  // Calculate overall rank based on goals scored
  const sortedElementsForOverallGoalsRank = [...elements].sort((a, b) => b.goals_scored - a.goals_scored);
  const elementsWithOverallGoalsRank = sortedElementsForOverallGoalsRank.map((player, index) => ({
    ...player,
    overallGoalsRank: index + 1,
  }));

  // Calculate overall rank based on assists
  const sortedElementsForOverallAssistsRank = [...elements].sort((a, b) => b.assists - a.assists);
  const elementsWithOverallAssistsRank = sortedElementsForOverallAssistsRank.map((player, index) => ({
    ...player,
    overallAssistsRank: index + 1,
  }));

  // Calculate overall rank based on xG Over Performance
  const sortedElementsForOverallXGOverPerformanceRank = [...elements]
    .map(player => ({
      ...player,
      xGOverPerformance: player.goals_scored - player.expected_goals
    }))
    .filter(player => player.xGOverPerformance >= 0)
    .sort((a, b) => b.xGOverPerformance - a.xGOverPerformance);
  const elementsWithOverallXGOverPerformanceRank = sortedElementsForOverallXGOverPerformanceRank.map((player, index) => ({
    ...player,
    overallXGOverPerformanceRank: index + 1,
  }));

  // Calculate overall rank based on xG Under Performance
  const sortedElementsForOverallXGUnderPerformanceRank = [...elements]
    .map(player => ({
      ...player,
      xGUnderPerformance: (player.expected_goals || 0) - (player.goals_scored || 0)
    }))
    .filter(player => player.xGUnderPerformance >= 0)
    .sort((a, b) => b.xGUnderPerformance - a.xGUnderPerformance);
  const elementsWithOverallXGUnderPerformanceRank = sortedElementsForOverallXGUnderPerformanceRank.map((player, index) => ({
    ...player,
    overallXGUnderPerformanceRank: index + 1,
  }));

  // Calculate overall rank based on clean sheets
  const sortedElementsForOverallCleanSheetsRank = [...elements].sort((a, b) => (b.clean_sheets || 0) - (a.clean_sheets || 0));
  const elementsWithOverallCleanSheetsRank = sortedElementsForOverallCleanSheetsRank.map((player, index) => ({
    ...player,
    overallCleanSheetsRank: index + 1,
  }));

  // Calculate overall rank based on defensive contributions
  const sortedElementsForOverallDefensiveContributionsRank = [...elements].sort((a, b) => (b.defensive_contribution || 0) - (a.defensive_contribution || 0));
  const elementsWithOverallDefensiveContributionsRank = sortedElementsForOverallDefensiveContributionsRank.map((player, index) => ({
    ...player,
    overallDefensiveContributionsRank: index + 1,
  }));

  // Calculate overall rank based on bonus
  const sortedElementsForOverallBonusRank = [...elements].sort((a, b) => b.bonus - a.bonus);
  const elementsWithOverallBonusRank = sortedElementsForOverallBonusRank.map((player, index) => ({
    ...player,
    overallBonusRank: index + 1,
  }));

  // Calculate overall rank based on BPS
  const sortedElementsForOverallBPSRank = [...elements].sort((a, b) => b.bps - a.bps);
  const elementsWithOverallBPSRank = sortedElementsForOverallBPSRank.map((player, index) => ({
    ...player,
    overallBPSRank: index + 1,
  }));

  // Calculate overall rank based on points per million
  const sortedElementsForOverallPointsPerMillionRank = [...elements].sort((a, b) => (b.total_points / b.now_cost) - (a.total_points / a.now_cost));
  const elementsWithOverallPointsPerMillionRank = sortedElementsForOverallPointsPerMillionRank.map((player, index) => ({
    ...player,
    overallPointsPerMillionRank: index + 1,
  }));
  const [selectedTeamIds, setSelectedTeamIds] = useState([]);
  const [selectedPositions, setSelectedPositions] = useState([]);
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [selectedSeason, setSelectedSeason] = useState("current");
  const [historicalData, setHistoricalData] = useState(null);
  const [allTimeData, setAllTimeData] = useState(null);
  const [loadingHistorical, setLoadingHistorical] = useState(false);
  const [isTeamDropdownOpen, setIsTeamDropdownOpen] = useState(false);
  const [isPositionDropdownOpen, setIsPositionDropdownOpen] = useState(false);
  const [isPriceDropdownOpen, setIsPriceDropdownOpen] = useState(false);
  const [isSeasonDropdownOpen, setIsSeasonDropdownOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 500);
  const [fixtureData, setFixtureData] = useState(null);
  const [elementsWithOverallDefensiveContributionsPerStartRank, setElementsWithOverallDefensiveContributionsPerStartRank] = useState([]);

  const teamDropdownRef = useRef(null);
  const positionDropdownRef = useRef(null);
  const priceDropdownRef = useRef(null);
  const seasonDropdownRef = useRef(null);

  const seasons = [
    { id: "all-time", name: "All Time" },
    { id: "current", name: "2025/26" },
    { id: "2024/25", name: "2024/25" },
    { id: "2023/24", name: "2023/24" },
    { id: "2022/23", name: "2022/23" },
    { id: "2021/22", name: "2021/22" },
    { id: "2020/21", name: "2020/21" },
    { id: "2019/20", name: "2019/20" },
    { id: "2018/19", name: "2018/19" },
    { id: "2017/18", name: "2017/18" },
    { id: "2016/17", name: "2016/17" },
    { id: "2015/16", name: "2015/16" },
    { id: "2014/15", name: "2014/15" },
    { id: "2013/14", name: "2013/14" },
    { id: "2012/13", name: "2012/13" },
    { id: "2011/12", name: "2011/12" },
    { id: "2010/11", name: "2010/11" },
    { id: "2009/10", name: "2009/10" },
    { id: "2008/09", name: "2008/09" },
    { id: "2007/08", name: "2007/08" },
    { id: "2006/07", name: "2006/07" }
  ];
  
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

  // Function to fetch historical data for all players
  const fetchHistoricalData = useCallback(async (season) => {
    if (season === "current") {
      setHistoricalData(null);
      setAllTimeData(null);
      return;
    }

    setLoadingHistorical(true);
    try {
      const historicalPlayers = [];
      
      // Fetch historical data for ALL current players to get better coverage
      const allPlayers = elements;
      
      // Process players in batches to avoid overwhelming the API
      const batchSize = 50;
      for (let i = 0; i < allPlayers.length; i += batchSize) {
        const batch = allPlayers.slice(i, i + batchSize);
        
        const batchPromises = batch.map(async (player) => {
          try {
            const response = await fetch(`https://fpl-server-nine.vercel.app/api?endpoint=element-summary&playerId=${player.id}`);
            if (response.ok) {
              const data = await response.json();
              
              if (season === "all-time") {
                // Aggregate all historical seasons
                const allSeasons = data.history_past || [];
                if (allSeasons.length > 0) {
                  const aggregatedData = allSeasons.reduce((acc, seasonData) => ({
                    total_points: acc.total_points + (seasonData.total_points || 0),
                    goals_scored: acc.goals_scored + (seasonData.goals_scored || 0),
                    assists: acc.assists + (seasonData.assists || 0),
                    clean_sheets: acc.clean_sheets + (seasonData.clean_sheets || 0),
                    bonus: acc.bonus + (seasonData.bonus || 0),
                    bps: acc.bps + (seasonData.bps || 0),
                    minutes: acc.minutes + (seasonData.minutes || 0),
                    starts: acc.starts + (seasonData.starts || 0),
                    expected_goals: acc.expected_goals + (parseFloat(seasonData.expected_goals) || 0),
                    expected_assists: acc.expected_assists + (parseFloat(seasonData.expected_assists) || 0)
                  }), {
                    total_points: 0, goals_scored: 0, assists: 0, clean_sheets: 0,
                    bonus: 0, bps: 0, minutes: 0, starts: 0, expected_goals: 0, expected_assists: 0
                  });
                  
                  return {
                    ...player,
                    historical: {
                      ...aggregatedData,
                      expected_goals: aggregatedData.expected_goals.toFixed(2),
                      expected_assists: aggregatedData.expected_assists.toFixed(2)
                    }
                  };
                }
              } else {
                // Single season data
                const seasonData = data.history_past?.find(h => h.season_name === season);
                if (seasonData && seasonData.total_points > 0) {
                  return {
                    ...player,
                    historical: seasonData
                  };
                }
              }
            }
          } catch (error) {
            console.error(`Error fetching data for player ${player.id}:`, error);
          }
          return null;
        });
        
        const batchResults = await Promise.all(batchPromises);
        const validResults = batchResults.filter(result => result !== null);
        historicalPlayers.push(...validResults);
        
        // Add a small delay between batches to be respectful to the API
        if (i + batchSize < allPlayers.length) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }
      
      if (season === "all-time") {
        setAllTimeData(historicalPlayers);
        setHistoricalData(null);
      } else {
        setHistoricalData(historicalPlayers);
        setAllTimeData(null);
      }
    } catch (error) {
      console.error('Error fetching historical data:', error);
    } finally {
      setLoadingHistorical(false);
    }
  }, [elements]);

  // Effect to fetch historical data when season changes
  useEffect(() => {
    if (selectedSeason !== "current") {
      fetchHistoricalData(selectedSeason);
    } else {
      setHistoricalData(null);
      setAllTimeData(null);
    }
  }, [selectedSeason, fetchHistoricalData]);

  // Effect to track mobile view changes
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 500);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchFixtureData = async () => {
        try {
            const response = await fetch('https://fpl-server-nine.vercel.app/api?endpoint=fixtures');
            if (!response.ok) {
                throw new Error('Failed to fetch fixture data');
            }
            const data = await response.json();
            setFixtureData(data);
        } catch (error) {
            console.error('Error fetching fixture data:', error);
        }
    };

    fetchFixtureData();
}, []);

  useEffect(() => {
    if (fixtureData && elements.length > 0) {
      const sortedElementsForOverallDefensiveContributionsPerStartRank = [...elements]
        .map(player => {
            let count = 0;
            const playerId = player.id;
            const playerPosition = player.element_type;

            if (fixtureData) {
                fixtureData.forEach(fixture => {
                    if (fixture.stats) {
                        const defensiveStat = fixture.stats.find(stat => stat.identifier === 'defensive_contribution');
                        if (defensiveStat) {
                            const homePlayers = defensiveStat.h;
                            const awayPlayers = defensiveStat.a;

                            const allPlayers = [...homePlayers, ...awayPlayers];

                            allPlayers.forEach(p => {
                                if (p.element === playerId) {
                                    if (playerPosition === 2 && p.value >= 10) { // Defender
                                        count++;
                                    } else if ((playerPosition === 3 || playerPosition === 4) && p.value >= 12) { // Midfielder or Forward
                                        count++;
                                    }
                                }
                            });
                        }
                    }
                });
            }
            return { ...player, benchmarkMetCount: count };
        })
        .sort((a, b) => b.benchmarkMetCount - a.benchmarkMetCount);
      const rankedElements = sortedElementsForOverallDefensiveContributionsPerStartRank.map((player, index) => ({
        ...player,
        overallDefensiveContributionsPerStartRank: index + 1,
      }));
      setElementsWithOverallDefensiveContributionsPerStartRank(rankedElements);
    }
  }, [fixtureData, elements]);
    
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (
          teamDropdownRef.current && !teamDropdownRef.current.contains(event.target) &&
          positionDropdownRef.current && !positionDropdownRef.current.contains(event.target) &&
          priceDropdownRef.current && !priceDropdownRef.current.contains(event.target) &&
          seasonDropdownRef.current && !seasonDropdownRef.current.contains(event.target)
        ) {
          setIsTeamDropdownOpen(false);
          setIsPositionDropdownOpen(false);
          setIsPriceDropdownOpen(false);
          setIsSeasonDropdownOpen(false);
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

    const handleSeasonSelect = (season) => {
      setSelectedSeason(season);
      setIsSeasonDropdownOpen(false);
    };

    const handleToggleDropdown = (event, dropdownType) => {
      event.stopPropagation();
      if (dropdownType === 'team') {
        setIsTeamDropdownOpen(prev => !prev);
        setIsPositionDropdownOpen(false);
        setIsPriceDropdownOpen(false);
        setIsSeasonDropdownOpen(false);
      } else if (dropdownType === 'position') {
        setIsPositionDropdownOpen(prev => !prev);
        setIsTeamDropdownOpen(false);
        setIsPriceDropdownOpen(false);
        setIsSeasonDropdownOpen(false);
      } else if (dropdownType === 'price') {
        setIsPriceDropdownOpen(prev => !prev);
        setIsTeamDropdownOpen(false);
        setIsPositionDropdownOpen(false);
        setIsSeasonDropdownOpen(false);
      } else if (dropdownType === 'season') {
        setIsSeasonDropdownOpen(prev => !prev);
        setIsTeamDropdownOpen(false);
        setIsPositionDropdownOpen(false);
        setIsPriceDropdownOpen(false);
      }
    };
  
    const displaySelectedTeams = () => {
      if (selectedTeamIds.length === 0 || selectedTeamIds.length === teams.length) {
        return 'All Teams';
      }
      return isMobileView 
        ? `${selectedTeamIds.length} Team${selectedTeamIds.length > 1 ? 's' : ''}`
        : `${selectedTeamIds.length} Team${selectedTeamIds.length > 1 ? 's' : ''} Selected`;
    };
  
    const displaySelectedPositions = () => {
      if (selectedPositions.length === positions.length || selectedPositions.length === 0) {
        return 'All Positions';
      }
      return isMobileView
        ? `${selectedPositions.length} Position${selectedPositions.length > 1 ? 's' : ''}`
        : `${selectedPositions.length} Position${selectedPositions.length > 1 ? 's' : ''} Selected`;
    };
    
    const displaySelectedPrice = () => selectedPrice ? `Max Price: £${selectedPrice}m` : `Max Price: £${maxPrice}m`;
    
    const displaySelectedSeason = () => {
      const season = seasons.find(s => s.id === selectedSeason);
      return season ? season.name : "2025/26";
    };
  
    // Get the appropriate data source based on selected season
    const getDataSource = () => {
      if (selectedSeason === "current") return elementsWithOverallRank;
      if (selectedSeason === "all-time") return allTimeData || [];
      return historicalData || [];
    };

    // Create sorted arrays based on current or historical data
    const createSortedArrays = () => {
      const dataSource = getDataSource();
      
      if (selectedSeason === "current") {
        return {
          totalPoints: [...dataSource].sort((a, b) => b.total_points - a.total_points),
          goals: elementsWithOverallGoalsRank,
          assists: elementsWithOverallAssistsRank,
          cleanSheets: elementsWithOverallCleanSheetsRank,
          bonus: elementsWithOverallBonusRank,
          bps: elementsWithOverallBPSRank
        };
      } else {
        return {
          totalPoints: [...dataSource].sort((a, b) => (b.historical?.total_points || 0) - (a.historical?.total_points || 0)),
          goals: [...dataSource].sort((a, b) => (b.historical?.goals_scored || 0) - (a.historical?.goals_scored || 0)),
          assists: [...dataSource].sort((a, b) => (b.historical?.assists || 0) - (a.historical?.assists || 0)),
          cleanSheets: [...dataSource].sort((a, b) => (b.historical?.clean_sheets || 0) - (a.historical?.clean_sheets || 0)),
          bonus: [...dataSource].sort((a, b) => (b.historical?.bonus || 0) - (a.historical?.bonus || 0)),
          bps: [...dataSource].sort((a, b) => (b.historical?.bps || 0) - (a.historical?.bps || 0))
        };
      }
    };

    const filterPlayers = (players) => {
      let filteredPlayers = players;
  
      if (selectedTeamIds.length > 0 && selectedTeamIds.length < teams.length) {
        filteredPlayers = filteredPlayers.filter(player => selectedTeamIds.includes(player.team));
      }
      if (selectedPositions.length > 0 && selectedPositions.length < positions.length) {
        filteredPlayers = filteredPlayers.filter(player => selectedPositions.includes(player.element_type));
      }
      if (selectedPrice !== null && selectedSeason === "current") {
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

        <div className="dropdown" ref={seasonDropdownRef} onClick={(event) => handleToggleDropdown(event, 'season')}>
          <span><strong>{displaySelectedSeason()}</strong></span>
          <span className="dropdown-arrow">▼</span>
          {isSeasonDropdownOpen && (
            <div className="dropdown-list">
              {seasons.map(season => (
                <div key={season.id} className="dropdown-item" onClick={(e) => { e.stopPropagation(); handleSeasonSelect(season.id); }}>
                  <input type="radio" checked={selectedSeason === season.id} readOnly />
                  {season.name}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {loadingHistorical && (
        <div className="loading-message">
          <p>⏳ Loading Historical Data... ⏳</p>
        </div>
      )}

      <div className="player-pics player-pics-lists">
        <p className="top-10-title">Top 10 Total Points</p> 
        {(selectedSeason === "current" ? elements.length > 0 : (selectedSeason === "all-time" ? allTimeData?.length > 0 : historicalData?.length > 0)) && (
          <div className="pics-wrapper category-scroll-wrapper">
            {filterPlayers(createSortedArrays().totalPoints).map((player, index) => (
              <div key={player.code} className="player-pic-container">
                <div className="player-rank">#{player.overallRank}</div>
                <img
                    className="player-pic-top-10"
                    src={`https://resources.premierleague.com/premierleague25/photos/players/110x140/${player.code}.png`}
                    alt={`player-${index + 1}`}
                    onError={(e) => {
                      if (player.element_type === 1) {
                        e.target.src = `https://fantasy.premierleague.com/dist/img/shirts/standard/shirt_${player.team_code}_1-220.png`;
                      } else {
                        e.target.src = `https://fantasy.premierleague.com/dist/img/shirts/standard/shirt_${player.team_code}-220.png`;
                      }
                    }}
                />
                <p className="player-stat-name">{player.web_name}</p>
                <p className="player-stat">
                  {selectedSeason === "current" ? player.total_points : (player.historical?.total_points || 0)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedSeason === "current" && (
        <div className="player-pics player-pics-lists">
          <p className="top-10-title">Top 10 Form (Last 4 Games Average)</p> 
          {elements.length > 0 && (
            <div className="pics-wrapper category-scroll-wrapper">
              {filterPlayers(elementsWithOverallFormRank).map((player, index) => (
                <div key={player.code} className="player-pic-container">
                  <div className="player-rank">#{player.overallFormRank}</div>
                  <img
                      className="player-pic-top-10"
                      src={`https://resources.premierleague.com/premierleague25/photos/players/110x140/${player.code}.png`}
                      alt={`player-${index + 1}`}
                      onError={(e) => {
                        if (player.element_type === 1) {
                          e.target.src = `https://fantasy.premierleague.com/dist/img/shirts/standard/shirt_${player.team_code}_1-220.png`;
                        } else {
                          e.target.src = `https://fantasy.premierleague.com/dist/img/shirts/standard/shirt_${player.team_code}-220.png`;
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
      )}

      {selectedSeason === "current" && (
        <div className="player-pics player-pics-lists">
          <p className="top-10-title">Top 10 GW Points</p> 
          {elements.length > 0 && (
            <div className="pics-wrapper category-scroll-wrapper">
              {filterPlayers(elementsWithOverallGWPointsRank).map((player, index) => (
                <div key={player.code} className="player-pic-container">
                  <div className="player-rank">#{player.overallGWPointsRank}</div>
                  <img
                    className="player-pic-top-10"
                    src={`https://resources.premierleague.com/premierleague25/photos/players/110x140/${player.code}.png`}
                    alt={`player-${index + 1}`}
                    onError={(e) => {
                        if (player.element_type === 1) {
                          e.target.src = `https://fantasy.premierleague.com/dist/img/shirts/standard/shirt_${player.team_code}_1-220.png`;
                        } else {
                          e.target.src = `https://fantasy.premierleague.com/dist/img/shirts/standard/shirt_${player.team_code}-220.png`;
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
      )}

      {selectedSeason === "current" && (
        <div className="player-pics player-pics-lists">
          <p className="top-10-title">Top 10 Owned Players (Net GW Transfers)</p> 
          {elements.length > 0 && (
            <div className="pics-wrapper category-scroll-wrapper">
              {filterPlayers(elementsWithOverallOwnershipRank).map((player, index) => (
                <div key={player.code} className="player-pic-container">
                  <div className="player-rank">#{player.overallOwnershipRank}</div>
                  <img
                    className="player-pic-top-10"
                    src={`https://resources.premierleague.com/premierleague25/photos/players/110x140/${player.code}.png`}
                    alt={`player-${index + 1}`}
                    onError={(e) => {
                        if (player.element_type === 1) {
                          e.target.src = `https://fantasy.premierleague.com/dist/img/shirts/standard/shirt_${player.team_code}_1-220.png`;
                        } else {
                          e.target.src = `https://fantasy.premierleague.com/dist/img/shirts/standard/shirt_${player.team_code}-220.png`;
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
      )}

      {selectedSeason === "current" && (
        <div className="player-pics player-pics-lists">
          <p className="top-10-title">Top 10 xGI (Total Goal Involvements) </p> 
          {elements.length > 0 && (
            <div className="pics-wrapper category-scroll-wrapper">
              {filterPlayers(elementsWithOverallXGIRank).map((player, index) => (
                <div key={player.code} className="player-pic-container">
                  <div className="player-rank">#{player.overallXGIRank}</div>
                  <img
                    className="player-pic-top-10"
                    src={`https://resources.premierleague.com/premierleague25/photos/players/110x140/${player.code}.png`}
                    alt={`player-${index + 1}`}
                    onError={(e) => {
                        if (player.element_type === 1) {
                          e.target.src = `https://fantasy.premierleague.com/dist/img/shirts/standard/shirt_${player.team_code}_1-220.png`;
                        } else {
                          e.target.src = `https://fantasy.premierleague.com/dist/img/shirts/standard/shirt_${player.team_code}-220.png`;
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
      )}

      <div className="player-pics player-pics-lists">
        <p className="top-10-title">Top 10 Goals (xG)</p> 
        {(selectedSeason === "current" ? elements.length > 0 : (selectedSeason === "all-time" ? allTimeData?.length > 0 : historicalData?.length > 0)) && (
          <div className="pics-wrapper category-scroll-wrapper">
            {filterPlayers(createSortedArrays().goals).map((player, index) => (
              <div key={player.code} className="player-pic-container">
                <div className="player-rank">#{player.overallGoalsRank}</div>
                <img
                  className="player-pic-top-10"
                  src={`https://resources.premierleague.com/premierleague25/photos/players/110x140/${player.code}.png`}
                  alt={`player-${index + 1}`}
                  onError={(e) => {
                      if (player.element_type === 1) {
                        e.target.src = `https://fantasy.premierleague.com/dist/img/shirts/standard/shirt_${player.team_code}_1-220.png`;
                      } else {
                        e.target.src = `https://fantasy.premierleague.com/dist/img/shirts/standard/shirt_${player.team_code}-220.png`;
                      }
                    }}
                />
                <p className="player-stat-name">{player.web_name}</p>
                <p className="player-stat">
                  {selectedSeason === "current" ? player.goals_scored : (player.historical?.goals_scored || 0)}
                </p>
                <p className="player-stat">
                  ({selectedSeason === "current" ? player.expected_goals : (player.historical?.expected_goals || "0.00")})
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="player-pics player-pics-lists">
        <p className="top-10-title">Top 10 Assists (xA)</p>
        {(selectedSeason === "current" ? elements.length > 0 : (selectedSeason === "all-time" ? allTimeData?.length > 0 : historicalData?.length > 0)) && (
          <div className="pics-wrapper category-scroll-wrapper">
            {filterPlayers(createSortedArrays().assists).map((player, index) => (
              <div key={player.code} className="player-pic-container">
                <div className="player-rank">#{player.overallAssistsRank}</div>
                <img
                  className="player-pic-top-10"
                  src={`https://resources.premierleague.com/premierleague25/photos/players/110x140/${player.code}.png`}
                  alt={`player-${index + 1}`}
                  onError={(e) => {
                      if (player.element_type === 1) {
                        e.target.src = `https://fantasy.premierleague.com/dist/img/shirts/standard/shirt_${player.team_code}_1-220.png`;
                      } else {
                        e.target.src = `https://fantasy.premierleague.com/dist/img/shirts/standard/shirt_${player.team_code}-220.png`;
                      }
                    }}
                />
                <p className="player-stat-name">{player.web_name}</p>
                <p className="player-stat">
                  {selectedSeason === "current" ? player.assists : (player.historical?.assists || 0)}
                </p>
                <p className="player-stat">
                  ({selectedSeason === "current" ? player.expected_assists : (player.historical?.expected_assists || "0.00")})
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedSeason === "current" && (
        <div className="player-pics player-pics-lists">
          <p className="top-10-title">Top 10 xG Over Performance (Goals) </p> 
          {elements.length > 0 && (
          <div className="pics-wrapper category-scroll-wrapper">
            {filterPlayers(elementsWithOverallXGOverPerformanceRank).map((player, index) => (
              <div key={player.code} className="player-pic-container">
                <div className="player-rank">#{player.overallXGOverPerformanceRank}</div>
                <img
                  className="player-pic-top-10"
                  src={`https://resources.premierleague.com/premierleague25/photos/players/110x140/${player.code}.png`}
                  alt={`player-${index + 1}`}
                  onError={(e) => {
                      if (player.element_type === 1) {
                        e.target.src = `https://fantasy.premierleague.com/dist/img/shirts/standard/shirt_${player.team_code}_1-220.png`;
                      } else {
                        e.target.src = `https://fantasy.premierleague.com/dist/img/shirts/standard/shirt_${player.team_code}-220.png`;
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
      )}

      {selectedSeason === "current" && (
        <div className="player-pics player-pics-lists">
          <p className="top-10-title">Top 10 xG Under Performance (Goals) </p> 
          {elements.length > 0 && (
          <div className="pics-wrapper category-scroll-wrapper">
            {filterPlayers(elementsWithOverallXGUnderPerformanceRank).map((player, index) => (
              <div key={player.code} className="player-pic-container">
                <div className="player-rank">#{player.overallXGUnderPerformanceRank}</div>
                <img
                  className="player-pic-top-10"
                  src={`https://resources.premierleague.com/premierleague25/photos/players/110x140/${player.code}.png`}
                  alt={`player-${index + 1}`}
                  onError={(e) => {
                      if (player.element_type === 1) {
                        e.target.src = `https://fantasy.premierleague.com/dist/img/shirts/standard/shirt_${player.team_code}_1-220.png`;
                      } else {
                        e.target.src = `https://fantasy.premierleague.com/dist/img/shirts/standard/shirt_${player.team_code}-220.png`;
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
      )}

      <div className="player-pics player-pics-lists">
        <p className="top-10-title">Top 10 Clean Sheets (Per Start)</p>
        {(selectedSeason === "current" ? elements.length > 0 : (selectedSeason === "all-time" ? allTimeData?.length > 0 : historicalData?.length > 0)) && (
          <div className="pics-wrapper category-scroll-wrapper">
            {filterPlayers(createSortedArrays().cleanSheets).map((player, index) => (
              <div key={player.code} className="player-pic-container">
                <div className="player-rank">#{player.overallCleanSheetsRank}</div>
                <img
                  className="player-pic-top-10"
                  src={`https://resources.premierleague.com/premierleague25/photos/players/110x140/${player.code}.png`}
                  alt={`player-${index + 1}`}
                  onError={(e) => {
                      if (player.element_type === 1) {
                        e.target.src = `https://fantasy.premierleague.com/dist/img/shirts/standard/shirt_${player.team_code}_1-220.png`;
                      } else {
                        e.target.src = `https://fantasy.premierleague.com/dist/img/shirts/standard/shirt_${player.team_code}-220.png`;
                      }
                    }}
                />
                <p className="player-stat-name">{player.web_name}</p>
                <p className="player-stat">
                  {selectedSeason === "current" ? (player.clean_sheets || 0) : (player.historical?.clean_sheets || 0)}
                </p>
                <p className="player-stat">
                  ({selectedSeason === "current"
                    ? (player.starts > 0
                        ? ((((player.clean_sheets || 0) / player.starts) * 100) % 1 === 0
                          ? (((player.clean_sheets || 0) / player.starts) * 100).toFixed(0)
                          : (((player.clean_sheets || 0) / player.starts) * 100).toFixed(1))
                        : "0")
                    : (player.historical?.starts > 0
                        ? ((((player.historical?.clean_sheets || 0) / player.historical?.starts) * 100) % 1 === 0
                          ? (((player.historical?.clean_sheets || 0) / player.historical?.starts) * 100).toFixed(0)
                          : (((player.historical?.clean_sheets || 0) / player.historical?.starts) * 100).toFixed(1))
                        : "0")
                  }%)
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedSeason === "current" && (
        <div className="player-pics player-pics-lists">
          <p className="top-10-title">Top 10 Defensive Contribution Actions (Per 90 Minutes)</p> 
          {elements.length > 0 && (
          <div className="pics-wrapper category-scroll-wrapper">
            {filterPlayers(elementsWithOverallDefensiveContributionsRank).map((player, index) => (
              <div key={player.code} className="player-pic-container">
                <div className="player-rank">#{player.overallDefensiveContributionsRank}</div>
                <img
                  className="player-pic-top-10"
                  src={`https://resources.premierleague.com/premierleague25/photos/players/110x140/${player.code}.png`}
                  alt={`player-${index + 1}`}
                  onError={(e) => {
                      if (player.element_type === 1) {
                        e.target.src = `https://fantasy.premierleague.com/dist/img/shirts/standard/shirt_${player.team_code}_1-220.png`;
                      } else {
                        e.target.src = `https://fantasy.premierleague.com/dist/img/shirts/standard/shirt_${player.team_code}-220.png`;
                      }
                    }}
                />
                <p className="player-stat-name">{player.web_name}</p>
                <p className="player-stat">{player.defensive_contribution || 0}</p>
                <p className="player-stat">({player.defensive_contribution_per_90.toFixed(2)})</p>
              </div>
            ))}
          </div>
        )}
        </div>
      )}

      {selectedSeason === "current" && (
        <div className="player-pics player-pics-lists">
          <p className="top-10-title">Top 10 Defensive Contributions (Per Start)</p> 
          {elements.length > 0 && (
          <div className="pics-wrapper category-scroll-wrapper">
            {filterPlayers(elementsWithOverallDefensiveContributionsPerStartRank).map((player, index) => (
              <div key={player.code} className="player-pic-container">
                <div className="player-rank">#{player.overallDefensiveContributionsPerStartRank}</div>
                <img
                  className="player-pic-top-10"
                  src={`https://resources.premierleague.com/premierleague25/photos/players/110x140/${player.code}.png`}
                  alt={`player-${index + 1}`}
                  onError={(e) => {
                      if (player.element_type === 1) {
                        e.target.src = `https://fantasy.premierleague.com/dist/img/shirts/standard/shirt_${player.team_code}_1-220.png`;
                      } else {
                        e.target.src = `https://fantasy.premierleague.com/dist/img/shirts/standard/shirt_${player.team_code}-220.png`;
                      }
                    }}
                />
                <p className="player-stat-name">{player.web_name}</p>
                <p className="player-stat">{player.benchmarkMetCount}</p>
                <p className="player-stat">({player.starts > 0 ? ((player.benchmarkMetCount / player.starts) * 100).toFixed(0) : 0}%)</p>
              </div>
            ))}
          </div>
        )}
        </div>
      )}

      <div className="player-pics player-pics-lists">
        <p className="top-10-title">Top 10 Bonus (Per 90 Minutes)</p>
        {(selectedSeason === "current" ? elements.length > 0 : (selectedSeason === "all-time" ? allTimeData?.length > 0 : historicalData?.length > 0)) && (
          <div className="pics-wrapper category-scroll-wrapper">
            {filterPlayers(createSortedArrays().bonus).map((player, index) => (
              <div key={player.code} className="player-pic-container">
                <div className="player-rank">#{player.overallBonusRank}</div>
                <img
                  className="player-pic-top-10"
                  src={`https://resources.premierleague.com/premierleague25/photos/players/110x140/${player.code}.png`}
                  alt={`player-${index + 1}`}
                  onError={(e) => {
                      if (player.element_type === 1) {
                        e.target.src = `https://fantasy.premierleague.com/dist/img/shirts/standard/shirt_${player.team_code}_1-220.png`;
                      } else {
                        e.target.src = `https://fantasy.premierleague.com/dist/img/shirts/standard/shirt_${player.team_code}-220.png`;
                      }
                    }}
                />
                <p className="player-stat-name">{player.web_name}</p>
                <p className="player-stat">
                  {selectedSeason === "current" ? player.bonus : (player.historical?.bonus || 0)}
                </p>
                <p className="player-stat">
                  ({selectedSeason === "current" 
                    ? (player.bonus > 0 && player.minutes > 0 ? ((player.bonus / player.minutes) * 90).toFixed(2) : "0.00")
                    : ((player.historical?.bonus || 0) > 0 && (player.historical?.minutes || 0) > 0 ? (((player.historical?.bonus || 0) / (player.historical?.minutes || 1)) * 90).toFixed(2) : "0.00")
                  })
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="player-pics player-pics-lists">
        <p className="top-10-title">Top 10 BPS (Per 90 Minutes)</p>
        {(selectedSeason === "current" ? elements.length > 0 : (selectedSeason === "all-time" ? allTimeData?.length > 0 : historicalData?.length > 0)) && (
          <div className="pics-wrapper category-scroll-wrapper">
            {filterPlayers(createSortedArrays().bps).map((player, index) => (
              <div key={player.code} className="player-pic-container">
                <div className="player-rank">#{player.overallBPSRank}</div>
                <img
                  className="player-pic-top-10"
                  src={`https://resources.premierleague.com/premierleague25/photos/players/110x140/${player.code}.png`}
                  alt={`player-${index + 1}`}
                  onError={(e) => {
                      if (player.element_type === 1) {
                        e.target.src = `https://fantasy.premierleague.com/dist/img/shirts/standard/shirt_${player.team_code}_1-220.png`;
                      } else {
                        e.target.src = `https://fantasy.premierleague.com/dist/img/shirts/standard/shirt_${player.team_code}-220.png`;
                      }
                    }}
                />
                <p className="player-stat-name">{player.web_name}</p>
                <p className="player-stat">
                  {selectedSeason === "current" ? player.bps : (player.historical?.bps || 0)}
                </p>
                <p className="player-stat">
                  ({selectedSeason === "current" 
                    ? (player.bps > 0 && player.minutes > 0 ? ((player.bps / player.minutes) * 90).toFixed(2) : "0.00")
                    : ((player.historical?.bps || 0) > 0 && (player.historical?.minutes || 0) > 0 ? (((player.historical?.bps || 0) / (player.historical?.minutes || 1)) * 90).toFixed(2) : "0.00")
                  })
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedSeason === "current" && (
        <div className="player-pics player-pics-lists">
          <p className="top-10-title">Top 10 Points Per Million</p> 
          {elements.length > 0 && (
          <div className="pics-wrapper category-scroll-wrapper">
            {filterPlayers(elementsWithOverallPointsPerMillionRank).map((player, index) => (
              <div key={player.code} className="player-pic-container">
                <div className="player-rank">#{player.overallPointsPerMillionRank}</div>
                <img
                  className="player-pic-top-10"
                  src={`https://resources.premierleague.com/premierleague25/photos/players/110x140/${player.code}.png`}
                  alt={`player-${index + 1}`}
                  onError={(e) => {
                      if (player.element_type === 1) {
                        e.target.src = `https://fantasy.premierleague.com/dist/img/shirts/standard/shirt_${player.team_code}_1-220.png`;
                      } else {
                        e.target.src = `https://fantasy.premierleague.com/dist/img/shirts/standard/shirt_${player.team_code}-220.png`;
                      }
                    }}
                />
                <p className="player-stat-name">{player.web_name}</p>
                <p className="player-stat">{player.total_points && player.now_cost ? ((player.total_points / player.now_cost) * 10).toFixed(2) : '0.00'}</p>
              </div>
            ))}
          </div>
        )}
        </div>
      )}
    </div>
  );
};

export default Top10Page;
