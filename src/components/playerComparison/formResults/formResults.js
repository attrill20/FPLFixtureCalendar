import React, { useState, useEffect, useRef } from "react";
import "./formResults.css";

// Function to fetch historical data for a player
const fetchPlayerHistory = async (playerId) => {
    try {
        const response = await fetch(`https://fpl-server-nine.vercel.app/api?endpoint=element-summary&playerId=${playerId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch player history');
        }
        const data = await response.json();
        return data.history_past || [];
    } catch (error) {
        console.error('Error fetching player history:', error);
        return [];
    }
};

export default function FormResults({ targetWebName, setTargetWebName, handleSubmit, setTargetedPlayer, targetedPlayer, mainData, showAttackingStats, showDefendingStats, showGoals, showAssists, showGoalsPer90, showAssistsPer90, showCleanSheets, showGoalsConceded, showGoalsConcededPer90, showDefensiveContributions }) {
    const [searchResults, setSearchResults] = useState([]);
    const [playerHistory, setPlayerHistory] = useState(null);
    const [loadingHistory, setLoadingHistory] = useState(false);
    const dropdownRef = useRef(null);
    const clickTargetRef = useRef(null);

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

        const normalizedSearchTerm = reverseNormalize(searchTerm);
        const matchingPlayers = mainData.elements.filter(
            (player) => {
                const normalizedPlayerName = reverseNormalize(player.web_name.toLowerCase());
                return normalizedPlayerName.includes(normalizedSearchTerm);
            }
        );

        matchingPlayers.sort((a, b) => {
            return b.total_points - a.total_points;
        });

        setSearchResults(matchingPlayers);
    };

    // Fetch historical data when player changes
    useEffect(() => {
        const fetchHistoricalData = async () => {
            if (targetedPlayer && targetedPlayer.id) {
                setLoadingHistory(true);
                try {
                    const history = await fetchPlayerHistory(targetedPlayer.id);
                    setPlayerHistory(history);
                } catch (error) {
                    console.error('Failed to fetch player history:', error);
                    setPlayerHistory(null);
                } finally {
                    setLoadingHistory(false);
                }
            } else {
                setPlayerHistory(null);
            }
        };

        fetchHistoricalData();
    }, [targetedPlayer]);

    const handleSelectPlayer = (player) => {
        setTargetWebName(player.web_name);
        setSearchResults([]);
        setTargetedPlayer(player);
        clickTargetRef.current.click();
    };

    return (
        <div className="player-searcher">
            <form className="form" onSubmit={handleSubmit}>
                <div className="input-container">
                    <label className="form-label" ref={clickTargetRef}>
                        Enter Player Name Here:
                    </label>
                    <input
                        className="form-input"
                        type="text"
                        value={targetWebName}
                        onChange={handleInputChange}
                    />
                    {searchResults.length > 0 && (
                        <div className="search-dropdown" ref={dropdownRef}>
                            {searchResults.map((result) => {
                                // Check if there are other players with the same web_name
                                const duplicateSurnames = searchResults.filter(player => player.web_name === result.web_name).length > 1;
                                const displayName = duplicateSurnames ? `${result.first_name} ${result.web_name}` : result.web_name;
                                
                                return (
                                    <div
                                        key={result.id}
                                        className="search-item"
                                        onClick={() => handleSelectPlayer(result)}
                                    >
                                        {displayName}
                                    </div>
                                );
                            })}
                        </div>
                    )}
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
                            src={`https://resources.premierleague.com/premierleague/photos/players/250x250/p${targetedPlayer.code}.png`}
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
                                Assists per 90: <strong>{targetedPlayer.minutes !== 0 ? (targetedPlayer.assists / targetedPlayer.minutes * 90).toFixed(2) : 0}</strong> (xA: <strong>{targetedPlayer.minutes !== 0 ? (targetedPlayer.expected_assists / targetedPlayer.minutes * 90).toFixed(2) : 0}</strong>)
                            </p>
                            )}
                    </div>
                    
                    <div className="single-stat">
                        {(showCleanSheets || showGoalsConceded || showGoalsConcededPer90 || showDefensiveContributions) && 
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
                            <p className="stats-results">
                                Goals Conceded: <strong>{targetedPlayer.goals_conceded}</strong> (xGC: <strong>{targetedPlayer.expected_goals_conceded}</strong>)
                            </p>
                        )}
                        {showGoalsConcededPer90 && (
                            <p className="stats-results">
                                Goals Conceded Per 90: <strong>{targetedPlayer.goals_conceded_per_90}</strong> (xGC: <strong>{targetedPlayer.minutes !== 0 ? (targetedPlayer.expected_goals_conceded / targetedPlayer.minutes * 90).toFixed(2) : 0}</strong>)
                            </p>
                        )}
                        {showDefensiveContributions && (
                            <p className="stats-results">
                                Defensive Contributions: <strong>{targetedPlayer.defensive_contributions || 0}</strong>{targetedPlayer.starts > 0 ? (
                                    <span> (per start: <strong>{(((targetedPlayer.defensive_contributions || 0) / targetedPlayer.starts) * 100).toFixed(1)}%</strong>)</span>
                                ) : (
                                    <span> (per start: <strong>N/A</strong>)</span>
                                )}
                            </p>
                        )}
                    </div>

                    <div className="single-stat">
                        <p className="stats-headings">
                            <strong>BONUS STATS</strong>
                        </p>
                        <p className="stats-results">
                            Bonus: <strong>{targetedPlayer.bonus}</strong> (per 90: <strong>{targetedPlayer.minutes !== 0 ? (targetedPlayer.bonus / targetedPlayer.minutes * 90).toFixed(2) : 0}</strong>)
                        </p>
                        <p className="stats-results">
                            BPS: <strong>{targetedPlayer.bps}</strong> (per 90: <strong>{targetedPlayer.minutes !== 0 ? (targetedPlayer.bps / targetedPlayer.minutes * 90).toFixed(2) : 0}</strong>)
                        </p>
                    </div>

                    {playerHistory && playerHistory.length > 0 && (
                        <div className="single-stat">
                            <p className="stats-headings">
                                <strong>HISTORICAL STATS</strong>
                            </p>
                            {playerHistory.slice().reverse().map((season, index) => (
                                <p key={season.season_name} className="stats-results">
                                    {season.season_name}: <strong>{season.total_points} points </strong> 
                                    <span style={{color: '#666', fontSize: '0.9em'}}>
                                        ({season.minutes.toLocaleString()} mins, {season.goals_scored} goals / {season.assists} assists)
                                    </span>
                                </p>
                            ))}
                        </div>
                    )}
                </div>
            ) : (
                    <p className="results-placeholder">
                        Enter a player's surname in the field above!
                    </p>
            )}
            </div>
        </div>
    );
}
