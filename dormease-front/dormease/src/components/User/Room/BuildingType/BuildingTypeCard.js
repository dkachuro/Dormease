import React, { useState, useRef, useEffect } from 'react';
import './BuildingTypeCard.css';

export default function BuildingTypeCard({ icon, roomCount, floorCount, availableCount, address, onNextStep }) {
  const [selectedFloor, setSelectedFloor] = useState('All Floors');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [dropdownDirection, setDropdownDirection] = useState('down');
  const dropdownRef = useRef(null);
  const toggleRef = useRef(null);

  const floorOptions = [
    'All Floors',
    ...Array.from({ length: floorCount }, (_, i) => `Floor ${i + 1}`)
  ];

  const handleFloorSelect = (floor) => {
    setSelectedFloor(floor);
    setIsDropdownOpen(false);
    if (onNextStep) {
      onNextStep(); 
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) &&
          toggleRef.current && !toggleRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    const calculateDropdownPosition = () => {
      if (toggleRef.current && isDropdownOpen) {
        const toggleRect = toggleRef.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - toggleRect.bottom;
        const spaceAbove = toggleRect.top;
        const dropdownHeight = floorOptions.length * 36;
        setDropdownDirection(spaceBelow > dropdownHeight || spaceBelow > spaceAbove ? 'down' : 'up');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    calculateDropdownPosition();
    window.addEventListener('resize', calculateDropdownPosition);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('resize', calculateDropdownPosition);
    };
  }, [isDropdownOpen, floorOptions.length]);

  return (
    <div className="building-card" onClick={handleFloorSelect}>
      <div className="building-icon-container">
        <img src={icon.image} alt={icon.title} className="building-icon" />
      </div>
      <div className="building-stats">
        <p className='stat-item-address'>Address: {address}</p>
        <p className="stat-item-floors">{floorCount} Floors</p>
        <p className="stat-item-buildings">{roomCount} Rooms</p>

      </div> 
      <div className='parent-container'> 
        <div className="available-stat-container">
          <p className="available-stat">Available: {availableCount}</p>
        </div>
      </div>
    </div>
  );
}
