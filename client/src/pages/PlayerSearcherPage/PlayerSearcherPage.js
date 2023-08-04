import React from 'react';
import PlayerSearcher from '../../components/playerSearcher/playerSearcher';
import "./PlayerSearcherPage.css";

const PlayerSearcherPage= ({ data, mainData }) => {
  return (
    
    <PlayerSearcher data={data} mainData={mainData} />
  );
};

export default PlayerSearcherPage;
