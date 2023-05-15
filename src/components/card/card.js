import React from 'react';
import './card.css';

export default function NewCard({ teams, gw1, gw2, gw3 }) {
  const { name, badge } = teams;

  return (
    <div className="card">
      <table className="fixtures-table">
        <tbody>
          <tr>
            <td className="team-info">
              <span className="team-name">{name}</span>
              <br></br>
              <img className="team-badge" src={badge} alt={name} />
            </td>
            <td className="fixture-info">
              <b>GW1:</b> {gw1}
            </td>
            <td className="fixture-info">
              <b>GW2:</b> {gw2}
            </td>
            <td className="fixture-info">
              <b>GW3:</b> {gw3}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
