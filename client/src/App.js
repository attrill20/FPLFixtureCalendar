import React, { useState, useEffect } from "react";
import "./App.css";
import CardList from "./components/cardlist/cardlist";
import PlayerSearcher from "./components/playerSearcher/playerSearcher";
import { teams } from "./components/dummyArrays/dummy";
// import { Routes, Route } from "react-router-dom";

export default function App() {

  const [data, setData] = useState(null);
  const [mainData, setMainData] = useState(null);
  const [fixturesData, setFixturesData] = useState(null);
  

  // Fetch the FPL API data
  useEffect(() => {
    async function fetchFPL() {
    const response = await fetch("http://localhost:3005")
    const data = await response.json();
    setData(data);
    setMainData(data.bootstrapData)
    setFixturesData(data.fixturesData)
    console.log(data);
  }
  fetchFPL()
}, []);






  return (
    <div className="app">
      <header className="app-header">
        <h1>Welcome to the FPL Fixture Difficulty Calendar</h1>
      </header>
      <div className="sub-heading">
        <h2>
          Welcome to the Fixture Difficulty Planner for the 2023/24 Fixtures.
          You can use this site to filter teams by upcoming GWs to help plan
          transfers for players with easier fixtures and maximise your returns.
          Best of luck!
        </h2>
      </div>

      <div className="cards">
        <CardList
          teams={teams}
          fixturesData={fixturesData}
        />
      </div>

      <div>
      <PlayerSearcher 
        data={data}
        mainData={mainData}
      />
    </div>

    </div>
  );
}