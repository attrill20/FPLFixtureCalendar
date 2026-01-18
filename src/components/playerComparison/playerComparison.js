import React, { useState } from "react";
import FormResults from "./formResults/formResults";
import Checkboxes from "./checkboxes/checkboxes";
import GameweekRangeFilter from "../GameweekRangeFilter/GameweekRangeFilter";
import { supabase } from "../../supabaseClient";
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

	// Gameweek filtering state
	const [gwRange, setGwRange] = useState(null); // null = no filter (use full season data)
	const [filteredStats, setFilteredStats] = useState({}); // { playerId: { ...stats } }
	const [filterLoading, setFilterLoading] = useState(false);

	// Get current gameweek from mainData
	const activeGameweek = mainData?.events?.find(event => event.is_current)?.id || 38;

	// Handle gameweek filter apply
	const handleFilterApply = async (range) => {
		if (!targetedPlayer && !targetedPlayer2) {
			// No players selected yet
			setGwRange(range);
			return;
		}

		setFilterLoading(true);
		try {
			const playerIds = [];
			if (targetedPlayer) playerIds.push(targetedPlayer.id);
			if (targetedPlayer2) playerIds.push(targetedPlayer2.id);

			if (playerIds.length === 0) {
				setGwRange(range);
				setFilteredStats({});
				return;
			}

			// Fetch filtered stats from Supabase
			const { data, error } = await supabase
				.rpc('aggregate_player_stats_by_gw_range', {
					player_ids: playerIds,
					start_gw: range[0],
					end_gw: range[1]
				});

			if (error) {
				console.error('Error fetching filtered stats:', error);
				throw error;
			}

			// Convert array to object keyed by player_id for easy lookup
			const statsMap = {};
			data.forEach(stat => {
				statsMap[stat.player_id] = stat;
			});

			setFilteredStats(statsMap);
			setGwRange(range);
		} catch (error) {
			console.error('Failed to apply gameweek filter:', error);
			alert('Failed to load filtered stats. Using full season data.');
			setGwRange(null);
			setFilteredStats({});
		} finally {
			setFilterLoading(false);
		}
	};

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
			{/* Gameweek Range Filter */}
			<GameweekRangeFilter
				maxGameweek={activeGameweek}
				onFilterApply={handleFilterApply}
				disabled={filterLoading}
			/>

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
					filteredStats={targetedPlayer ? filteredStats[targetedPlayer.id] : null}
					gwRange={gwRange}
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
					filteredStats={targetedPlayer2 ? filteredStats[targetedPlayer2.id] : null}
					gwRange={gwRange}
				/>
			</div>
		</div>
	);
}
