import React from 'react';
import "./FilterComponents.css";

export default function FloorFilter({ value, onChange, maxFloor }) {
  const floorOptions = Array.from({ length: maxFloor }, (_, i) => i + 1);

  return (
    <select className="filter-select" value={value} onChange={e => onChange(e.target.value)}>
      {floorOptions.map(floor => (
        <option key={floor} value={floor}>
          Floor {floor}
        </option>
      ))}
    </select>
  );
}
