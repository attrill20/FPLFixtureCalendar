import React from "react";
import "./card.css";

export default function Row({ teams, teamFixtures, rowIndex }) {
  return (
    <div className="card">
      <table className="fixtures-table with-border">
        <thead className="table-header">
          {" "}
          {/* Add the thead element for the table header */}
          <tr>
            <th></th> {/* Leave the first cell in the header row empty */}
            {teamFixtures.map((_, index) => (
              <th>{`GW ${index + 1}`}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="team-info">
              <span className="team-name">{teams.name}</span>
              <br />
              <img className="team-badge" src={teams.badge} alt={teams.name} />
            </td>

            {teamFixtures.map((fixture) => (
              <td className="fixture-info">
                GW1: <b>{fixture[rowIndex].initial}</b>{" "}
                {fixture[rowIndex].location}
                <br />
                <img
                  className="fixture-badge"
                  src={fixture[rowIndex].badge}
                  alt={fixture[rowIndex].name}
                />
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

  
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
