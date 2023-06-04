import React from "react";
import Row from "../card/card";

export default function CardList({ teams, gameweeks }) {
  return (
    <div className="table">
      {teams.map((teams, index) => (
        <Row teams={teams} gameweeks={gameweeks} key={index} />
      ))}
    </div>
  );
}
