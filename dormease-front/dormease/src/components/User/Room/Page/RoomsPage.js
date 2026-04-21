import React, { useState, useEffect } from 'react';
import './RoomsPage.css';
import { api } from '../../../../services/api';

function RoomsPage() {
  const [rooms, setRooms] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [expandedRoom, setExpandedRoom] = useState(null);

  const toggleRoom = (roomId) => {
    setExpandedRoom(prev => (prev === roomId ? null : roomId));
  };

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await api.getRoomsList();

        // Загружаем резидентов по каждой комнате
        const formattedRooms = await Promise.all(
          response.data.map(async (room) => {
            let students = [];
            try {
              const roommatesRes = await api.getRoommatesInfo(room.id);
              students = roommatesRes.data.map(r => r.name);
            } catch (error) {
              console.warn(`Не удалось загрузить руммейтов комнаты ${room.id}`);
            }

            return {
              id: room.id,
              number: room.number,
              address: room.building_name || '—',
              total: room.capacity,
              free: room.capacity - room.occupied_count,
              students,
            };
          })
        );

        setRooms(formattedRooms);
      } catch (err) {
        console.error('Ошибка при загрузке комнат:', err);
      }
    };

    fetchRooms();
  }, []);

  const filteredRooms = rooms.filter(room => {
  const query = search.toLowerCase();

  const matchesSearch =
    room.number.toLowerCase().includes(query) ||
    room.address.toLowerCase().includes(query) ||
    room.students.some(student => student.toLowerCase().includes(query));

  const matchesFilter =
    filter === 'all' ||
    (filter === 'free' && room.free <= room.total) ||
    (filter === 'full' && room.free === 0);

  return matchesSearch && matchesFilter;
});


  return (
    <div className="rooms-page">
      <div className="header-container">
        <h1 className="page-title">Rooms</h1>

        <div className="controls-container">
          <select 
            value={filter} 
            onChange={e => setFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All</option>
            <option value="free">Available</option>
            <option value="full">Occupied</option>
          </select>

          <div className="search-container">
            <input
              type="text"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
            <span className="search-icon" />
          </div>
        </div>
      </div>

      <div className="table-container">
        <table className="rooms-table">
          <thead>
            <tr>
              <th className="room-col">Room</th>
              <th className="address-col">Building name</th>
              <th className="places-col">Places</th>
              <th className="status-col">Status</th>
              <th className="action-col"></th>
            </tr>
          </thead>
          <tbody>
            {filteredRooms.map(room => (
              <React.Fragment key={room.id}>
                <tr className="room-row">
                  <td className="room-col">
                    <div className="room-title">
                      <span className="list-room-icon" />
                      <span>№{room.number}</span>
                    </div>
                  </td>
                  <td className="address-col">{room.address}</td>
                  <td className="places-col">
                    <div className="places-info">
                      <span>Total: {room.total}</span>
                      <span>Available: {room.free}</span>
                    </div>
                  </td>
                  <td className="status-col">
                    <span className={`status ${
                      room.free === 0 ? 'full' :
                      room.free === room.total ? 'free' : 'partial'
                    }`} />
                  </td>
                  <td className="action-col">
                    {room.students.length > 0 && (
                      <button onClick={() => toggleRoom(room.id)} className="expand-btn">
                    {expandedRoom === room.id ? 'Hide' : 'View'}
                      </button>

                    )}
                  </td>
                </tr>
                {expandedRoom === room.id && room.students.length > 0 && (
                  <tr className="students-row">
                    <td colSpan="5">
                      <div className="students-container">
                        <h4 className="students-title">Resident Students:</h4>
                        <ul className="students-list">
                          {room.students.map((student, index) => (
                            <li key={index} className="student-item">
                              <span className="student-number">{index + 1}.</span>
                              <span className="student-name">{student}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RoomsPage;