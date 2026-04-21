import React from 'react';
import "./FilterComponents.css"

export default function PeopleFilter({ value, onChange }) {
  return (
    <select className="filter-select" value={value} onChange={e => onChange(e.target.value)}>
      <option value="1">All Rooms</option>
      <option value="2">2 People</option>
      <option value="3">3 People</option>
    </select>
  );
}
