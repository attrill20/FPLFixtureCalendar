import React from "react";
import Row from "../card/card";

export default function CardList({ teams, gameweeks, fixturesData, numberOfGameweeks }) {

  return (
    <div className="table">
      {teams.map((team, index) => (
        <Row
          teams={teams}
          fixturesData={fixturesData}
          teamIndex={index}
          numberOfFixtures={numberOfGameweeks}
          key={index}
        />
      ))}
    </div>
  );
}

