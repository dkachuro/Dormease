import React, { useState, useEffect } from "react";
import FloorFilter from "../../components/User/Room/Filter/FloorFilter";
import PeopleFilter from "../../components/User/Room/Filter/PeopleFilter";
import RoomTypeFilter from "../../components/User/Room/Filter/RoomTypeFilter";
import ClearFiltersButton from "../../components/User/Room/Filter/ClearFiltersButton";
import Legend from "../../components/User/Room/Legend/Legend";
import StepProgress from "../../components/User/Room/Progress/StepProgress";
import BuildingTypeCard from "../../components/User/Room/BuildingType/BuildingTypeCard";
import RoomTypeCard from "../../components/User/Room/RoomType/RoomTypeCard";
import { api } from "../../services/api";
import "../../components/User/Room/RoomSelectionPage.css";

export default function RoomSelectionPage() {
  const [isLoadingApp, setIsLoadingApp] = useState(true);
  const [application, setApplication] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [floor, setFloor] = useState("all");
  const [people, setPeople] = useState("all");
  const [type, setType] = useState("all");
  const [stepIndex, setStepIndex] = useState(0);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const [roommatesByRoom, setRoommates] = useState({});

  const [confirmError, setConfirmError] = useState(null);


  const [rooms, setRooms] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [applicationId, setApplicationId] = useState(null);
  const [alreadyInRoom, setAlreadyInRoom] = useState(false);

const handleConfirm = async () => {
  if (!selectedRoom?.id || !applicationId) {
    setConfirmError("Please select a room before confirming.");
    return;
  }

  try {
    const res = await api.selectRoom(applicationId, {
      room_id: selectedRoom.id,
    });
    setConfirmed(true);
    localStorage.setItem("roomConfirmed", "true");
    localStorage.setItem("selectedRoom", JSON.stringify(selectedRoom));
    setConfirmError(null); // сбрасываем ошибку при успехе
  } catch (error) {
    console.error("Room selection failed", error);
    if (
      error.response?.data?.error === "You are already settled into the room."
    ) {
      setConfirmError("You already live in a room and cannot choose another one.");
    } else {
      setConfirmError(
        "Error: " + (error.response?.data?.error || "Unknown error occurred.")
      );
    }
  }
};


  const clearFilters = () => {
    setFloor("all");
    setPeople("all");
    setType("all");
  };

  const goToNextStep = () => setStepIndex((prev) => Math.min(prev + 1, 2));
  const goToPrevStep = () => setStepIndex((prev) => Math.max(prev - 1, 0));

  const filteredRooms = rooms.filter((room) => {
    const inSelectedBuilding = selectedBuilding
      ? room.building === selectedBuilding.id
      : true;
    const floorMatch = floor === "all" || room.floor === Number(floor);
    const peopleMatch = people === "all" || room.capacity === Number(people);
    const typeMatch = type === "all" || room.gender_restriction === type;
    return inSelectedBuilding && floorMatch && peopleMatch && typeMatch;
  });

  const handleBuildingSelect = (building) => {
    setSelectedBuilding(building);
    goToNextStep();
  };

  const handleRoomSelect = async (room) => {
    setSelectedRoom(room);
    setConfirmError(null); 
    goToNextStep();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [roomsRes, buildingsRes, myAppRes, userRes] = await Promise.all([
          api.getRoomsList(),
          api.getBuildingsList(),
          api.getMyApplications(),
          api.getUserSelf(),
        ]);

        setRooms(roomsRes.data);
        setBuildings(buildingsRes.data);

        const activeStatuses = ["APPROVED", "PENDING"];
        const activeApp = Array.isArray(myAppRes.data)
          ? myAppRes.data.find((a) => activeStatuses.includes(a.status))
          : null;
        if (activeApp) {
          setApplication(activeApp);
          setApplicationId(activeApp.id);
          setIsApproved(activeApp.status === "APPROVED");
        }

        // if (app) {
        //   setApplication(app);
        //   setApplicationId(app.id);
        //   setIsApproved(app.status === "APPROVED");
        // }

        if (userRes.data.room_number) {
          setAlreadyInRoom(true);
        }


        await Promise.all(
          roomsRes.data.map(async (room) => {
            try {
              const res = await api.getRoommatesInfo(room.id);
              roommatesByRoom[room.id] = res.data;
            } catch (err) {
              console.error(
                `Failed to fetch roommates for room ${room.id}`,
                err
              );
              roommatesByRoom[room.id] = [];
            }
          })
        );
        setRoommates(roommatesByRoom);
        console.log("fuck", roommatesByRoom); // roommates теперь объект, а не массив
      } catch (error) {
        console.error("Initialization failed:", error);
      } finally {
        setIsLoadingApp(false);
      }
    };

    fetchData();
  }, []);

  if (isLoadingApp) {
    return <div>Loading...</div>;
  }

  if (!application) {
    return (
      <div className="personal-info-container">
        <h1>Room Selection</h1>
        <p className="subtitle">You haven't applied yet.</p>

        <div className="alert-box">
          <div className="info-message">
            <p>
              Please submit your application first to gain access to room
              selection.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (application) {
    if (application.status === "PENDING") {
      return (
        <div className="personal-info-container">
          <h1>Room Selection</h1>
          <p className="subtitle">Room Selection Is Not Available</p>

          <div className="alert-box">
            <div className="info-message">
              <p>
                Your application is under review. Please wait for the result.
              </p>
            </div>
          </div>
        </div>
      );
    }

    if (application.status === "REJECTED") {
      return (
        <div className="personal-info-container">
          <h1>Room Selection</h1>
          <p className="subtitle">Room Selection Is Not Available</p>

          <div className="alert-box">
            <div className="info-message">
              <p>
                Your application was rejected. You may contact support for
                clarification.
              </p>
            </div>
          </div>
        </div>
      );
    }

    if (application.status === "CANCELED") {
      return (
        <div className="personal-info-container">
          <h1>Room Selection</h1>
          <p className="subtitle">Room Selection Is Not Available</p>

          <div className="alert-box">
            <div className="info-message">
              <p>Your application was canceled. Try submit new one.</p>
            </div>
          </div>
        </div>
      );
    }
  }

  if (alreadyInRoom) {
    return (
      <div className="room-selection-page">
        <div className="already-in-room-message">
          <h2>You are already settled</h2>
          <p>
            You live in a room and cannot choose another one. You can check your
            room number in your profile.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="room-selection-page">
      <div className="page-intro">
        <h1 className="page-title">Choose room</h1>
        <p className="page-description">
          Select a building, filter rooms by parameters and confirm your choice.
        </p>
      </div>

      {(stepIndex === 0 || stepIndex === 1) && (
        <>
          <div className="filters-container">
            <div className="filters-left">
              <PeopleFilter
                value={people}
                onChange={setPeople}
                options={[
                  { value: "all", label: "All capacities" },
                  { value: "2", label: "2-person" },
                  { value: "3", label: "3-person" },
                ]}
              />
              <RoomTypeFilter
                value={type}
                onChange={setType}
                options={[
                  { value: "all", label: "All Rooms" },
                  { value: "female", label: "Female" },
                  { value: "male", label: "Male" },
                ]}
              />
              <FloorFilter
                value={floor}
                onChange={setFloor}
                maxFloor={selectedBuilding?.floors || 10}
              />
            </div>
            <div className="filters-right">
              <Legend />
              <ClearFiltersButton onClick={clearFilters} />
            </div>
          </div>
          <div className="progress-container">
            <StepProgress
              currentStepIndex={stepIndex}
              onStepClick={setStepIndex}
            />
          </div>
        </>
      )}

      {stepIndex === 0 && (
        <div className="cards-container">
          {buildings.map((building) => (
            <BuildingTypeCard
              key={building.id}
              icon={{ image: building.image, title: building.name }}
              roomCount={rooms.filter((r) => r.building === building.id).length}
              floorCount={building.floors}
              availableCount={
                rooms.filter((r) => r.building === building.id && !r.is_full)
                  .length
              }
              address={building.address}
              onNextStep={() => handleBuildingSelect(building)}
            />
          ))}
        </div>
      )}

      {stepIndex === 1 && (
        <div className="cards-container">
          {filteredRooms.length > 0 ? (
            filteredRooms.map((room) => {
              return (
                <RoomTypeCard
                  key={room.id}
                  room={{ ...room, planImage: room.image }}
                  roomates={roommatesByRoom[room.id]}
                  onNextStep={() => handleRoomSelect(room)}
                />
              );
            })
          ) : (
            <div className="no-rooms-message">
              <p>No rooms found matching your filters.</p>
            </div>
          )}
        </div>
      )}

      {stepIndex === 2 && selectedRoom && (
        <div className="confirmation-step">
          <StepProgress
            currentStepIndex={stepIndex}
            onStepClick={setStepIndex}
            isConfirmed={confirmed}
          />
          <h2>Confirm Your Room Selection</h2>
          <div className="confirmation-content">
            <div className="confirmation-image">
              <img src={selectedRoom.image} alt="Room" />
            </div>
            <div className="confirmation-info">
              <div className="confirmation-text">
                <p>Room Number: {selectedRoom.number}</p>
                <p>Building: {selectedRoom.building_name}</p>
                <p>Floor: {selectedRoom.floor}</p>
                <p>Capacity: {selectedRoom.capacity} person(s)</p>
                <p>Gender: {selectedRoom.gender_restriction}</p>
                <p>Status: {selectedRoom.is_full ? "Full" : "Available"}</p>
              </div>
              {roommatesByRoom[selectedRoom.id].length > 0 && (
                <div className="roommates-list">
                  <h3>Occupants</h3>
                  <ul>
                    {roommatesByRoom[selectedRoom.id].map((r) => (
                      <li key={r.id}>
                        <p>{r.name}</p>
                        <p>
                          Course: {r.course}, Group: {r.group}
                        </p>
                        {r.roommate_preferences && (
                          <p>Preferences: {r.roommate_preferences}</p>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
          {!confirmed && (
            <div className="confirmation-actions">
              <button className="conf-back-button" onClick={goToPrevStep}>
                Back
              </button>
              <button className="confirm-button" onClick={handleConfirm}>
                Confirm Booking
              </button>
            </div>
          )}
          {confirmed && (
            <p className="success-message">Room successfully selected!</p>
          )}
          {confirmError && (
    <p className="error-message">{confirmError}</p>
  
)}
        </div>
      )}
    </div>
  );
}
