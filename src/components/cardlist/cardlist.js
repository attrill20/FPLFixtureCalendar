import React, { useState } from "react";
import Row from "../card/card";
import Dropdown from "../dropdown/dropdown";
import "./cardlist.css";

export default function CardList({ teams, fixturesData }) {
  const [numberOfGameweeks, setNumberOfGameweeks] = useState(5);
  const [sortOrder, setSortOrder] = useState("desc");

  function getFixturesForTeam(teamId, numberOfFixtures) {
    if (!fixturesData) {
      return { fixtures: [], totalDifficulty: 0, reversedTotalDifficulty: 0 };
    }

    const teamFixtures = fixturesData.filter(
      (fixture) => fixture.team_h === teamId || fixture.team_a === teamId
    );

    // Calculate the total difficulty and return the requested number of fixtures
    const nextFixtures = teamFixtures
      .slice(0, numberOfFixtures)
      .map((fixture) => {
        const opponent =
          fixture.team_h === teamId
            ? teams[fixture.team_a].name
            : teams[fixture.team_h].name;
        const home = fixture.team_h === teamId;
        const difficulty = home
          ? fixture.team_h_difficulty
          : fixture.team_a_difficulty;
        return { opponent, home, difficulty };
      });

    // Calculate the total difficulty score
    const totalDifficulty = nextFixtures.reduce(
      (acc, fixture) => acc + fixture.difficulty,
      0
    );
    const reversedTotalDifficulty = numberOfFixtures * 5 - totalDifficulty;

    // Return the requested number of fixtures and the total difficulty
    return { fixtures: nextFixtures, totalDifficulty, reversedTotalDifficulty };
  }

  const handleGameweekChange = (event) => {
    setNumberOfGameweeks(event.target.value);
  };

  const handleTableReorder = () => {
    setSortOrder((prevSortOrder) => (prevSortOrder === "asc" ? "desc" : "asc"));
  };

  const modifiedTeams = teams.map((team) => {
    const { id } = team;
    const { reversedTotalDifficulty } = getFixturesForTeam(
      id,
      numberOfGameweeks
    );
    return { ...team, FDR: reversedTotalDifficulty };
  });

  const sortedTeams = [...modifiedTeams];
  sortedTeams.sort((teamA, teamB) => {
    const fdrA = teamA.FDR;
    const fdrB = teamB.FDR;
    if (sortOrder === "asc") {
      return fdrA - fdrB;
    } else {
      return fdrB - fdrA;
    }
  });

  return (
    <div>
      <div className="gameweek-dropdown">
        <Dropdown handleGameweekChange={handleGameweekChange} />
      </div>

      <button onClick={handleTableReorder}>
        Reorder Table by FDR {sortOrder === "asc" ? "↑" : "↓"}
      </button>

      <div className="table">
        {sortedTeams.slice(1).map((team, index) => (
          <Row
            teams={modifiedTeams}
            fixturesData={fixturesData}
            teamIndex={team.id}
            numberOfFixtures={numberOfGameweeks}
            key={index}
          />
        ))}
      </div>
    </div>
  );
}
