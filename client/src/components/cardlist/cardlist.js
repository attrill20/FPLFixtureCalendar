import React from "react";
import Row from "../card/card";

export default function CardList({ teams, fixturesData, numberOfGameweeks }) {

  return (
    <div className="table">
      {teams.slice(1).map((team, index) => (
        <Row
          teams={teams}
          fixturesData={fixturesData}
          teamIndex={index + 1}
          numberOfFixtures={numberOfGameweeks}
          key={index}
        />
      ))}
    </div>
  );
}

