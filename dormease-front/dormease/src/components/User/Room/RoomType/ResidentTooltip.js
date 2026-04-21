import React from 'react';
import "./ResidentTooltip.css";

export default function ResidentTooltip({ residents }) {
  return (
    <div className="resident-tooltip">
      {residents.map((r, idx) => (
        <div key={idx} className="resident-entry">
          <div className="resident-name">{r.name}</div>
          <div className="resident-detail">Course: {r.course}</div>
          <div className="resident-detail">Group: {r.group}</div>
          <div className="resident-detail">Roommate preference:</div>
          <div className="resident-preference">{r.preference}</div>
        </div>
      ))}
    
    </div>
  );
}
