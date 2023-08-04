// TableHeader.js
import React from "react";

export default function TableHeader({ numberOfFixtures }) {
  const headerCells = Array.from({ length: numberOfFixtures }, (_, index) => (
    <th key={index}>{`GW ${index + 1}`}</th>
  ));

  return (
    <thead className="table-header">
      <tr>
        <th>Team</th>
        <th className="FDR-column">FDR</th>
        {headerCells}
      </tr>
    </thead>
  );
}
