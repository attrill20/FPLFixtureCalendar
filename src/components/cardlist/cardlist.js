import React from 'react';
import NewCard from '../card/card';

export default function CardList({ teams, gameweeks }) {
  return (
    <div className='table'>
      {teams.map((teams, index) => (
        <NewCard teams={teams} gameweeks={gameweeks} key={index} />
      ))}
    </div>
  );
}
