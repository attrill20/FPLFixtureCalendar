import React, { useState, useEffect, useRef } from "react";
import "./formResults.css";

export default function FormResults({ targetWebName, setTargetWebName, handleSubmit, targetedPlayer, mainData, showAttackingStats, showDefendingStats, showGoals, showAssists, showGoalsPer90, showAssistsPer90, showCleanSheets, showGoalsConceded }) {
    const [searchResults, setSearchResults] = useState([]);
    const dropdownRef = useRef(null);
    const clickTargetRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setSearchResults([]); // Hide the dropdown
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownRef, clickTargetRef]);

    const handleInputChange = (event) => {
        const searchTerm = event.target.value.toLowerCase();
        setTargetWebName(searchTerm);

        const matchingPlayers = mainData.elements.filter(
            (player) => player.web_name.toLowerCase().includes(searchTerm)
        );

        matchingPlayers.sort((a, b) => {
            return b.total_points - a.total_points;
        });

        setSearchResults(matchingPlayers);
    };

    useEffect(() => {
        if (targetWebName !== "") {
            handleSubmit({ preventDefault: () => {} }, { targetedPlayer, targetWebName });
        }
    }, [targetWebName]);

    const handleSelectPlayer = (playerName) => {
        setTargetWebName(playerName);
        setSearchResults([]); 
        handleSubmit({ preventDefault: () => {} }, targetedPlayer, playerName);
        clickTargetRef.current.click();
    };

    return (
        <div className="player-searcher">
            <form className="form" onSubmit={handleSubmit}>
                <div className="input-container">
                    <label className="form-label">
                        Enter Player Name Here:
                    </label>
                    <input
                        className="form-input"
                        type="text"
                        value={targetWebName}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="button-container">
                    <button className='submit-button' type="submit">
                        Find Player
                    </button>
                </div>
            </form>

            <div className="results-wrapper">
            {targetedPlayer ? (
                <div className="results">
                    <div className="top-row">
                        <img
                            className="player-pic2"
                            src={`https://resources.premierleague.com/premierleague/photos/players/110x140/p${targetedPlayer.code}.png`}
                            alt={targetedPlayer.web_name}
                        />

                        <div className="stats-wrapper">
                            <div className="stats-section">
                                <p className="stats-headings">
                                    <strong>PLAYER STATS</strong>
                                </p>
                                <p className="stats-results">
                                    Name: <strong>{`${targetedPlayer.first_name} ${targetedPlayer.second_name}`.length >= 20 ? targetedPlayer.web_name : `${targetedPlayer.first_name} ${targetedPlayer.second_name}`}</strong>
                                </p>
                                <p className="stats-results">
                                    Team: <strong>{mainData.teams[targetedPlayer.team - 1].name}</strong>
                                </p>
                                <p className="stats-results">
                                    Position: <strong>{
                                            targetedPlayer.element_type === 1 ? 'Goalkeeper' : 
                                            targetedPlayer.element_type === 2 ? 'Defender' : 
                                            targetedPlayer.element_type === 3 ? 'Midfielder' : 
                                            targetedPlayer.element_type === 4 ? 'Forward' : 
                                            'Unknown Position'}
                                    </strong>
                                </p>
                            </div>
                            
                            <div className="stats-section">
                                <p className="stats-headings"><strong>
                                    SELECTION STATS</strong>
                                </p>
                                <p className="stats-results">
                                    Selected By: <strong>{targetedPlayer.selected_by_percent}%</strong>
                                </p>
                                <p className="stats-results">
                                    Cost: <strong>{(targetedPlayer.now_cost / 10).toFixed(1)}m</strong>
                                </p>
                            </div>

                            <div className="stats-section">
                                <p className="stats-headings"><strong>
                                    POINTS STATS</strong>
                                </p>
                                <p className="stats-results">
                                    Total Points: <strong>{targetedPlayer.total_points}</strong>
                                </p>
                                <p className="stats-results">
                                    Minutes Played:  <strong>{targetedPlayer.minutes.toLocaleString()}</strong>
                                </p>
                                <p className="stats-results">
                                    Form: <strong>{targetedPlayer.form}</strong>
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    

                    <div className="single-stat">
                        {(showGoals || showAssists || showGoalsPer90 || showAssistsPer90) && 
                            <p className="stats-headings">
                                <strong>ATTACKING STATS</strong>
                            </p>
                        }
                        {showGoals && (
                            <p className="stats-results">
                                Goals: <strong>{targetedPlayer.goals_scored}</strong> (xG: <strong>{targetedPlayer.expected_goals}</strong>)
                            </p>
                        )}
                        {showAssists && (
                            <p className="stats-results">
                                Assists: <strong>{targetedPlayer.assists}</strong> (xA: <strong>{targetedPlayer.expected_assists}</strong>)
                            </p>
                        )}
                        {showGoalsPer90 && (
                            <p className="stats-results">
                                Goals per 90: <strong>{targetedPlayer.minutes !== 0 ? (targetedPlayer.goals_scored / targetedPlayer.minutes * 90).toFixed(2) : 0}</strong> (xG: <strong>{targetedPlayer.minutes !== 0 ? (targetedPlayer.expected_goals / targetedPlayer.minutes * 90).toFixed(2) : 0}</strong>)
                            </p>
                        )}
                        {showAssistsPer90 && (
                            <p className="stats-results">
                                Assists per 90: <strong>{targetedPlayer.minutes !== 0 ? (targetedPlayer.assists / targetedPlayer.minutes * 90).toFixed(2) : 0}</strong> (xA: <strong>{targetedPlayer.minutes !== 0 ? (targetedPlayer.expected_assists / targetedPlayer.minutes * 90).toFixed(2) : 0}</strong>)</p>
                            )}
                    </div>
                    
                    <div className="single-stat">
                        {(showCleanSheets || showGoalsConceded) && 
                            <p className="stats-headings">
                                <strong>DEFENDING STATS</strong>
                            </p>
                        }
                        {showCleanSheets && (
                            <p className="stats-results">
                                Clean Sheets: <strong>{targetedPlayer.clean_sheets}</strong>{targetedPlayer.starts > 0 ? (
                                    <span> (per start: <strong>{(targetedPlayer.clean_sheets / targetedPlayer.starts * 100).toFixed(1)}%</strong>)</span>
                                ) : (
                                    <span> (per start: <strong>N/A</strong>)</span>
                                )}
                            </p>
                        )}
                        {showGoalsConceded && (
                            <p className="stats-results">Goals Conceded: <strong>{targetedPlayer.goals_conceded}</strong> (xGC: <strong>{targetedPlayer.expected_goals_conceded}</strong>)</p>
                        )}
                    </div>
                    
                </div>
            ) : (
                <p className="results">
                    Enter a player's surname in the field above!
                </p>
            )}
            </div>
        </div>
    );
}
