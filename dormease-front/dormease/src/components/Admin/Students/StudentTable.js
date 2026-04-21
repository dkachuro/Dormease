import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { api } from "../../../services/api"; 
import './StudentTable.css';

const StudentTable = () => {
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all'); 

useEffect(() => {
  const fetchStudents = async () => {
    try {
      const response = await api.getUsersList(); 
      const formatted = response.data
        .filter((u) => u.role === "user") 
        .map((u) => ({
          id: u.id,
          fullName: `${u.first_name} ${u.last_name}`,
          group: u.group,
          email: u.email,
          checkInDate: u.move_in_date,
          checkOutDate: '2026-06-30', 
          room_number: u.room_number,
          role: u.role,
        }));
      setStudents(formatted);
    } catch (error) {
      console.error("Ошибка при получении пользователей:", error);
    }
  };

  fetchStudents();
}, []);


const today = new Date().toISOString().split('T')[0];

const filteredStudents = students
  .filter((student) => {
    if (filter === 'current') {
      return student.checkOutDate === null || student.checkOutDate >= today;
    }
    if (filter === 'movedOut') {
      return student.checkOutDate !== null && student.checkOutDate < today;
    }
    return true; // for 'all'
  })
  .filter((student) => {
    const query = searchQuery.toLowerCase();
    return (
    (student.fullName || '').toLowerCase().includes(query) ||
    (student.email || '').toLowerCase().includes(query) ||
    (student.group || '').toLowerCase().includes(query) ||
    (student.room_number || '').toLowerCase().includes(query) ||
    (student.checkInDate || '').includes(query) ||
    (student.checkOutDate || '').includes(query)
  );
  });


  return (
    <div className="student-table-container">
      <h1 className="page-title-student">Students</h1>
      <div className="table-header">
        
        <div className="filter-buttons">
          <button onClick={() => setFilter('all')} className={filter === 'all' ? 'active' : ''}>All</button>
          <button onClick={() => setFilter('current')} className={filter === 'current' ? 'active' : ''}>Active</button>
          <button onClick={() => setFilter('movedOut')} className={filter === 'movedOut' ? 'active' : ''}>Inactive</button>
        </div>

        <div className="search-wrapper">
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <button className="search-icon-button">
            <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="m21 21-4.34-4.34" />
              <circle cx="11" cy="11" r="8" />
            </svg>
          </button>
        </div>
      </div>

      <table className="student-table">
        <thead>
          <tr>
            <th className="text-left">Full Name</th>
            <th className="text-left">Group</th>
            <th className="text-left">Email</th>
            <th className="text-left">Room</th>
            <th className="text-left">Move-in Date</th>
            <th className="text-left">Move-out Date</th>
            <th className="text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredStudents.map((student) => (
            <tr key={student.id}>
              <td className="text-left">{student.fullName}</td>
              <td className="text-left">{student.group}</td>
              <td className="text-left">{student.email}</td>
              <td className="text-left">{student.room_number}</td>
              <td className="text-left">{student.checkInDate || '-'}</td>
              <td className="text-left">{student.checkOutDate || '-'}</td>
              <td className="text-left">
                {student.checkOutDate === null || new Date(student.checkOutDate) > new Date()
                  ? <span className="status-current">Active</span>
                  : <span className="status-moved-out">Inactive</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentTable;