import React from 'react';
import NewCard from '../card/card';

export default function CardList({ teams, gw1, gw2, gw3 }) {
  return (
    <div className='table'>
      {teams.map((teams, index) => (
        <NewCard teams={teams} gw1={gw1[index]} gw2={gw2[index]} gw3={gw3[index]} key={index} />
      ))}
    </div>
  );
}
