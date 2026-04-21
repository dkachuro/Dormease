import React from 'react';
import "./ClearFiltersButton.css"

export default function ClearFiltersButton({ onClick }) {
  return (
    <button className="clear-filters-btn" onClick={onClick}>
      Clear Filters
    </button>
  );
}
