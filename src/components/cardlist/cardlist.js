import React, { useState } from "react";
import Row from "../card/card"; // Path to your Row component
import Dropdown from "../dropdown/dropdown"; // Path to your Dropdown component
import "./cardlist.css";

export default function CardList({ teams, fixturesData }) {
  const [numberOfGameweeks, setNumberOfGameweeks] = useState(5);
  const [sortOrder, setSortOrder] = useState("desc");

  const calculateReversedTotalDifficulty = (teamId, numberOfFixtures) => {
    if (!fixturesData) return 0;

    const teamFixtures = fixturesData.filter(
      (fixture) => fixture.team_h === teamId || fixture.team_a === teamId
    );

    const gameweekFixtures = new Array(numberOfFixtures)
      .fill(null)
      .map(() => []);

    for (let i = 0; i < numberOfFixtures; i++) {
      const gameweek = teamFixtures.filter(
        (fixture) => fixture.event === i + 1
      );

      gameweekFixtures[i] = gameweek.map((fixture) => {
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

      // If there are no fixtures for the gameweek, add a blank fixture
      if (gameweekFixtures[i].length === 0) {
        gameweekFixtures[i].push({
          opponent: "BLANK",
          opponentNumber: 0,
          difficulty: 6,
          eventNumber: i + 1,
        });
      }
    }

    const totalDifficulty = gameweekFixtures.reduce(
      (acc, fixtures) =>
        acc + fixtures.reduce((acc, fixture) => acc + fixture.difficulty, 0),
      0
    );
    const reversedTotalDifficulty = numberOfFixtures * 6 - totalDifficulty;

    return reversedTotalDifficulty;
  };

  const calculateDifficulty = (reversedTotalDifficulty) => {
    // Calculate difficulty logic (if needed)
    return reversedTotalDifficulty;
  };

  const handleGameweekChange = (event) => {
    setNumberOfGameweeks(event.target.value);
  };

  const handleTableReorder = () => {
    setSortOrder((prevSortOrder) => (prevSortOrder === "asc" ? "desc" : "asc"));
  };

    // Remove the first team (index 0) before sorting and rendering
    const teamsToRender = teams.slice(1);


  const sortedTeams = [...teamsToRender];
  sortedTeams.sort((teamA, teamB) => {
    const fdrA = calculateReversedTotalDifficulty(teamA.id, numberOfGameweeks);
    const fdrB = calculateReversedTotalDifficulty(teamB.id, numberOfGameweeks);

    console.log(`Team A FDR: ${fdrA}, Team B FDR: ${fdrB}`);

    // Toggle sorting based on sortOrder
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
        {sortedTeams.map((team, index) => (
          <Row
            teams={teams}
            fixturesData={fixturesData}
            teamIndex={team.id}
            numberOfFixtures={numberOfGameweeks}
            calculateDifficulty={calculateDifficulty}
            reversedTotalDifficulty={calculateReversedTotalDifficulty(team.id, numberOfGameweeks)}
            key={index}
          />
        ))}
      </div>
    </div>
  );
}
