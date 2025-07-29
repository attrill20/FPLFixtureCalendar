import React from "react";
import "./checkboxes.css";

export default function Checkboxes({ showAttackingStats, showDefendingStats, showGoals, showAssists, showGoalsPer90, showAssistsPer90, showCleanSheets, showGoalsConceded, showGoalsConcededPer90, showDefensiveContributions, setShowAttackingStats, setShowDefendingStats, setShowGoals, setShowAssists, setShowGoalsPer90, setShowAssistsPer90, setShowCleanSheets, setShowGoalsConceded, setShowGoalsConcededPer90, setShowDefensiveContributions }) {

    const handleCheckboxChangeAttackingStats = () => {
        setShowAttackingStats(!showAttackingStats);
        if (!showAttackingStats) {
            setShowGoals(true);
            setShowAssists(true);
            setShowGoalsPer90(true);
            setShowAssistsPer90(true);
        } else {
            setShowGoals(false);
            setShowAssists(false);
            setShowGoalsPer90(false);
            setShowAssistsPer90(false);
        }
    };

    const handleCheckboxChangeDefendingStats = () => {
        setShowDefendingStats(!showDefendingStats);
        if (!showDefendingStats) {
            setShowCleanSheets(true);
            setShowGoalsConceded(true);
            setShowGoalsConcededPer90(true);
            setShowDefensiveContributions(true);
        } else {
            setShowCleanSheets(false);
            setShowGoalsConceded(false);
            setShowGoalsConcededPer90(false);
            setShowDefensiveContributions(false);
        }
    };
    
    const handleCheckboxChangeGoals = () => {
        setShowGoals(!showGoals);
    };

	const handleCheckboxChangeAssists = () => {
        setShowAssists(!showAssists);
    };

    const handleCheckboxChangeGoalsPer90 = () => {
        setShowGoalsPer90(!showGoalsPer90);
    };

    const handleCheckboxChangeAssistsPer90 = () => {
        setShowAssistsPer90(!showAssistsPer90);
    };

    const handleCheckboxChangeCleanSheets = () => {
        setShowCleanSheets(!showCleanSheets);
    };

    const handleCheckboxChangeGoalsConceded = () => {
        setShowGoalsConceded(!showGoalsConceded);
    };

    const handleCheckboxChangeGoalsConcededPer90 = () => {
        setShowGoalsConcededPer90(!showGoalsConcededPer90);
    };

    const handleCheckboxChangeDefensiveContributions = () => {
        setShowDefensiveContributions(!showDefensiveContributions);
    };

    return (
		<div className="checkboxes-wrapper">
            <div>
                <div className="stats-box">
                    <label className="form-label">
                        <strong>Attacking Stats: </strong>
                    </label>

                    <input
                        className="form-checkbox"
                        type="checkbox"
                        checked={showAttackingStats}
                        onChange={handleCheckboxChangeAttackingStats}
                    />

                     <label className="form-label">
                        <strong>(</strong>
                    </label>

                    <label className="form-label">
                        Goals:
                        <input
                            className="form-checkbox"
                            type="checkbox"
                            checked={showGoals}
                            onChange={handleCheckboxChangeGoals}
                        />
                    </label>

                    <label className="form-label">
                        Assists:
                        <input
                            className="form-checkbox"
                            type="checkbox"
                            checked={showAssists}
                            onChange={handleCheckboxChangeAssists}
                        />
                    </label>

                    <label className="form-label">
                        Goals per 90:
                        <input
                            className="form-checkbox"
                            type="checkbox"
                            checked={showGoalsPer90}
                            onChange={handleCheckboxChangeGoalsPer90}
                        />
                    </label>

                    <label className="form-label">
                        Assists per 90:
                        <input
                            className="form-checkbox"
                            type="checkbox"
                            checked={showAssistsPer90}
                            onChange={handleCheckboxChangeAssistsPer90}
                        />
                    </label>

                    <label className="form-label">
                        <strong>)</strong>
                    </label>
                </div>
            </div>

            

            <div>
                <div className="stats-box">
                    <label className="form-label">
                        <strong>Defending Stats: </strong>
                    </label>

                    <input
                        className="form-checkbox"
                        type="checkbox"
                        checked={showDefendingStats}
                        onChange={handleCheckboxChangeDefendingStats}
                    />

                    <label className="form-label">
                        <strong>(</strong>
                    </label>

                    <label className="form-label">
                        Clean Sheets:
                        <input
                            className="form-checkbox"
                            type="checkbox"
                            checked={showCleanSheets}
                            onChange={handleCheckboxChangeCleanSheets}
                        />
                    </label>

                    <label className="form-label">
                        Goals Conceded:
                        <input
                            className="form-checkbox"
                            type="checkbox"
                            checked={showGoalsConceded}
                            onChange={handleCheckboxChangeGoalsConceded}
                        />
                    </label>

                    <label className="form-label">
                        Goals Conceded Per 90:
                        <input
                            className="form-checkbox"
                            type="checkbox"
                            checked={showGoalsConcededPer90}
                            onChange={handleCheckboxChangeGoalsConcededPer90}
                        />
                    </label>

                    <label className="form-label">
                        Defensive Contributions:
                        <input
                            className="form-checkbox"
                            type="checkbox"
                            checked={showDefensiveContributions}
                            onChange={handleCheckboxChangeDefensiveContributions}
                        />
                    </label>

                    <label className="form-label">
                        <strong>)</strong>
                    </label>
                </div>
            </div>
            
            
         </div>
    )
}