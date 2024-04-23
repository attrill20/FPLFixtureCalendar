import React, { useState } from "react";
import "./checkboxes.css";

export default function Checkboxes({showGoals, showAssists, setShowGoals, setShowAssists}) {

    const handleCheckboxChangeGoals = () => {
        setShowGoals(!showGoals);
    };

	const handleCheckboxChangeAssists = () => {
        setShowAssists(!showAssists);
    };

    return (
		<div className="checkboxes">
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
         </div>
    )
}