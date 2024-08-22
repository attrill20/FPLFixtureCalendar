import React, { useState, useEffect } from "react";
import "./App.css";
import PlayerComparisonPage from "./pages/PlayerComparisonPage/PlayerComparisonPage";
import FixtureCalendarPage from "./pages/FixtureCalendarPage/FixtureCalendarPage";
import HomePage from "./pages/Home/HomePage";
import { teams } from "./components/dummyArrays/dummy";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Navbar from "./components/navbar/navbar";

export default function App() {
	const [data, setData] = useState(null);
	const [mainData, setMainData] = useState(null);
	const [fixturesData, setFixturesData] = useState(null);
	const [activeGameweek, setActiveGameweek] = useState(null);

	// Fetch the FPL API data from new server
	useEffect(() => {
		async function fetchFPL() {
		  try {
			const response = await fetch("https://fpl-server-nine.vercel.app/api");
			if (!response.ok) {
			  throw new Error(`HTTP error! Status: ${response.status}`);
			}
			const data = await response.json();
			setData(data);
	
			// Ensure bootstrapData exists before accessing its properties
			if (data.bootstrapData) {
			  setMainData(data.bootstrapData);
			  setFixturesData(data.fixturesData);
	
			  // Find the active gameweek and update the state
			  const activeEvent = data.bootstrapData.events.find(
				(event) => !event.finished
			  );
			  if (activeEvent) {
				setActiveGameweek(activeEvent.id);
			  }
			} else {
			  console.error("bootstrapData is undefined in API response.");
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
								data={data}
								mainData={mainData}
							/>
						}
					/>
				</Routes>
			</BrowserRouter>
		</div>
	);
}
