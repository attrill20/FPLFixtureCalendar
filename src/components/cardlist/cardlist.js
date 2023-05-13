import React from 'react';
import NewCard from '../card/card';

export default function CardList({teams, gw1, gw2, gw3}) {
    return (
        <div>
        {teams.map((team, index) => (
            <NewCard teams={team} gw1={gw1[index]} gw2={gw2[index]} gw3={gw3[index]}/>
            ))}
        </div>
    )
}
