import React from "react";
import Row from "../card/card";

export default function CardList({ teams, fixturesData, numberOfGameweeks, sortOrder }) {
  // 1. Create a copy of the teams array to avoid mutating the original data
  const sortedTeams = [...teams];

  // 2. Sort the teams array based on the "FDR" values and the sortOrder
  sortedTeams.sort((teamA, teamB) => {
    const fdrA = teamA.FDR;
    const fdrB = teamB.FDR;
    if (sortOrder === "asc") {
      return fdrA - fdrB;
    } else {
      return fdrB - fdrA;
    }
  });

  return (
    <div className="table">
      {sortedTeams.slice(1).map((team, index) => (
        <Row
          teams={teams}
          fixturesData={fixturesData}
          teamIndex={team.id}
          numberOfFixtures={numberOfGameweeks}
          key={index}
        />
      ))}
    </div>
  );
}
