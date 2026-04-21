import React from 'react';
import "./FilterComponents.css"

export default function RoomTypeFilter({ value, onChange }) {
  return (
    <select className="filter-select" value={value} onChange={e => onChange(e.target.value)}>
      <option value="all">All Rooms</option>
      <option value="female">Female</option>
      <option value="male">Male</option>
    </select>
  );
}
