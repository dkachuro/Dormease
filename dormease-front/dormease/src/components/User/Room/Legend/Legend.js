import React from 'react';
import "./Legend.css"

export default function Legend() {
  return (
    <div className="legend-container">
      <div className="legend-item available">
        <span className="legend-text">Available</span>
      </div>

      <div className="legend-item occupied">
        <span className="legend-text">Occupied</span>
      </div>
    </div>
  );
}
