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
      const opponent =
        fixture.team_h === teamId ? teams[fixture.team_a].name : teams[fixture.team_h].name;
      const home = fixture.team_h === teamId;
      const difficulty = home ? fixture.team_h_difficulty : fixture.team_a_difficulty;
      return { opponent, home, difficulty };
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
            <th></th>
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

            {teamFixturesData &&
              teamFixturesData.fixtures.map((fixture, index) => (
                <td className="fixture-info" key={index}>
                  Opponent: <b>{fixture.opponent}</b>{" "}
                  {fixture.home ? "(H)" : "(A)"}
                  <br />
                  {/* Badge:  <img
                      className="fixture-badge"
                      src={teams.find((team) => team.id === fixture.opponentTeamId).badge}
                      alt={fixture.opponent}
                    /> */}
                  Difficulty: <strong>{fixture.difficulty}</strong>
                </td>
              ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}



// original working code below:
// import React from "react";
// import "./card.css";

// export default function Row({ teams, teamFixtures, rowIndex }) {
//   return (
//     <div className="card">
//       <table className="fixtures-table with-border">
//         <thead className="table-header">
//           {" "}
//           {/* Add the thead element for the table header */}
//           <tr>
//             <th></th> {/* Leave the first cell in the header row empty */}
//             {teamFixtures.map((_, index) => (
//               <th>{`GW ${index + 1}`}</th>
//             ))}
//           </tr>
//         </thead>
//         <tbody>
//           <tr>
//             <td className="team-info">
//               <span className="team-name">{teams.name}</span>
//               <br />
//               <img className="team-badge" src={teams.badge} alt={teams.name} />
//             </td>

//             {teamFixtures.map((fixture) => (
//               <td className="fixture-info">
//                 Team: <b>{fixture[rowIndex].initial}</b>{" "}
//                 {fixture[rowIndex].location}
//                 <br />
//                 Badge: <img
//                   className="fixture-badge"
//                   src={fixture[rowIndex].badge}
//                   alt={fixture[rowIndex].name}
//                 />
//               </td>
//             ))}
//           </tr>
//         </tbody>
//       </table>
//     </div>
//   );
// }

  
  /* {<td className="fixture-info">
              GW2: <b>{gw2.initial}</b> {gw2.location}
              <br />
              <img className="fixture-badge" src={gw2.badge} alt={gw2.name} />
            </td>
            <td className="fixture-info">
              GW3: <b>{gw3.initial}</b> {gw3.location}
              <br />
              <img className="fixture-badge" src={gw3.badge} alt={gw3.name} />
            </td>} */
