import React, { useState, useEffect } from "react";
import "./card.css";

export default function Row({
    teams,
    fixturesData,
    teamIndex,
    numberOfFixtures,
	activeGameweek
}) {
    const [teamFixturesData, setTeamFixturesData] = useState(null);

    useEffect(() => {
		function getFixturesForTeam(teamId) {
			if (!fixturesData) return null;
		
			const teamFixtures = fixturesData.filter(
				(fixture) => fixture.team_h === teamId || fixture.team_a === teamId
			);
		
			const gameweekFixtures = new Array(numberOfFixtures)
				.fill(null)
				.map(() => []);
		
			let totalDifficulty = 0; // Initialize totalDifficulty for the team
			let extraFixturesCount = 0; // Initialize extra fixtures count for the specified team
		
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
				} else {
					gameweekFixtures[i].push({
						opponent: "BLANK",
						opponentNumber: 0,
						difficulty: 6,
						eventNumber: activeGameweek + i,
					});
				}
		
				totalDifficulty += gameweekDifficulty;
			}
		
			// Calculate reversedTotalDifficulty correctly
			const reversedTotalDifficulty =
				numberOfFixtures * 6 + extraFixturesCount * 6 - totalDifficulty;
		
			return {
				fixtures: gameweekFixtures,
				totalDifficulty,
				reversedTotalDifficulty,
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
							<img
								className="team-badge"
								src={team.badge}
								alt={teamName}
							/>
						</td>

						<td className="FDR-column">
							<span className="score-display">Score: </span>
							{teamFixturesData && (
								<h2 className="FDR-number">{teamFixturesData.reversedTotalDifficulty}</h2>
							)}
						</td>

						{teamFixturesData &&
							teamFixturesData.fixtures.map((gameweek, gameweekIndex) => (
								<td className="fixture-column" key={gameweekIndex}>
									{gameweek.length > 0 ? (
										gameweek.map((fixture, index) => (
											<div
												className={`fixture-info difficulty-${fixture.difficulty}`}
												key={index}>
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
													<span>
														
													</span>
												)}
												<br />
												{/* Gameweek: <strong>{fixture.eventNumber}</strong> */}
											</div>
										))
									) : (
										<div
											className={`fixture-info difficulty-${5}`}
											key={gameweekIndex}>
											<b>BLANK</b>
											{/* Gameweek: <strong>{gameweekIndex + 1}</strong> */}
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
