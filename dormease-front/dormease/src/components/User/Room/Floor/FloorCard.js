import React from 'react';
import './FloorCard.css';

export default function FloorCard({ icon, roomCount, floorCount, availableCount }) {
  return (
    <div className="floor-card">
     <div className='floor-choose-btn'>

     </div>
     <div className="floor-icon-container">
       <img src={icon.image} alt={icon.title} className="room-icon" />
     </div>
      <div className="floor-stats">
        <p className="stat-item-rooms">{roomCount} Rooms</p>
        <p className="stat-item-floors">{floorCount} Floor</p>
        
      </div> 
      <div className='parent-container'> 
        <div className="available-stat-container">
            <p className="available-stat">Available: {availableCount}</p>
        </div>
        
      </div>
    </div>
  );
}