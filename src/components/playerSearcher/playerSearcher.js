import React, { useState } from "react";
import "./playerSearcher.css";

export default function PlayerSearcher({ data, mainData }) {
	const [targetedPlayer, setTargetedPlayer] = useState(null);
	const [targetWebName, setTargetWebName] = useState("");
	const [targetedPlayer2, setTargetedPlayer2] = useState(null); // Separate state for the second instance
	const [targetWebName2, setTargetWebName2] = useState(""); // Separate state for the second instance

	// First instance - Function to target a player by their web name
	const findPlayerByWebName = () => {
		const lowercaseTargetWebName = targetWebName.toLowerCase();
		const targetedPlayer = mainData.elements.find(
			(player) => player.web_name.toLowerCase() === lowercaseTargetWebName
		);
		setTargetedPlayer(targetedPlayer);
	};

	// Second instance - Function to target a player by their web name
	const findPlayerByWebName2 = () => {
		const lowercaseTargetWebName = targetWebName2.toLowerCase();
		const targetedPlayer = mainData.elements.find(
			(player) => player.web_name.toLowerCase() === lowercaseTargetWebName
		);
		setTargetedPlayer2(targetedPlayer);
	};

	// First instance - Handle input change for the web name
	const handleInputChange = (event) => {
		setTargetWebName(event.target.value);
	};

	// Second instance - Handle input change for the web name
	const handleInputChange2 = (event) => {
		setTargetWebName2(event.target.value);
	};

	// First instance - Handle form submit
	const handleSubmit = (event) => {
		event.preventDefault();
		findPlayerByWebName();
	};

	// Second instance - Handle form submit
	const handleSubmit2 = (event) => {
		event.preventDefault();
		findPlayerByWebName2();
	};

	return (
		<div className="FPL-Stats">
			<div className="intro-details">
				<h2>Player Searcher!</h2>

				{data && (
					<div>
						<img
							className="player-pic"
							src={`https://resources.premierleague.com/premierleague/photos/players/110x140/p${451340}.png`}
							alt="Mitoma"
						/>
						<img
							className="player-pic"
							src={`https://resources.premierleague.com/premierleague/photos/players/110x140/p${176297}.png`}
							alt="Rashford"
						/>
						<img
							className="player-pic"
							src={`https://resources.premierleague.com/premierleague/photos/players/110x140/p${223340}.png`}
							alt="Saka"
						/>
						<img
							className="player-pic"
							src={`https://resources.premierleague.com/premierleague/photos/players/110x140/p${85971}.png`}
							alt="Son"
						/>
						<img
							className="player-pic"
							src={`https://resources.premierleague.com/premierleague/photos/players/110x140/p${77794}.png`}
							alt="Trippier"
						/>
					</div>
				)}
			</div>
			<div className="intro-text">
				<p>
					Not sure who to pick? Compare player stats using the side by side
					comparison tool!
				</p>
				<p>
					Type in a player's surname below to see a range of FPL stats displayed
					for them (check spelling / official FPL name if doesn't display):
				</p>
			</div>
			<br />
			<div className="playerSearcher">
				<form
					className="form"
					onSubmit={handleSubmit}>
					<label className="form-label">
						Type Player Name Here:
						<input
							className="form-input"
							type="text"
							value={targetWebName}
							onChange={handleInputChange}
						/>
					</label>
					<button type="submit">Find Player</button>
				</form>

				<form
					className="form"
					onSubmit={handleSubmit2}>
					<label className="form-label">
						Type Player Name Here:
						<input
							className="form-input"
							type="text"
							value={targetWebName2}
							onChange={handleInputChange2}
						/>
					</label>
					<button type="submit">Find Player</button>
				</form>
			</div>

			<div className="results-wrapper">
				{targetedPlayer ? (
					<div className="results">
						<img
							className="player-pic2"
							src={`https://resources.premierleague.com/premierleague/photos/players/110x140/p${targetedPlayer.code}.png`}
							alt={targetedPlayer.web_name}
						/>
						<p>
							Player Name: <strong>{targetedPlayer.first_name} {targetedPlayer.second_name}</strong>
							<br />Team: <strong>{mainData.teams[targetedPlayer.team - 1].name}</strong>
						</p>
						<p>
							Selected By: <strong>{targetedPlayer.selected_by_percent}%</strong>
							<br />Cost: <strong>{(targetedPlayer.now_cost / 10).toFixed(1)}m</strong>
						</p>

						<p>
							Total Points: <strong>{targetedPlayer.total_points}</strong>
							<br />Form: <strong>{targetedPlayer.form}</strong>
							<br />xGI per 90: <strong>{targetedPlayer.expected_goal_involvements_per_90}</strong>
						</p>
					</div>
				) : (
					<p className="results">Player not found - try again!</p>
				)}

				{targetedPlayer2 ? (
					<div className="results">
						<img
							className="player-pic2"
							src={`https://resources.premierleague.com/premierleague/photos/players/110x140/p${targetedPlayer2.code}.png`}
							alt={targetedPlayer2.web_name}
						/>
						<p>
							Player Name: <strong>{targetedPlayer2.first_name} {targetedPlayer2.second_name}</strong>
							<br />Team: <strong>{mainData.teams[targetedPlayer2.team - 1].name}</strong>
						</p>
						<p>
						Selected By: <strong>{targetedPlayer2.selected_by_percent}%</strong>
						<br />Cost: <strong>{(targetedPlayer2.now_cost / 10).toFixed(1)}m</strong>
						</p>
						
						<p>
							Total Points: <strong>{targetedPlayer2.total_points}</strong>
							<br />Form: <strong>{targetedPlayer2.form}</strong>
							<br />xGI per 90: <strong>{targetedPlayer2.expected_goal_involvements_per_90}</strong>
						</p>
					</div>
				) : (
					<p className="results">Player not found - try again!</p>
				)}
			</div>
		</div>
	);
}
