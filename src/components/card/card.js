import React, { useState, useEffect } from "react";
import "./card.css";

export default function Row({
	teams,
	fixturesData,
	teamIndex,
	numberOfFixtures,
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

			teamFixtures.forEach((fixture) => {
				if (fixture.event !== null && fixture.event <= numberOfFixtures) {
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
					const eventNumber = fixture.event - 1; // Adjust to 0-based index for array

					if (!gameweekFixtures[eventNumber]) {
						gameweekFixtures[eventNumber] = [];
					}

					gameweekFixtures[eventNumber].push({
						opponent,
						opponentNumber,
						home,
						difficulty,
						eventNumber: fixture.event,
					});
				}
			});

			// Fill in missing gameweekFixtures with blank data
			for (let i = 0; i < numberOfFixtures; i++) {
				if (!gameweekFixtures[i]) {
					gameweekFixtures[i] = [
						{
							opponent: "BLANK",
							opponentNumber: 0,
							difficulty: 5,
							eventNumber: i + 1,
						},
					];
				}
			}

			const totalDifficulty = gameweekFixtures.reduce(
				(acc, fixtures) =>
					acc + fixtures.reduce((acc, fixture) => acc + fixture.difficulty, 0),
				0
			);
			const reversedTotalDifficulty = numberOfFixtures * 5 - totalDifficulty;

			return {
				fixtures: gameweekFixtures,
				totalDifficulty,
				reversedTotalDifficulty,
			};
		}

		const newFixturesData = getFixturesForTeam(teamIndex);
		setTeamFixturesData(newFixturesData);

		getFixturesForTeam(teamIndex);
	}, [teamIndex, numberOfFixtures, fixturesData, teams]);

	const team = teams[teamIndex];
	const teamName = team ? team.name : "";

	// Log Luton's fixtures
	if (team.id === 12) {
		console.log("Luton's Fixtures:", teamFixturesData);
	}

	return (
		<div>
			<table className="fixtures-table with-border">
				<thead className="table-header">
					<tr>
						<th>Team</th>
						<th className="FDR-column">FDR</th>
						{teamFixturesData &&
							teamFixturesData.fixtures.map((_, index) => (
								<th key={index}>{`GW ${index + 1}`}</th>
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
							<span>Score: </span>
							{teamFixturesData && (
								<h2>{teamFixturesData.reversedTotalDifficulty}</h2>
							)}
						</td>

						{teamFixturesData &&
							teamFixturesData.fixtures.map((gameweek, gameweekIndex) => (
								<td key={gameweekIndex}>
									{gameweek.length > 0 ? (
										gameweek.map((fixture, index) => (
											<div
												className={`fixture-info difficulty-${fixture.difficulty}`}
												key={index}>
												<b>{fixture.opponent}</b>{" "}
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
														<br />
														<br />
														<br />
														<br />
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
											<br />
											<br />
											<br />
											<br />
											<br />
											{/* Difficulty: <strong>{5}</strong> */}
											<br />
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
