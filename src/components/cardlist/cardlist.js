import React, { useState, useEffect } from "react";
import Row from "../card/card"; 
import Dropdown from "../dropdown/dropdown"; 
import "./cardlist.css";
import Switch from '@mui/material/Switch';

export default function CardList({ teams, fixturesData, activeGameweek: initialActiveGameweek}) {
  const [numberOfGameweeks, setNumberOfGameweeks] = useState(5);
  const [sortOrder, setSortOrder] = useState("desc");
  const [sortBy, setSortBy] = useState("custom"); 
  const [showOriginalScore, setShowOriginalScore] = useState(true);
  const [activeGameweek, setActiveGameweek] = useState(initialActiveGameweek);

  // Update activeGameweek when the prop changes
  useEffect(() => {
    setActiveGameweek(initialActiveGameweek);
  }, [initialActiveGameweek]);

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

    // Calculate reversedTotalDifficulty correctly
    const reversedTotalDifficulty =
      (numberOfFixtures + extraFixturesCount) * 6 - totalDifficulty;

    return reversedTotalDifficulty;
  };

  const calculateDifficulty = (reversedTotalDifficulty) => {
    // Calculate difficulty logic (if needed)
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
      // Only add extra fixtures for the specified team
      extraFixturesCount += gameweek.length - 1;
    }

      if (gameweek.length === 0) {
        // Add 11 for each blank gameweek
        customTotalDifficulty += 11;
        continue; // Skip to the next iteration
      }

      customTotalDifficulty += gameweek.reduce((acc, fixture) => {
        const home = fixture.team_h === teamId;
        const opponentNumber = home ? fixture.team_a : fixture.team_h;
        const difficulty = home
          ? teams[opponentNumber]?.h_diff || 0
          : teams[opponentNumber]?.a_diff || 0;

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
    setActiveGameweek(newCustomActiveGameweek);  // Update activeGameweek prop
  };
  
  
  const handleTableReorder = () => {
    setSortBy((prevSortBy) => (prevSortBy === "original" ? "custom" : "original"));
  };

  const handleCustomSort = () => {
    setSortOrder((prevSortOrder) => (prevSortOrder === "asc" ? "desc" : "asc"));
  };

  // Remove the first team (index 0) before sorting and rendering
  const teamsToRender = teams.slice(1);

  const sortedTeams = [...teamsToRender];
  sortedTeams.sort((teamA, teamB) => {
    let valueA, valueB;

    if (sortBy === "original") {
      valueA = calculateReversedTotalDifficulty(teamA.id, numberOfGameweeks);
      valueB = calculateReversedTotalDifficulty(teamB.id, numberOfGameweeks);
    } else {
      valueA = calculateCustomDifficulty(teamA.id, numberOfGameweeks);
      valueB = calculateCustomDifficulty(teamB.id, numberOfGameweeks);
    }

    // Toggle sorting based on sortOrder
    if (sortOrder === "asc") {
      return valueA - valueB;
    } else {
      return valueB - valueA;
    }
  });

  const label = { inputProps: { 'aria-label': 'Switch demo' } };

  return (
    <div>
      <div className="gameweek-dropdown">
        <Dropdown handleGameweekChange={handleGameweekChange} activeGameweek={activeGameweek} />
      </div>
      
      <strong>Original FPL</strong>
        <Switch {...label} defaultChecked={sortBy === 'custom'} onChange={handleTableReorder} />
      <strong>Custom FDR</strong>

      <button
        className={`button ${sortBy === "custom" ? "active" : ""}`}
        onClick={handleCustomSort}
      >
        {sortOrder === "asc" ? "Sort ↑" : "Sort ↓"}
      </button>

      <strong>Active GW: </strong>
      <input
        type="number"
        min="1"
        max="38"
        value={activeGameweek}
        onChange={handleCustomGameweekChange}
      />

      <div className={`table ${showOriginalScore ? "original-fpl" : ""}`}>
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
          />
        ))}
      </div>
    </div>
  );
}