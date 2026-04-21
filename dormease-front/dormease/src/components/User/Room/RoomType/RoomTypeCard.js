import { useState } from "react";
import ResidentTooltip from "./ResidentTooltip";
import "./RoomTypeCard.css";
export default function RoomTypeCard({ room, roomates, onNextStep }) {
  const [hovered, setHovered] = useState(false);

  const handleFloorSelect = (floor) => {
    if (onNextStep) {
      onNextStep(); // Переход к следующему шагу
    }
  };

  const isOccupied = roomates?.length >= room.capacity;
  const statusClass = isOccupied
    ? "legend-item occupied"
    : "legend-item available";

  return (
    <div
      className="room-card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleFloorSelect}
    >
      <div className="room-icon-container">
        <img src={room.image} alt="Room plan" className="room-icon" />
      </div>
      <div className="stat-item-rooms">Room {room.number}</div>
      <div className="stat-in-line">
        <div className="stat-item-floor">
          <p>Floor {room.floor}</p>
          <p>Capacity: {room.capacity}</p>
          <p>Gender: {room.gender_restriction}</p>
        </div>

        {/* Статус */}
        <div className="room-status">
          <div className="legend-container">
            <span className={`${statusClass}`}>
              {isOccupied ? "Occupied" : "Available"}
            </span>
          </div>
        </div>
      </div>
      {hovered && roomates?.length > 0 && (
        <div className="absolute z-50 top-2 left-[105%]">
          <ResidentTooltip residents={roomates} />
        </div>
      )}
    </div>
  );
}
