import React, { useState, useEffect, useRef  } from "react";
import "./formResults.css";
import { findPlayerByWebName } from "../playerSearcher";

export default function FormResults({ targetWebName, setTargetWebName, handleSubmit, targetedPlayer, mainData, showAttackingStats, showDefendingStats, showGoals, showAssists, showGoalsPer90, showAssistsPer90, showCleanSheets, showGoalsConceded }) {
    const [searchResults, setSearchResults] = useState([]);
    const dropdownRef = useRef(null);

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
    }, [dropdownRef]);

    const handleInputChange = (event) => {
        const searchTerm = event.target.value.toLowerCase();
        setTargetWebName(searchTerm);

        const matchingPlayers = mainData.elements.filter(
            (player) => player.web_name.toLowerCase().includes(searchTerm)
        );
        setSearchResults(matchingPlayers);
    };

    const handleSelectPlayer = (playerName) => {
        setTargetWebName(playerName);
        setSearchResults([]); 
        handleSubmit({ preventDefault: () => {} }, targetedPlayer, playerName);

        // Focus on the hidden button to remove focus from the input field
        if (hiddenButtonRef.current) {
            console.log("BLURRR");
            hiddenButtonRef.current.focus();
        }
    };
    
    useEffect(() => {
        if (targetWebName !== "") {
            handleSubmit({ preventDefault: () => {} }, { targetedPlayer, targetWebName });
        }
    }, [targetWebName]);

    const hiddenButtonRef = useRef(null);


    return (
        <div className="fpl-stats">
            <div className="player-searcher">
                <form className="form" onSubmit={handleSubmit}>
                    <label className="form-label">
                        Enter Player Name Here:
                        <input
                            className="form-input"
                            type="text"
                            value={targetWebName}
                            onChange={handleInputChange}
                            label="Enter Player Name Here:"
                        />
                        {searchResults.length > 0 && (
                            <div className="search-dropdown" ref={dropdownRef}>
                                {searchResults.map((result) => (
                                    <div
                                        key={result.id}
                                        className="search-item"
                                        onClick={() => handleSelectPlayer(result.web_name)}
                                    >
                                        {result.web_name}
                                    </div>
                                ))}
                            </div>
                        )}
                    </label>
                    <button className='submit-button' type="submit">Find Player</button>
                    <button ref={hiddenButtonRef} style={{ display: 'none' }} />

                </form>

                <div className="results-wrapper">
                {targetedPlayer ? (
                    <div className="results">
                        <img
                            className="player-pic2"
                            src={`https://resources.premierleague.com/premierleague/photos/players/110x140/p${targetedPlayer.code}.png`}
                            alt={targetedPlayer.web_name}
                        />
                        
                        <p>
                            <p className="stats-headings">
                                <strong>PLAYER STATS</strong>
                            </p>
                            <p className="stats-results">
                                Name: <strong>{targetedPlayer.first_name} {targetedPlayer.second_name}</strong>
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
                        </p>
                        
                        
                        <p>
                            <p className="stats-headings"><strong>
                                SELECTION STATS</strong>
                            </p>
                            <p className="stats-results">
                                Selected By: <strong>{targetedPlayer.selected_by_percent}%</strong>
                            </p>
                            <p className="stats-results">
                                Cost: <strong>{(targetedPlayer.now_cost / 10).toFixed(1)}m</strong>
                            </p>
                        </p>
                        
                        <p>
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
                        </p>

                        <p>
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
                        </p>
                        
                        <p>
                            {(showCleanSheets || showGoalsConceded) && 
                                <p className="stats-headings">
                                    <strong>DEFENDING STATS</strong>
                                </p>
                            }
                            {showCleanSheets && (
                                <p className="stats-results">Clean Sheets: <strong>{targetedPlayer.clean_sheets}</strong> (per start: <strong>{targetedPlayer.minutes !== 0 ? (targetedPlayer.clean_sheets / targetedPlayer.starts * 100).toFixed(1) : 0}%</strong>)</p>
                            )}
                            {showGoalsConceded && (
                                <p className="stats-results">Goals conceded: <strong>{targetedPlayer.goals_conceded}</strong> (xGC: <strong>{targetedPlayer.expected_goals_conceded}</strong>)</p>
                            )}
                        </p>
                        
                    </div>
                ) : (
                    <p className="results">
                        Player not found - try again!
                    </p>
                )}
                </div>
            </div>
        </div>
    );
}