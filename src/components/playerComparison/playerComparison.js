import React, { useState } from "react";
import FormResults from "./formResults/formResults";
import Checkboxes from "./checkboxes/checkboxes";
import "./playerComparison.css";

export default function PlayerComparison({ mainData }) {
	const [targetedPlayer, setTargetedPlayer] = useState(null);
	const [targetWebName, setTargetWebName] = useState("");
	const [targetedPlayer2, setTargetedPlayer2] = useState(null);
	const [targetWebName2, setTargetWebName2] = useState("");

	const [showAttackingStats, setShowAttackingStats] = useState(true);
	const [showGoals, setShowGoals] = useState(true);
	const [showAssists, setShowAssists] = useState(true);
	const [showGoalsPer90, setShowGoalsPer90] = useState(true);
	const [showAssistsPer90, setShowAssistsPer90] = useState(true);

	const [showDefendingStats, setShowDefendingStats] = useState(false);
	const [showCleanSheets, setShowCleanSheets] = useState(false);
	const [showGoalsConceded, setShowGoalsConceded] = useState(false);
	const [showGoalsConcededPer90, setShowGoalsConcededPer90] = useState(false);

	function reverseNormalize(name) {
		const specialChars = {
		  'ø': 'o',
		  'Ø': 'O',
		  'æ': 'ae',
		  'Æ': 'AE',
		  'å': 'a',
		  'Å': 'A',
		  // Add more special characters and their ASCII equivalents as needed
		};
	  
		return name.replace(/[øØæÆåÅ]/g, char => specialChars[char] || char);
	  }
	  
	  const findPlayerByWebName = (webName) => {
		const normalizedWebName = reverseNormalize(webName);
		const lowercaseWebName = normalizedWebName.toLowerCase();
		
		const player = mainData.elements.find(
		  (player) => reverseNormalize(player.web_name).toLowerCase() === lowercaseWebName
		);
		
		return player;
	  };

	// const handleInputChange = (event) => {
	// 	setTargetWebName(event.target.value);
	// };

	const handleSubmit = (event, setTargetedPlayer, targetWebName) => {
		event.preventDefault();
		const player = findPlayerByWebName(targetWebName);
		setTargetedPlayer(player);
	};

	return (
		<div className="player-comparison-wrapper">
			<div className="checkbox-container">
				<Checkboxes
					showAttackingStats={showAttackingStats}
					showDefendingStats={showDefendingStats}
					showGoals={showGoals}
					showAssists={showAssists}
					showGoalsPer90={showGoalsPer90}
					showAssistsPer90={showAssistsPer90}
					showCleanSheets={showCleanSheets}
					showGoalsConceded={showGoalsConceded}
					showGoalsConcededPer90={showGoalsConcededPer90}
					setShowAttackingStats={setShowAttackingStats}
					setShowDefendingStats={setShowDefendingStats}
					setShowGoals={setShowGoals}
					setShowAssists={setShowAssists}
					setShowGoalsPer90={setShowGoalsPer90}
					setShowAssistsPer90={setShowAssistsPer90}
					setShowCleanSheets={setShowCleanSheets}
					setShowGoalsConceded={setShowGoalsConceded}
					setShowGoalsConcededPer90={setShowGoalsConcededPer90}
				/>
			</div>
			
			<div className="fpl-stats">
				<FormResults
					targetWebName={targetWebName}
					setTargetWebName={setTargetWebName}
					handleSubmit={(event) => handleSubmit(event, setTargetedPlayer, targetWebName)}
					targetedPlayer={targetedPlayer}
					mainData={mainData}
					showAttackingStats={showAttackingStats}
					showDefendingStats={showDefendingStats}
					showGoals={showGoals}
					showAssists={showAssists}
					showGoalsPer90={showGoalsPer90}
					showAssistsPer90={showAssistsPer90}
					showCleanSheets={showCleanSheets}
					showGoalsConceded={showGoalsConceded}
					showGoalsConcededPer90={showGoalsConcededPer90}
				/>

				<FormResults
					targetWebName={targetWebName2}
					setTargetWebName={setTargetWebName2}
					handleSubmit={(event) => handleSubmit(event, setTargetedPlayer2, targetWebName2)}
					targetedPlayer={targetedPlayer2}
					mainData={mainData}
					showAttackingStats={showAttackingStats}
					showDefendingStats={showDefendingStats}
					showGoals={showGoals}
					showAssists={showAssists}
					showGoalsPer90={showGoalsPer90}
					showAssistsPer90={showAssistsPer90}
					showCleanSheets={showCleanSheets}
					showGoalsConceded={showGoalsConceded}
					showGoalsConcededPer90={showGoalsConcededPer90}
				/>
			</div>
		</div>
	);
}
