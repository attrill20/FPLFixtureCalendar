import React from "react";
import "./card.css";

export default function Row({ teams, fixturesData, teamIndex, numberOfFixtures }) {
  function getFixturesForTeam(teamId) {
    if (!fixturesData) return null; // Check to handle null fixturesData

    const teamFixtures = fixturesData.filter(
      (fixture) => fixture.team_h === teamId || fixture.team_a === teamId
    );

    // Calculate the total difficulty and return the requested number of fixtures
    const nextFixtures = teamFixtures.slice(0, numberOfFixtures).map((fixture) => {
      const opponentNumber = fixture.team_h === teamId ? fixture.team_a: fixture.team_h;
      const opponent =
        fixture.team_h === teamId ? teams[fixture.team_a].name : teams[fixture.team_h].name;
      const home = fixture.team_h === teamId;
      const difficulty = home ? fixture.team_h_difficulty : fixture.team_a_difficulty;
      return { opponent, opponentNumber, home, difficulty };
    });

    // Calculate the total difficulty score
    const totalDifficulty = nextFixtures.reduce((acc, fixture) => acc + fixture.difficulty, 0);
    const reversedTotalDifficulty = numberOfFixtures * 5 - totalDifficulty;

    // Return the requested number of fixtures and the total difficulty
    return { fixtures: nextFixtures, totalDifficulty, reversedTotalDifficulty };
  }

  const team = teams[teamIndex];
  const teamName = team ? team.name : "";

  const teamFixturesData = getFixturesForTeam(teamIndex);

  return (
    <div className="card">
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
            <span>FDR: </span> 
            {teamFixturesData && (
              <strong>{teamFixturesData.reversedTotalDifficulty}</strong>
            )}
          </td>

            {teamFixturesData &&
              teamFixturesData.fixtures.map((fixture, index) => (
                <td className="fixture-info" key={index}>
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
                </td>
              ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}