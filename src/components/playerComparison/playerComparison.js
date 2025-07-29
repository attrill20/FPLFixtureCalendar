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
	const [showDefensiveContributions, setShowDefensiveContributions] = useState(false);

	function reverseNormalize(name) {
		const specialChars = {
		  'ø': 'o', 'Ø': 'O',
		  'æ': 'ae', 'Æ': 'AE',
		  'å': 'a', 'Å': 'A',
		  'ä': 'a', 'Ä': 'A',
		  'ö': 'o', 'Ö': 'O',
		  'ü': 'u', 'Ü': 'U',
		  'ñ': 'n', 'Ñ': 'N',
		  'ç': 'c', 'Ç': 'C',
		  'é': 'e', 'É': 'E',
		  'è': 'e', 'È': 'E',
		  'ê': 'e', 'Ê': 'E',
		  'ë': 'e', 'Ë': 'E',
		  'á': 'a', 'Á': 'A',
		  'à': 'a', 'À': 'A',
		  'â': 'a', 'Â': 'A',
		  'í': 'i', 'Í': 'I',
		  'ì': 'i', 'Ì': 'I',
		  'î': 'i', 'Î': 'I',
		  'ï': 'i', 'Ï': 'I',
		  'ó': 'o', 'Ó': 'O',
		  'ò': 'o', 'Ò': 'O',
		  'ô': 'o', 'Ô': 'O',
		  'ú': 'u', 'Ú': 'U',
		  'ù': 'u', 'Ù': 'U',
		  'û': 'u', 'Û': 'U'
		};
	  
		return name.replace(/[øØæÆåÅäÄöÖüÜñÑçÇéÉèÈêÊëËáÁàÀâÂíÍìÌîÎïÏóÓòÒôÔúÚùÙûÛ]/g, char => specialChars[char] || char);
	  }
	  
	  const findPlayerByWebName = (webName) => {
		const normalizedWebName = reverseNormalize(webName);
		const lowercaseWebName = normalizedWebName.toLowerCase();
		
		const player = mainData.elements.find(
		  (player) => reverseNormalize(player.web_name).toLowerCase() === lowercaseWebName
		);
		
		return player;
	  };

	  const findPlayerById = (playerId) => {
		return mainData.elements.find(player => player.id === playerId);
	  };

	const handleSubmit = (event, setTargetedPlayer, identifier) => {
		event.preventDefault();
		const player = typeof identifier === 'number' ? findPlayerById(identifier) : findPlayerByWebName(identifier);
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
					showDefensiveContributions={showDefensiveContributions}
					setShowAttackingStats={setShowAttackingStats}
					setShowDefendingStats={setShowDefendingStats}
					setShowGoals={setShowGoals}
					setShowAssists={setShowAssists}
					setShowGoalsPer90={setShowGoalsPer90}
					setShowAssistsPer90={setShowAssistsPer90}
					setShowCleanSheets={setShowCleanSheets}
					setShowGoalsConceded={setShowGoalsConceded}
					setShowGoalsConcededPer90={setShowGoalsConcededPer90}
					setShowDefensiveContributions={setShowDefensiveContributions}
				/>
			</div>
			
			<div className="fpl-stats">
				<FormResults
					targetWebName={targetWebName}
					setTargetWebName={setTargetWebName}
					handleSubmit={(event) => handleSubmit(event, setTargetedPlayer, targetWebName)}
					setTargetedPlayer={setTargetedPlayer}
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
					showDefensiveContributions={showDefensiveContributions}
				/>

				<FormResults
					targetWebName={targetWebName2}
					setTargetWebName={setTargetWebName2}
					handleSubmit={(event) => handleSubmit(event, setTargetedPlayer2, targetWebName2)}
					setTargetedPlayer={setTargetedPlayer2}
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
					showDefensiveContributions={showDefensiveContributions}
				/>
			</div>
		</div>
	);
}
