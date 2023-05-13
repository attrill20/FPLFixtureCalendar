import React from 'react';
import './card.css';

export default function NewCard({ teams, gw1, gw2, gw3 }) {
  return (
    <div className="cards">
      <table className="fixtures-table">
        <tbody>
          <tr>
            <td className='teams'>{teams}</td>
            <td><b>GW1: </b>{gw1}</td>
            <td><b>GW2: </b>{gw2}</td>
            <td><b>GW3: </b>{gw3}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
