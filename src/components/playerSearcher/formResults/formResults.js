import React from "react";
import "./formResults.css";

export default function FormResults({ targetWebName, setTargetWebName, handleSubmit, targetedPlayer, mainData, showGoals, showAssists, label }) {
    
    const handleInputChange = (event) => {
		setTargetWebName(event.target.value);
	};



    return (
        <div className="fpl-stats">
            <div className="player-searcher">
                <form
                    className="form"
                    onSubmit={handleSubmit}>
                    <label className="form-label">
                        Enter Player Name Here:
                        <input
                            className="form-input"
                            type="text"
                            value={targetWebName}
                            onChange={handleInputChange}
                            label="Enter Player Name Here:"
                        />
                    </label>
                    <button className='submit-button' type="submit">Find Player</button>
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
                            Name: <strong>{targetedPlayer.first_name} {targetedPlayer.second_name}</strong>
                            <br />Team: <strong>{mainData.teams[targetedPlayer.team - 1].name}</strong>
                            <br />Position: <strong>{
                                    targetedPlayer.element_type === 1 ? 'Goalkeeper' : 
                                    targetedPlayer.element_type === 2 ? 'Defender' : 
                                    targetedPlayer.element_type === 3 ? 'Midfielder' : 
                                    targetedPlayer.element_type === 4 ? 'Forward' : 
                                    'Unknown'}
                                </strong>
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

                        <p>
                        {showGoals && (
                            <p>Goals: <strong>{targetedPlayer.goals_scored}</strong></p>
                            )}
                        {showAssists && (
                            <p>Assists: <strong>{targetedPlayer.assists}</strong></p>
                            )}
                        </p>
                    </div>
                ) : (
                    <p className="results">Player not found - try again!</p>
                )}
                </div>
            </div>
        </div>
    );
}