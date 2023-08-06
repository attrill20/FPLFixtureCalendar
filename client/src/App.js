import React, { useState, useEffect } from "react";
import "./App.css";
import PlayerSearcherPage from "./pages/PlayerSearcherPage/PlayerSearcherPage";
import FixtureCalendarPage from "./pages/FixtureCalendarPage/FixtureCalendarPage";
import { teams } from "./components/dummyArrays/dummy";
import { BrowserRouter, Route, Routes } from "react-router-dom";

export default function App() {

  const [data, setData] = useState(null);
  const [mainData, setMainData] = useState(null);
  const [fixturesData, setFixturesData] = useState(null);
  

  // Fetch the FPL API data from new server
  useEffect(() => {
    async function fetchFPL() {
    const response = await fetch("https://fpl-server-nine.vercel.app/api")
    const data = await response.json();
    setData(data);
    setMainData(data.bootstrapData)
    setFixturesData(data.fixturesData)
  }
  fetchFPL()
}, []);


  return (
    <div className="app">
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<FixtureCalendarPage teams={teams} fixturesData={fixturesData} />} />
      <Route path="/search" element={<PlayerSearcherPage data={data} mainData={mainData} />} />
    </Routes>
    </BrowserRouter>
    </div>
  );
}