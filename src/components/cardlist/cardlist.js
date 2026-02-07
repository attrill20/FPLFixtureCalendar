import React, { useState, useEffect } from "react";
import Row from "../card/card"; 
import Dropdown from "../dropdown/dropdown"; 
import "./cardlist.css";
import Switch from '@mui/material/Switch';

export default function CardList({ teams, fixturesData, activeGameweek: initialActiveGameweek}) {
  const [numberOfGameweeks, setNumberOfGameweeks] = useState(5);
  const [sortOrder, setSortOrder] = useState("desc");
  const [sortBy, setSortBy] = useState("custom");
  const [sortColumn, setSortColumn] = useState("fdr"); // 'team', 'fdr', or 'gw-N'
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 800); 
  const [showOriginalScore] = useState(true);
  const [activeGameweek, setActiveGameweek] = useState(initialActiveGameweek || 1);

  // Update activeGameweek when the prop changes
  useEffect(() => {
    setActiveGameweek(initialActiveGameweek);
  }, [initialActiveGameweek]);

  // Listen for window resize to update mobile state
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 800);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const calculateReversedTotalDifficulty = (teamId, numberOfFixtures) => {
    if (!fixturesData) return 0;

    const teamFixtures = fixturesData.filter(
      (fixture) => fixture.team_h === teamId || fixture.team_a === teamId
    );

    const gameweekFixtures = new Array(numberOfFixtures)
      .fill(null)
      .map(() => []);

    let totalDifficulty = 0; // Initialize totalDifficulty for the team
    let extraFixturesCount = 0; // Initialize extra fixtures count for the specified team

    for (let i = activeGameweek - 1; i < Math.min(activeGameweek + numberOfGameweeks - 1, 38); i++) {
      const gameweek = teamFixtures.filter(
        (fixture) => fixture.event === i + 1
      );

      // Check if the team has more than one fixture in the same gameweek
      if (gameweek.length > 1) {
        // Only add extra fixtures for the specified team
        extraFixturesCount += gameweek.length - 1;
      }

      const gameweekDifficulty = gameweek.reduce((acc, fixture) => {
        const home = fixture.team_h === teamId;
        const difficulty = home
          ? fixture.team_h_difficulty
          : fixture.team_a_difficulty;
        return acc + difficulty;
      }, 0);

      if (gameweek.length > 0) {
        gameweekFixtures[i - (activeGameweek - 1)] = gameweek.map((fixture) => {
          const opponentNumber =
            fixture.team_h === teamId ? fixture.team_a : fixture.team_h;
          const opponent = teams
            ? fixture.team_h === teamId
              ? teams[fixture.team_a].name
              : teams[fixture.team_h].name
            : "";

          const home = fixture.team_h === teamId;
          const difficulty = home
            ? fixture.team_h_difficulty
            : fixture.team_a_difficulty;

          return {
            opponent,
            opponentNumber,
            home,
            difficulty,
            eventNumber: fixture.event,
          };
        });
      } else {
        gameweekFixtures[i - (activeGameweek - 1)].push({
          opponent: "BLANK",
          opponentNumber: 0,
          difficulty: 6,
          eventNumber: i + 1,
        });
          
        // Add 6 for each blank gameweek
        totalDifficulty += 6;
      }

      totalDifficulty += gameweekDifficulty;
    }

    const reversedTotalDifficulty =
      (numberOfFixtures + extraFixturesCount) * 6 - totalDifficulty;

    return reversedTotalDifficulty;
  };

  const calculateCustomDifficulty = (teamId, numberOfFixtures) => {
    if (!fixturesData) return 0;

    const teamFixtures = fixturesData.filter(
      (fixture) => fixture.team_h === teamId || fixture.team_a === teamId
    );

    let customTotalDifficulty = 0;
    let extraFixturesCount = 0;

    for (let i = activeGameweek - 1; i < Math.min(activeGameweek + numberOfGameweeks - 1, 38); i++) {
      const gameweek = teamFixtures.filter(
        (fixture) => fixture.event === i + 1
      );

    // Check if the team has more than one fixture in the same gameweek
    if (gameweek.length > 1) {
      extraFixturesCount += gameweek.length - 1;
    }

      if (gameweek.length === 0) {
        // Add 11 for each blank gameweek
        customTotalDifficulty += 11;
        continue;
      }

      customTotalDifficulty += gameweek.reduce((acc, fixture) => {
        const home = fixture.team_h === teamId;
        const opponentNumber = home ? fixture.team_a : fixture.team_h;
        const difficulty = home
          ? teams[opponentNumber]?.a_diff || 0
          : teams[opponentNumber]?.h_diff || 0;

        return acc + difficulty;
      }, 0);
    }

    const reversedCustomDifficulty =
    (numberOfFixtures + extraFixturesCount) * 11 - customTotalDifficulty;

    return reversedCustomDifficulty;
  };

  const handleGameweekChange = (event) => {
    const newNumberOfGameweeks = parseInt(event.target.value, 10);
    setNumberOfGameweeks(newNumberOfGameweeks);
  };

  const handleCustomGameweekChange = (event) => {
    const newCustomActiveGameweek = parseInt(event.target.value, 10);
    setActiveGameweek(newCustomActiveGameweek);
  };
  
  
  const handleTableReorder = () => {
    setSortBy((prevSortBy) => (prevSortBy === "original" ? "custom" : "original"));
  };

  const handleColumnSort = (column) => {
    if (sortColumn === column) {
      setSortOrder(prev => prev === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortOrder(column === "team" ? "asc" : "desc");
    }
  };

  const sortArrow = (column) => {
    const isActive = sortColumn === column;
    const icon = isActive ? (sortOrder === 'asc' ? '▲' : '▼') : '↕';
    return <span className={`sort-icon ${isActive ? 'active' : ''}`}>{icon}</span>;
  };

  const getGameweekDifficulty = (teamId, gwNumber) => {
    if (!fixturesData) return 99;
    const teamFixtures = fixturesData.filter(
      f => (f.team_h === teamId || f.team_a === teamId) && f.event === gwNumber
    );
    if (teamFixtures.length === 0) return 99; // blank = sort to end
    return teamFixtures.reduce((total, fixture) => {
      const home = fixture.team_h === teamId;
      if (sortBy === "original") {
        return total + (home ? fixture.team_h_difficulty : fixture.team_a_difficulty);
      } else {
        const opponentNumber = home ? fixture.team_a : fixture.team_h;
        return total + (home ? (teams[opponentNumber]?.a_diff || 0) : (teams[opponentNumber]?.h_diff || 0));
      }
    }, 0);
  };

  const teamsToRender = teams.slice(1);
  
  // Responsive design logic
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const isNarrowScreen = screenWidth < 1650;
  const shouldCompactOpponents = isNarrowScreen && numberOfGameweeks >= 8;
  
  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const sortedTeams = [...teamsToRender];
  sortedTeams.sort((teamA, teamB) => {
    let valueA, valueB;

    if (sortColumn === "team") {
      const nameA = teams[teamA.id]?.name || teamA.name || '';
      const nameB = teams[teamB.id]?.name || teamB.name || '';
      const cmp = nameA.localeCompare(nameB);
      return sortOrder === "asc" ? cmp : -cmp;
    } else if (sortColumn.startsWith("gw-")) {
      const gwNum = parseInt(sortColumn.split("-")[1], 10);
      valueA = getGameweekDifficulty(teamA.id, gwNum);
      valueB = getGameweekDifficulty(teamB.id, gwNum);
    } else {
      // fdr
      if (sortBy === "original") {
        valueA = calculateReversedTotalDifficulty(teamA.id, numberOfGameweeks);
        valueB = calculateReversedTotalDifficulty(teamB.id, numberOfGameweeks);
      } else {
        valueA = calculateCustomDifficulty(teamA.id, numberOfGameweeks);
        valueB = calculateCustomDifficulty(teamB.id, numberOfGameweeks);
      }
    }

    if (sortOrder === "asc") {
      return valueA - valueB;
    } else {
      return valueB - valueA;
    }
  });

  const label = { inputProps: { 'aria-label': 'Switch demo' } };

  const handleIncrement = () => {
    setActiveGameweek((prev) => Math.min(prev + 1, 38));
  };

  const handleDecrement = () => {
    setActiveGameweek((prev) => Math.max(prev - 1, 1));
  };

  return (
      <div>
        <div className="container-cardlist-tools">
          <div className="fdr-selector-group">
            <strong className="tool-text">FPL FDR</strong>
            <Switch className="switch" {...label} defaultChecked={sortBy === 'custom'} onChange={handleTableReorder}/>
            <strong className="tool-text">Oracle FDR</strong>
          </div>

          <div className="input-container-cardlist">
            <label htmlFor="gameweek" className="tool-text"><strong>{isMobile ? "GW: " : "Active GW: "}</strong></label>
            <div className="input-wrapper">
                <button className="minus-button" onClick={() => handleDecrement(handleCustomGameweekChange, activeGameweek)}>-</button>
                <input
                    id="gameweek"
                    className="active-gameweek-input"
                    type="number"
                    min="1"
                    max="38"
                    value={activeGameweek !== null ? activeGameweek : ""}
                    onChange={handleCustomGameweekChange}
                />
                <button className="plus-button" onClick={() => handleIncrement(handleCustomGameweekChange, activeGameweek)}>+</button>
            </div>
          </div>

          <div className="gameweek-dropdown">
            <Dropdown handleGameweekChange={handleGameweekChange} activeGameweek={activeGameweek} />
          </div>
        </div>

      <div className={`table ${showOriginalScore ? "original-fpl" : ""}`}>
        <table className="fixtures-table with-border">
          <thead className="table-header">
            <tr>
              <th className="team-column sortable-header" onClick={() => handleColumnSort('team')}>
                Team{sortArrow('team')}
              </th>
              <th className="fdr-column sortable-header" onClick={() => handleColumnSort('fdr')}>
                FDR{sortArrow('fdr')}
              </th>
              {Array.from({length: numberOfGameweeks}, (_, index) => {
                const gameweekNumber = activeGameweek + index;
                const colKey = `gw-${gameweekNumber}`;
                return gameweekNumber <= 38 ? (
                  <th key={index} className="sortable-header" onClick={() => handleColumnSort(colKey)}>
                    {`GW ${gameweekNumber}`}{sortArrow(colKey)}
                  </th>
                ) : null;
              })}
            </tr>
          </thead>
          <tbody>
            {sortedTeams.map((team, index) => (
              <Row
                teams={teams}
                fixturesData={fixturesData}
                teamIndex={team.id}
                numberOfFixtures={numberOfGameweeks}
                calculateDifficulty={sortBy === "original" ? calculateReversedTotalDifficulty : calculateCustomDifficulty}
                reversedTotalDifficulty={sortBy === "original" ? calculateReversedTotalDifficulty(team.id, numberOfGameweeks) : calculateCustomDifficulty(team.id, numberOfGameweeks)}
                activeGameweek={activeGameweek}
                showOriginalScore={sortBy === "original"}
                showCustomScore={sortBy === "custom"}
                key={index}
                isTableRow={true}
                isNarrowScreen={isNarrowScreen}
                shouldCompactOpponents={shouldCompactOpponents}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}