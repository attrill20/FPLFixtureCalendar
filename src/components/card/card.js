import React, { useState, useEffect } from "react";
import "./card.css";

export default function Row({ teams, fixturesData, teamIndex, numberOfFixtures }) {
  const [teamFixturesData, setTeamFixturesData] = useState(null);

  useEffect(() => {
    function getFixturesForTeam(teamId) {
      if (!fixturesData) return null;

      const teamFixtures = fixturesData.filter(
        (fixture) => fixture.team_h === teamId || fixture.team_a === teamId
      );

      const gameweekFixtures = new Array(numberOfFixtures).fill(null).map(() => []);

      teamFixtures.forEach((fixture) => {
        if (fixture.event <= numberOfFixtures) {
          const opponentNumber = fixture.team_h === teamId ? fixture.team_a : fixture.team_h;
          const opponent =
            fixture.team_h === teamId ? teams[fixture.team_a].name : teams[fixture.team_h].name;
          const home = fixture.team_h === teamId;
          const difficulty = home ? fixture.team_h_difficulty : fixture.team_a_difficulty;
          const eventNumber = fixture.event - 1; // Adjust to 0-based index for array

          if (!gameweekFixtures[eventNumber]) {
            gameweekFixtures[eventNumber] = [];
          }

          gameweekFixtures[eventNumber].push({
            opponent,
            opponentNumber,
            home,
            difficulty,
            eventNumber: fixture.event,
          });
        }
      });

      const totalDifficulty = gameweekFixtures.reduce(
        (acc, fixtures) => acc + fixtures.reduce((acc, fixture) => acc + fixture.difficulty, 0),
        0
      );
      const reversedTotalDifficulty = numberOfFixtures * 5 - totalDifficulty;

      return { fixtures: gameweekFixtures, totalDifficulty, reversedTotalDifficulty };
    }

    const newFixturesData = getFixturesForTeam(teamIndex);
    setTeamFixturesData(newFixturesData);
  }, [teamIndex, numberOfFixtures, fixturesData, teams]);

  const team = teams[teamIndex];
  const teamName = team ? team.name : "";

  return (
    <div>
      <table className="fixtures-table with-border">
        <thead className="table-header">
          <tr>
            <th>Team</th>
            <th className="FDR-column">FDR</th>
            {teamFixturesData &&
              teamFixturesData.fixtures.map((_, index) => (
                <th key={index}>{`GW ${index + 1}`}</th>
              ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="team-info">
              <span className="team-name">{teamName}</span>
              <br />
              <img className="team-badge" src={team.badge} alt={teamName} />
            </td>

            <td className="FDR-column">
              <span>Score: </span>
              {teamFixturesData && (
                <h2>{teamFixturesData.reversedTotalDifficulty}</h2>
              )}
            </td>

            {teamFixturesData &&
              teamFixturesData.fixtures.map((gameweek, gameweekIndex) => (
                <td key={gameweekIndex}>
                  {gameweek.length > 0 ? (
                    gameweek.map((fixture, index) => (
                      <div
                        className={`fixture-info difficulty-${fixture.difficulty}`}
                        key={index}
                      >
                        <b>{fixture.opponent}</b>{" "}
                        {fixture.home ? "(H)" : "(A)"}
                        <br />
                        <img
                          className="fixture-badge"
                          src={teams[fixture.opponentNumber].badge}
                          alt={fixture.opponent}
                        />
                        <br />
                        Difficulty: <strong>{fixture.difficulty}</strong>
                        <br />
                        Gameweek: <strong>{fixture.eventNumber}</strong>
                      </div>
                    ))
                  ) : (
                    <div className="fixture-info">
                      <span>BLANK</span>
                    </div>
                  )}
                </td>
              ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
