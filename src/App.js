import React, { useState, useEffect } from "react";
import "./App.css";
import PlayerComparisonPage from "./pages/PlayerComparisonPage/PlayerComparisonPage";
import FixtureCalendarPage from "./pages/FixtureCalendarPage/FixtureCalendarPage";
import HomePage from "./pages/HomePage/HomePage";
import FAQPage from "./pages/FAQPage/FAQPage";
import Top10Page from "./pages/Top10Page/Top10Page";
import { teams } from "./components/dummyArrays/dummy";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Navbar from "./components/navbar/navbar";

export default function App() {
  const [mainData, setMainData] = useState(null);
  const [fixturesData, setFixturesData] = useState(null);
  const [activeGameweek, setActiveGameweek] = useState(null);

  // Fetch the FPL API data from new server
  useEffect(() => {
    async function fetchFPL() {
      try {
        const bootstrapResponse = await fetch(
          "https://fpl-server-nine.vercel.app/api?endpoint=bootstrap-static"
        );
        if (!bootstrapResponse.ok) {
          throw new Error(`HTTP error! Status: ${bootstrapResponse.status}`);
        }
        const fetchedData = await bootstrapResponse.json(); // Renamed variable
        setMainData(fetchedData); // Set the fetched data to mainData

        // Fetch fixtures data
        const fixturesResponse = await fetch(
          "https://fpl-server-nine.vercel.app/api?endpoint=fixtures"
        );
        if (!fixturesResponse.ok) {
          throw new Error(`HTTP error! Status: ${fixturesResponse.status}`);
        }
        const fixturesData = await fixturesResponse.json();
        setFixturesData(fixturesData);

        // Find the active gameweek and update the state
        const activeEvent = fetchedData.events.find(
          (event) => !event.finished
        );
        if (activeEvent) {
          setActiveGameweek(activeEvent.id);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    }

    fetchFPL();
  }, []);

  return (
    <div className="app">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<Navigate to="/" />} />
          <Route
            path="/calendar"
            element={
              <FixtureCalendarPage
                teams={teams}
                fixturesData={fixturesData}
                activeGameweek={activeGameweek}
              />
            }
          />
          <Route
            path="/comparison"
            element={
              <PlayerComparisonPage
                mainData={mainData}
              />
            }
          />
          <Route
            path="/top10"
            element={
              <Top10Page
                mainData={mainData}
                teams={teams}
                fixturesData={fixturesData}
              />
            }
          />
          <Route path="/faq" element={<FAQPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
