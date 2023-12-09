import React, { useState, useEffect } from "react";
import "./card.css";

export default function Row({
	teams,
	fixturesData,
	teamIndex,
	numberOfFixtures,
	activeGameweek,
}) {
	const [teamFixturesData, setTeamFixturesData] = useState(null);
	const [totalDifficulty, setTotalDifficulty] = useState(0);
	const [customTotalDifficulty, setCustomTotalDifficulty] = useState(0);

	useEffect(() => {
		function getFixturesForTeam(teamId) {
		if (!fixturesData) return null;

		const teamFixtures = fixturesData.filter(
			(fixture) => fixture.team_h === teamId || fixture.team_a === teamId
		);

		const gameweekFixtures = new Array(numberOfFixtures)
			.fill(null)
			.map(() => []);

		let extraFixturesCount = 0;
		let totalDifficulty = 0;
		let customTotalDifficulty = 0;

		for (let i = 0; i < numberOfFixtures; i++) {
			const gameweek = teamFixtures.filter(
			(fixture) => fixture.event === activeGameweek + i
			);

			// Check if the team has more than one fixture in the same gameweek
			if (gameweek.length > 1) {
			// Only add extra fixtures for the specified team
			extraFixturesCount += gameweek.length - 1;
			}

			const gameweekDifficulty = gameweek.reduce((acc, fixture) => {
			const home = fixture.team_h === teamId;
			const difficulty = home
				? fixture.team_h_difficulty
				: fixture.team_a_difficulty;

			return acc + difficulty;
			}, 0);

			setTotalDifficulty((prevTotal) => prevTotal + gameweekDifficulty);

			if (gameweek.length > 0) {
			gameweekFixtures[i] = gameweek.map((fixture) => {
				const opponentNumber =
				fixture.team_h === teamId ? fixture.team_a : fixture.team_h;
				const opponent = teams
				? fixture.team_h === teamId
					? teams[fixture.team_a].name
					: teams[fixture.team_h].name
				: "";

				const home = fixture.team_h === teamId;
				const difficulty = home
				? fixture.team_h_difficulty
				: fixture.team_a_difficulty;

				return {
				opponent,
				opponentNumber,
				home,
				difficulty,
				eventNumber: fixture.event,
				};
			});

			// Calculate customTotalDifficulty based on the opponent's difficulty
			customTotalDifficulty += gameweek.reduce((acc, fixture) => {
				const home = fixture.team_h === teamId;
				const opponentNumber =
				fixture.team_h === teamId ? fixture.team_a : fixture.team_h;
				const difficulty = home
				? teams[opponentNumber]?.h_diff || 0
				: teams[opponentNumber]?.a_diff || 0;

				return acc + difficulty;
			}, 0);
			} else {
			gameweekFixtures[i].push({
				opponent: "BLANK",
				opponentNumber: 0,
				blank_difficulty: 6,
				eventNumber: activeGameweek + i,
			});

			totalDifficulty += 6;  // Add 6 for each blank gameweek
			customTotalDifficulty += 11; // Add 11 for each blank gameweek
			}

			totalDifficulty += gameweekDifficulty;
		}

		// Calculate reversedTotalDifficulty correctly
		const reversedTotalDifficulty =
			numberOfFixtures * 6 + extraFixturesCount * 6 - totalDifficulty;

		// Calculate reversedCustomDifficulty correctly
		const reversedCustomDifficulty =
			numberOfFixtures * 11 + extraFixturesCount * 11 - customTotalDifficulty;

		return {
			fixtures: gameweekFixtures,
			totalDifficulty,
			reversedTotalDifficulty,
			customTotalDifficulty,
			reversedCustomDifficulty
		};
		}

		const newFixturesData = getFixturesForTeam(teamIndex);
		setTeamFixturesData(newFixturesData);
	}, [teamIndex, numberOfFixtures, fixturesData, teams, activeGameweek]);

	const team = teams[teamIndex];
	const teamName = team ? team.name : "";

	return (
		<div>
		<table className="fixtures-table with-border">
			<thead className="table-header">
			<tr>
				<th>Team</th>
				<th className="FDR-column">FDR</th>
				{teamFixturesData &&
				teamFixturesData.fixtures.map((_, index) => (
					<th key={index}>{`GW ${activeGameweek + index}`}</th>
				))}
			</tr>
			</thead>
			<tbody>
			<tr>
				<td className="team-info">
				<span className="team-name">{teamName}</span>
				<br />
				<img className="team-badge" src={team.badge} alt={teamName} />
				</td>

				<td className="FDR-column">
				<span className="score-display">Score: </span>
				{teamFixturesData && (
					<h2 className="FDR-number">
					{teamFixturesData.reversedTotalDifficulty}
					</h2>
				)}
				<span className="score-display">New: </span>
				{teamFixturesData && (
					<h2 className="FDR-number">
					{teamFixturesData.reversedCustomDifficulty}
					</h2>
				)}
				</td>

				{teamFixturesData &&
				teamFixturesData.fixtures.map((gameweek, gameweekIndex) => (
					<td className="fixture-column" key={gameweekIndex}>
					{gameweek.length > 0 ? (
						gameweek.map((fixture, index) => (
						<div
							className={`fixture-info difficulty-${fixture.difficulty}`}
							key={index}
						>
							<b className="opponent-name">{fixture.opponent}</b>{" "}
							{fixture.opponentNumber !== 0
							? fixture.home
								? "(H)"
								: "(A)"
							: null}
							<br />
							{fixture.opponentNumber !== null &&
							teams[fixture.opponentNumber]?.badge !== null ? (
							<img
								className="fixture-badge"
								src={teams[fixture.opponentNumber]?.badge}
								alt={fixture.opponent}
							/>
							) : (
							<span></span>
							)}
							<br />
							<strong>
							{fixture.home ? (
								<>{11 - teams[fixture.opponentNumber].h_diff}</>
							) : (
								<>{11 - teams[fixture.opponentNumber].a_diff}</>
							)}
							</strong>
						</div>
						))
					) : (
						<div
						className={`fixture-info difficulty-${5}`}
						key={gameweekIndex}
						>
						<b>BLANK</b>
						</div>
					)}
					</td>
				))}
			</tr>
			</tbody>
		</table>
		</div>
	);
}
