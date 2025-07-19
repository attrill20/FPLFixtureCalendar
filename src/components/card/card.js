import React, { useState, useEffect } from "react";
import "./card.css";

export default function Row({
  teams,
  fixturesData,
  teamIndex,
  numberOfFixtures,
  activeGameweek,
  showOriginalScore,
  showCustomScore,
  isTableRow = false,
}) {
  const [teamFixturesData, setTeamFixturesData] = useState(null);
  const [totalDifficulty, setTotalDifficulty] = useState(0);
  const [customTotalDifficulty, setCustomTotalDifficulty] = useState(0);

  useEffect(() => {
    function getFixturesForTeam(teamId) {
      if (!fixturesData) return null;

      const teamFixtures = fixturesData.filter(
        (fixture) => fixture.team_h === teamId || fixture.team_a === teamId
      );

      const gameweekFixtures = new Array(numberOfFixtures)
        .fill(null)
        .map(() => []);

      let extraFixturesCount = 0;
      let totalDifficulty = 0;
      let customTotalDifficulty = 0;

      for (let i = 0; i < numberOfFixtures; i++) {
        const gameweek = teamFixtures.filter(
          (fixture) => fixture.event === activeGameweek + i
        );

        if (gameweek.length > 1) {
          extraFixturesCount += gameweek.length - 1;
        }

        const gameweekDifficulty = gameweek.reduce((acc, fixture) => {
          const home = fixture.team_h === teamId;
          const difficulty = home
            ? fixture.team_h_difficulty
            : fixture.team_a_difficulty;

          return acc + difficulty;
        }, 0);

        setTotalDifficulty((prevTotal) => prevTotal + gameweekDifficulty);

        if (gameweek.length > 0) {
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

          customTotalDifficulty += gameweek.reduce((acc, fixture) => {
            const home = fixture.team_h === teamId;
            const opponentNumber =
              fixture.team_h === teamId ? fixture.team_a : fixture.team_h;
            const difficulty = home
              ? teams[opponentNumber]?.h_diff || 0
              : teams[opponentNumber]?.a_diff || 0;

            return acc + difficulty;
          }, 0);
        } else {
          gameweekFixtures[i].push({
            opponentNumber: 0,
            blank_difficulty: 6,
            eventNumber: activeGameweek + i,
          });

          totalDifficulty += 6;  // Add 6 for each blank gameweek
          customTotalDifficulty += 11; // Add 11 for each blank gameweek
        }

        totalDifficulty += gameweekDifficulty;
      }

      const reversedTotalDifficulty =
        numberOfFixtures * 6 + extraFixturesCount * 6 - totalDifficulty;

      return {
        fixtures: gameweekFixtures,
        totalDifficulty,
        reversedTotalDifficulty,
        customTotalDifficulty,
        reversedCustomDifficulty: numberOfFixtures * 11 + extraFixturesCount * 11 - customTotalDifficulty,
      };
    }

    const newFixturesData = getFixturesForTeam(teamIndex);
    setTeamFixturesData(newFixturesData);
  }, [teamIndex, numberOfFixtures, fixturesData, teams, activeGameweek]);

  const team = teams[teamIndex];
  const teamName = team ? team.name : "";

  if (isTableRow) {
    return (
      <tr>
        <td className="team-info">
          <span className="team-name">{teamName}</span>
          <br className="page-break"/>
          <img className="team-badge" src={team?.badge} alt={teamName} />
        </td>

        <td className="fdr-column">
          {showOriginalScore && teamFixturesData && (
            <h2 className="fdr-number">
              {teamFixturesData.reversedTotalDifficulty}
            </h2>
          )}
          {showCustomScore && teamFixturesData && (
            <h2 className="fdr-number">
              {teamFixturesData.reversedCustomDifficulty}
            </h2>
          )}
        </td>

        {teamFixturesData &&
          teamFixturesData.fixtures.map((gameweek, gameweekIndex) => {
            const gameweekNumber = activeGameweek + gameweekIndex;
            if (gameweekNumber > 38) return null;

            return (
              <td className="fixture-column" key={gameweekIndex}>
                {gameweek.length > 0 ? (
                  gameweek.map((fixture, index) => (
                    <div
                      className={`fixture-info ${
                        showOriginalScore
                          ? `difficulty-${fixture.difficulty}`
                          : `custom-difficulty-${fixture.home
                              ? teams[fixture.opponentNumber]?.h_diff
                              : teams[fixture.opponentNumber]?.a_diff
                            }`
                      }`}
                      key={index}
                    >
                      <b className="opponent-name">{fixture.opponent}</b>{" "}
                      {fixture.opponentNumber !== 0 ? (
                        fixture.home ? "(H)" : "(A)"
                      ) : (
                        <strong>BLANK</strong>
                      )}
                      <br />
                      {fixture.opponentNumber !== null &&
                        teams[fixture.opponentNumber]?.badge && (
                          <img
                            className="fixture-badge"
                            src={teams[fixture.opponentNumber]?.badge}
                            alt={fixture.opponent}
                          />
                        )}
                      <br />
                    </div>
                  ))
                ) : (
                  <div
                    className={`fixture-info ${
                      showOriginalScore ? `difficulty-${5}` : `custom-difficulty-${10}`
                    }`}
                    key={gameweekIndex}
                  >
                    <b>BLANK</b>
                  </div>
                )}
              </td>
            );
          })}
      </tr>
    );
  }

  return (
    <div>
      <table className="fixtures-table with-border">
        <thead className="table-header">
          <tr>
            <th className="team-column">Team</th>
            <th className="fdr-column">FDR</th>
            {teamFixturesData &&
              teamFixturesData.fixtures.map((_, index) => {
                const gameweekNumber = activeGameweek + index;
                return gameweekNumber <= 38 ? (
                  <th key={index}>{`GW ${gameweekNumber}`}</th>
                ) : null;
              })}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="team-info">
              <span className="team-name">{teamName}</span>
              <br className="page-break"/>
              <img className="team-badge" src={team?.badge} alt={teamName} />
            </td>

            <td className="fdr-column">
              {showOriginalScore && teamFixturesData && (
                <h2 className="fdr-number">
                  {teamFixturesData.reversedTotalDifficulty}
                </h2>
              )}
              {showCustomScore && teamFixturesData && (
                <h2 className="fdr-number">
                  {teamFixturesData.reversedCustomDifficulty}
                </h2>
              )}
            </td>

            {teamFixturesData &&
              teamFixturesData.fixtures.map((gameweek, gameweekIndex) => {
                const gameweekNumber = activeGameweek + gameweekIndex;
                if (gameweekNumber > 38) return null;

                return (
                  <td className="fixture-column" key={gameweekIndex}>
                    {gameweek.length > 0 ? (
                      gameweek.map((fixture, index) => (
                        <div
                          className={`fixture-info ${
                            showOriginalScore
                              ? `difficulty-${fixture.difficulty}`
                              : `custom-difficulty-${fixture.home
                                  ? teams[fixture.opponentNumber]?.h_diff
                                  : teams[fixture.opponentNumber]?.a_diff
                                }`
                          }`}
                          key={index}
                        >
                          <b className="opponent-name">{fixture.opponent}</b>{" "}
                          {fixture.opponentNumber !== 0 ? (
                            fixture.home ? "(H)" : "(A)"
                          ) : (
                            <strong>BLANK</strong>
                          )}
                          <br />
                          {fixture.opponentNumber !== null &&
                            teams[fixture.opponentNumber]?.badge && (
                              <img
                                className="fixture-badge"
                                src={teams[fixture.opponentNumber]?.badge}
                                alt={fixture.opponent}
                              />
                            )}
                          <br />
                        </div>
                      ))
                    ) : (
                      <div
                        className={`fixture-info ${
                          showOriginalScore ? `difficulty-${5}` : `custom-difficulty-${10}`
                        }`}
                        key={gameweekIndex}
                      >
                        <b>BLANK</b>
                      </div>
                    )}
                  </td>
                );
              })}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
